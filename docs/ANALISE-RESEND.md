# ANÁLISE — E-MAIL DE CONFIRMAÇÃO / RESEND

> **Data da análise:** 31/08/2026
> **Escopo:** Fluxo de cadastro e confirmação de e-mail
> **Objetivo:** Propor arquitetura para integração com Resend

---

## 1. Fluxo Atual Mapeado

```text
Cadastro (register/index.vue)
  ↓
Validação (useRegisterPage.ts:27-47)
  ↓
createUserWithEmailAndPassword (Firebase Auth)
  ↓
sendEmailVerification (Firebase Auth) ← E-MAIL ENVIADO AQUI
  ↓
signOut (logout automático)
  ↓
Toast "Verifique seu email"
  ↓
Redirect para Login
  ↓
Usuário abre e-mail no cliente de e-mail
  ↓
Clica no link de confirmação
  ↓
/auth/action?mode=verifyEmail&oobCode=XXX
  ↓
applyActionCode (Firebase Auth)
  ↓
Redirect para /dashboard
```

### Arquivos envolvidos no fluxo

| Arquivo | Responsabilidade |
|---------|------------------|
| `app/pages/register/index.vue` | UI do cadastro |
| `app/composables/useRegisterPage.ts` | Lógica de cadastro e envio de verificação |
| `app/composables/useAuth.ts` | Autenticação Firebase (login, logout, sessão) |
| `app/pages/auth/action.vue` | Processa links de confirmação/reset |
| `app/middleware/auth.ts` | Proteção de rotas |
| `app/plugins/firebase.client.ts` | Inicialização do Firebase |
| `app/composables/useLoginPage.ts` | Validação de e-mail verificado no login |

---

## 2. Implementação Atual Detalhada

### 2.1 Cadastro — `useRegisterPage.ts`

```typescript
// Linha 62-68: Criação do usuário
const userCredential = await createUserWithEmailAndPassword(
  $auth,
  email.value.trim(),
  password.value
)

await sendEmailVerification(userCredential.user)
await signOut($auth)
```

**Observações:**
- Firebase cria o usuário E envia o e-mail de confirmação automaticamente
- `signOut` é chamado imediatamente após o envio
- Usuário é deslogado e redirecionado para login

### 2.2 Template de E-mail

**Não identificado no projeto.**

O Firebase usa seu template padrão de e-mail, que:
- Não tem identidade visual do sistema
- Não pode ser customizado sem configurar no Firebase Console
- Usa o domínio `@firebaseapp.com` ou domínio customizado configurado no Firebase

### 2.3 Confirmação — `auth/action.vue`

```typescript
// Linha 25-32: Processamento da confirmação
const verifyEmailAction = async () => {
  await applyActionCode($auth, oobCode.value)
  message.value = 'E-mail verificado com sucesso! Redirecionando...'
  setTimeout(() => {
    navigateTo('/dashboard')
  }, 1000)
}
```

**Observações:**
- Processa `mode=verifyEmail` e `mode=resetPassword`
- Sem tratamento de erro específico (genérico)
- Sem feedback visual elaborado
- Redirect direto para dashboard após 1 segundo

### 2.4 Verificação no Login — `useLoginPage.ts`

```typescript
// Linha 113-122: Bloqueio se e-mail não verificado
if (!$auth.currentUser?.emailVerified) {
  toast.add({
    title: 'Email nao verificado',
    description: 'Verifique seu email antes de entrar',
    color: 'warning'
  })
  await signOut($auth)
  return
}
```

**Observações:**
- Usuário não pode acessar sem confirmar o e-mail
- Sem opção de reenviar o e-mail de confirmação
- Sem tela intermediária "verifique seu e-mail"

---

## 3. Análise de Segurança

### Riscos Identificados

| Risco | Severidade | Descrição | Local |
|-------|------------|-----------|-------|
| **Template Firebase genérico** | 🟡 Médio | E-mail não reflete identidade visual do sistema | Firebase Console |
| **Sem rate limiting no cadastro** | 🟠 Alto | Sem proteção contra massa de cadastros | `useRegisterPage.ts` |
| **Exposição de e-mail no toast** | 🟢 Baixo | Toast "Verifique seu email" não expõe dados sensíveis | `useRegisterPage.ts:74` |
| **Sem confirmação de e-mail duplicado** | 🟡 Médio | Firebase retorna erro genérico para e-mail existente | `useRegisterPage.ts:86-88` |
| **Link de confirmação sem validação** | 🟡 Médio | Sem feedback claro para link inválido/expirado | `auth/action.vue:56-58` |
| **Sem proteção CSRF no action handler** | 🟡 Médio | Action page não valida origem da requisição | `auth/action.vue` |
| **Secrets Firebase expostos** | 🟢 Baixo | Config Firebase é pública por design (necessário para client) | `.env.example` |

### Recomendações de Segurança

1. **Rate limiting**: Implementar no backend antes de chamar Resend
2. **Validação de e-mail**: Usar biblioteca de validação mais robusta
3. **Feedback genérico**: Não revelar se e-mail está cadastrado
4. **Expiração de link**: Firebase usa 7 dias por padrão (não configurável via SDK)

---

## 4. Análise — Integração Resend

### 4.1 Onde a API do Resend deve ser chamada?

**Resposta: Sempre server-side (backend/API routes)**

Motivos:
- `RESEND_API_KEY` NUNCA deve ser exposta no frontend
- Previne abuso e uso não autorizado
- Permite implementar rate limiting
- Permite logs e auditoria

### 4.2 Arquitetura Atual vs Proposta

**Atual (Firebase apenas):**
```
Frontend → Firebase Auth → E-mail automático
```

**Proposta (Firebase + Resend):**
```
Frontend → Backend API → Resend → E-mail
                ↓
         Firebase Auth
```

### 4.3 Responsabilidades

| Serviço | Responsabilidade |
|---------|------------------|
| **Firebase Auth** | Autenticação, criação de usuários, verificação de tokens, sessão |
| **Resend** | Envio de e-mails transacionais com identidade visual |
| **Backend (Nuxt Server)** | Orquestração, rate limiting, logs, segurança |

### 4.4 Fluxo Proposto

```text
1. Usuário preenche cadastro
2. Frontend → Backend: POST /api/auth/register { email, password }
3. Backend → Firebase: createUserWithEmailAndPassword
4. Backend → Firebase: setCustomClaims ou gerar token customizado
5. Backend → Resend: Enviar e-mail com link customizado
6. Backend → Frontend: { ok: true, message: "Verifique seu e-mail" }
7. Usuário abre e-mail e clica no link
8. Link → Backend: GET /api/auth/verify?token=XXX
9. Backend → Firebase: applyActionCode ou custom verification
10. Backend → Frontend: Redirect para confirmação
```

---

## 5. Arquitetura Proposta para V2

### 5.1 Estrutura de Arquivos

```
server/
├── api/
│   ├── auth/
│   │   ├── register.post.ts      # Cria usuário + envia e-mail
│   │   ├── verify-email.get.ts   # Confirma e-mail
│   │   └── resend.post.ts        # Reenvia e-mail
│   └── utils/
│       ├── firebase-admin.ts     # Admin SDK (server-side)
│       └── resend.ts             # Client Resend
├── templates/
│   └── email/
│       ├── verification.html      # Template de confirmação
│       └── welcome.html          # Template de boas-vindas
└── middleware/
    └── rate-limit.ts             # Rate limiting
```

### 5.2 Por que Firebase Admin SDK?

- **Client SDK** (`firebase`): Limitado, sem gerenciamento de usuários
- **Admin SDK** (`firebase-admin`): Controle total, server-side, seguro

Vantagens:
- Criar usuários sem logar
- Gerar tokens customizados
- Verificar e-mails programaticamente
- Buscar dados de usuários
- Desabilitar/habilitar contas

### 5.3 Configuração Necessária

#### Variáveis de Ambiente

```env
# Firebase Admin (server-side, secret)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=Agendamento

# App
NUXT_PUBLIC_APP_URL=
```

**Importante:**
- `FIREBASE_ADMIN_*` = server-only (nunca expostas)
- `RESEND_API_KEY` = server-only (nunca expostas)
- `NUXT_PUBLIC_*` = podem ser públicas

---

## 6. Experiência do Usuário — Proposta

### 6.1 Tela "Verifique seu E-mail"

Após cadastro, mostrar tela dedicada:

```text
┌─────────────────────────────────────┐
│                                     │
│         ✓ Cadastro Criado!          │
│                                     │
│   Enviamos um e-mail para:          │
│   usuario@email.com                 │
│                                     │
│   Verifique sua caixa de entrada    │
│   e clique no link de confirmação.  │
│                                     │
│   [Reenviar e-mail]                 │
│                                     │
│   Já confirmou? Fazer login         │
│                                     │
└─────────────────────────────────────┘
```

### 6.2 Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **Confirmação visual** | Tela dedicada após cadastro, não apenas toast |
| **Reenvio de e-mail** | Botão com cooldown (60s entre reenvios) |
| **Trocar e-mail** | Permitir alterar e-mail se digitado errado |
| **Feedback claro** | Mensagens específicas para cada estado |
| **Link expirado** | Tela específica com opção de reenviar |
| **Já confirmado** | Redirect automático para login |

### 6.3 Estados do E-mail

| Estado | Ação do Sistema |
|--------|-----------------|
| **Enviado** | Mostrar tela "Verifique seu e-mail" |
| **Confirmado** | Liberar acesso, redirect para dashboard |
| **Link inválido** | Mostrar erro com opção de reenviar |
| **Link expirado** | Mostrar erro com opção de reenviar |
| **Não recebido** | Permitir reenvio após 60s |
| **E-mail errado** | Permitir trocar e-mail (novo cadastro) |

---

## 7. Template de E-mail — Proposta

### 7.1 Estrutura

```html
┌─────────────────────────────────────┐
│  [LOGO DO SISTEMA]                  │
│                                     │
│  Confirme seu e-mail                │
│  ─────────────────────────────────  │
│                                     │
│  Olá, {nome}!                       │
│                                     │
│  Obrigado por se cadastrar no       │
│  Agendamento. Para começar a usar,  │
│  confirme seu e-mail:               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     Confirmar E-mail        │    │
│  └─────────────────────────────┘    │
│                                     │
│  Ou copie este link:                │
│  {link_confirmacao}                 │
│                                     │
│  Este link expira em 7 dias.        │
│                                     │
│  ─────────────────────────────────  │
│  Se você não criou esta conta,      │
│  ignore este e-mail.                │
│                                     │
│  © 2026 Agendamento                 │
└─────────────────────────────────────┘
```

### 7.2 Especificações

| Elemento | Valor |
|----------|-------|
| **Assunto** | Confirme seu e-mail — Agendamento |
| **From** | Agendamento <noreply@seudominio.com> |
| **Cores** | #002E29 (fundo), #4DA69C (accent), #FFFFFF (texto) |
| **Largura** | 600px (padrão e-mail) |
| **Botão** | Background #002E29, texto #FFFFFF, border-radius 8px |
| **Font** | Public Sans ou fallback Arial/Helvetica |

---

## 8. Variáveis de Ambiente

### 8.1 Novas Variáveis Necessárias

```env
# Firebase Admin SDK (server-only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noseuconfirma@seudominio.com
RESEND_FROM_NAME=Agendamento
```

### 8.2 Variáveis Existentes Relacionadas

| Variável | Uso atual | Manter? |
|----------|-----------|---------|
| `NUXT_PUBLIC_FIREBASE_API_KEY` | Client Firebase | Sim (necessária) |
| `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client Firebase | Sim |
| `NUXT_PUBLIC_FIREBASE_PROJECT_ID` | Client Firebase | Sim |
| `NUXT_PUBLIC_APP_URL` | Redirect URLs | Sim |

---

## 9. Impacto da Mudança

| Área | Arquivo | Impacto | Alteração necessária |
|------|---------|---------|----------------------|
| **Cadastro** | `useRegisterPage.ts` | Alto | Chamar API backend em vez de Firebase direto |
| **Cadastro** | `register/index.vue` | Médio | Adicionar tela "Verifique seu e-mail" |
| **Auth** | `useAuth.ts` | Baixo | Adaptar para tokens customizados se necessário |
| **API** | Novo `server/api/auth/register.post.ts` | Alto | Criar endpoint de registro |
| **API** | Novo `server/api/auth/verify-email.get.ts` | Alto | Criar endpoint de verificação |
| **API** | Novo `server/api/auth/resend.post.ts` | Médio | Criar endpoint de reenvio |
| **E-mail** | Novo `server/templates/email/verification.html` | Alto | Criar template HTML |
| **Middleware** | `auth.ts` | Baixo | Possível ajuste na verificação |
| **Configuração** | `nuxt.config.ts` | Baixo | Adicionar variáveis server-only |
| **Firebase** | Console | Médio | Configurar domínio customizado |
| **Resend** | Dashboard | Alto | Configurar domínio e API key |
| **Action page** | `auth/action.vue` | Médio | Redirect para novo fluxo |

---

## 10. Plano de Implementação

### Fase 1 — Preparação do Resend

**Objetivo:** Configurar conta e domínio no Resend

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Criar conta no Resend | - | Baixo |
| Configurar domínio (ex: `seudominio.com`) | Resend Dashboard | Médio |
| Verificar DNS (SPF, DKIM, DMARC) | DNS Provider | Médio |
| Obter API Key | Resend Dashboard | Baixo |
| Configurar `RESEND_API_KEY` no `.env` | `.env` | Baixo |

---

### Fase 2 — Backend/Server-side

**Objetivo:** Criar API routes no Nuxt

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Instalar `firebase-admin` | `package.json` | Baixo |
| Instalar `@resend/resend` ou SDK | `package.json` | Baixo |
| Criar `server/utils/firebase-admin.ts` | Novo | Médio |
| Criar `server/utils/resend.ts` | Novo | Baixo |
| Configurar Admin SDK | `nuxt.config.ts` | Médio |
| Testar conexão Firebase Admin | - | Médio |

---

### Fase 3 — Template do E-mail

**Objetivo:** Criar template HTML profissional

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Criar template de verificação | `server/templates/email/verification.html` | Baixo |
| Testar em clientes de e-mail | - | Médio |
| Adicionar fallback para texto puro | Template | Baixo |
| Configurar logo e cores | Template | Baixo |

---

### Fase 4 — Integração com Cadastro

**Objetivo:** Substituir envio Firebase por Resend via backend

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Criar `server/api/auth/register.post.ts` | Novo | Alto |
| Atualizar `useRegisterPage.ts` para chamar API | `useRegisterPage.ts` | Alto |
| Remover `sendEmailVerification` do client | `useRegisterPage.ts` | Médio |
| Testar fluxo completo de cadastro | - | Alto |

---

### Fase 5 — Reenvio

**Objetivo:** Permitir reenviar e-mail de confirmação

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Criar `server/api/auth/resend.post.ts` | Novo | Médio |
| Criar UI de reenvio | `register/index.vue` ou nova página | Médio |
| Implementar cooldown de 60s | Frontend | Baixo |
| Testar reenvio | - | Médio |

---

### Fase 6 — Tratamento de Erros

**Objetivo:** Melhorar feedback ao usuário

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Criar página de erro para link inválido | `pages/auth/verify-error.vue` | Baixo |
| Criar página de sucesso | `pages/auth/verify-success.vue` | Baixo |
| Melhorar mensagens de erro | `auth/action.vue` | Baixo |
| Adicionar logs de erro | Backend | Médio |

---

### Fase 7 — Segurança

**Objetivo:** Proteger endpoints e dados

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Implementar rate limiting | `server/middleware/rate-limit.ts` | Alto |
| Validar origem das requisições | Backend | Médio |
| Adicionar logs de auditoria | Backend | Médio |
| Testar abuso de endpoints | - | Alto |

---

### Fase 8 — Testes

**Objetivo:** Garantir funcionamento correto

| Tarefa | Arquivo | Risco |
|--------|---------|-------|
| Testar cadastro com Resend | - | Alto |
| Testar confirmação de e-mail | - | Alto |
| Testar reenvio | - | Médio |
| Testar link expirado | - | Médio |
| Testar rate limiting | - | Médio |
| Testar em produção (staging) | - | Alto |

---

## Recomendação Final

### Como implementar o Resend neste projeto?

**Arquitetura recomendada:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Register   │  │    Login     │  │  Verify Email Page   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Nuxt Server)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Rate Limiter Middleware                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│          │                 │                      │              │
│          ▼                 ▼                      ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ /api/register│  │  /api/resend │  │  /api/verify-email   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVIÇOS EXTERNOS                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │   Firebase Admin SDK    │  │         Resend API          │   │
│  │  - Criar usuário        │  │  - Enviar e-mail            │   │
│  │  - Verificar e-mail     │  │  - Template HTML            │   │
│  │  - Gerenciar contas     │  │  - Tracking                 │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Arquivos Envolvidos

**Novos arquivos:**
- `server/utils/firebase-admin.ts`
- `server/utils/resend.ts`
- `server/api/auth/register.post.ts`
- `server/api/auth/verify-email.get.ts`
- `server/api/auth/resend.post.ts`
- `server/templates/email/verification.html`
- `server/middleware/rate-limit.ts`
- `pages/auth/verify.vue`
- `pages/auth/verify-success.vue`

**Arquivos a modificar:**
- `app/composables/useRegisterPage.ts` — Chamar API em vez de Firebase direto
- `app/pages/register/index.vue` — Adicionar tela "Verifique seu e-mail"
- `app/pages/auth/action.vue` — Redirect para novo fluxo
- `nuxt.config.ts` — Adicionar variáveis server-only
- `.env` — Adicionar secrets

### Cuidados de Segurança

1. **Nunca expor `RESEND_API_KEY`** — Apenas server-side
2. **Nunca expor `FIREBASE_ADMIN_*`** — Apenas server-side
3. **Rate limiting** — Máximo 3 cadastros por IP/hora
4. **Validação de e-mail** — Regex + verificação de domínio
5. **Logs de auditoria** — Registrar todos os envios
6. **HTTPS obrigatório** — Em produção
7. **Sanitização de inputs** — Prevenir injeção

### Resumo

| Aspecto | Recomendação |
|---------|--------------|
| **Onde enviar** | Sempre server-side |
| **SDK Firebase** | Admin SDK para backend |
| **Template** | HTML customizado com identidade visual |
| **Rate limiting** | Obrigatório |
| **Segredos** | Apenas em variáveis server-only |
| **UX** | Tela dedicada "Verifique seu e-mail" |
| **Reenvio** | Com cooldown de 60s |

---

> **Nota:** Esta análise é baseada no código atual do projeto. Nenhuma implementação foi realizada.