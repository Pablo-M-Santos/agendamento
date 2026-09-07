# ANÁLISE ARQUITETURAL — Firebase Auth + Resend

> **Data:** 31/08/2026
> **Objetivo:** Validar arquitetura Opção B (Firebase gera link + Resend envia e-mail)
> **Status:** Análise técnica — sem implementação

---

## 1. Confirmação Técnica — `generateEmailVerificationLink`

**SIM, o Firebase Admin SDK possui o método necessário.**

### Documentação Oficial

Fonte: [Firebase Admin SDK - Email Action Links](https://firebase.google.com/docs/auth/admin/email-action-links)

```javascript
// Node.js Admin SDK
getAuth()
  .generateEmailVerificationLink(userEmail, actionCodeSettings)
  .then((link) => {
    // Construir e-mail customizado com o link
    // Enviar via Resend, SMTP, etc.
    return sendCustomVerificationEmail(userEmail, displayName, link);
  })
  .catch((error) => {
    // Tratar erro
  });
```

### Disponibilidade

| Recurso | Client SDK (`firebase`) | Admin SDK (`firebase-admin`) |
|---------|-------------------------|------------------------------|
| `sendEmailVerification()` | ✅ Sim | ❌ Não |
| `generateEmailVerificationLink()` | ❌ Não | ✅ Sim |
| `applyActionCode()` | ✅ Sim | ✅ Sim |

**Conclusão:** A Opção B é **tecnicamente viável** e **oficialmente documentada** pelo Firebase.

---

## 2. Comparação: Opção A vs Opção B

### Opção A — Firebase Envia Diretamente

```text
Frontend → Firebase Auth (createUserWithEmailAndPassword)
                ↓
         Firebase envia e-mail automaticamente
                ↓
         Template padrão do Firebase
```

| Aspecto | Avaliação |
|---------|-----------|
| **Implementação** | Simples — já está implementado |
| **Identidade visual** | ❌ Template genérico do Firebase |
| **Personalização** | ❌ Limitada (apenas no Firebase Console) |
| **Controle** | ❌ Sem controle sobre o envio |
| **Logs** | ❌ Sem visibilidade |
| **Rate limiting** | ✅ Gerenciado pelo Firebase |
| **Custo** | ✅ Incluído no Firebase |
| **Manutenção** | ✅ Zero manutenção |

### Opção B — Firebase Gera Link + Resend Envia

```text
Frontend → Backend API (Nuxt Server)
                ↓
         Firebase Admin SDK (createUser)
                ↓
         Firebase Admin SDK (generateEmailVerificationLink)
                ↓
         Resend (envia e-mail customizado)
                ↓
         Template HTML personalizado
```

| Aspecto | Avaliação |
|---------|-----------|
| **Implementação** | Média — requer backend |
| **Identidade visual** | ✅ Template HTML personalizado |
| **Personalização** | ✅ Total controle |
| **Controle** | ✅ Controle completo |
| **Logs** | ✅ Logs detalhados |
| **Rate limiting** | ⚠️ Precisa implementar |
| **Custo** | ⚠️ Custo do Resend (gratuito até 100 e-mails/dia) |
| **Manutenção** | ⚠️ Manutenção do backend |

---

## 3. Análise Detalhada — Opção B

### 3.1 Como gerar o link de confirmação

```typescript
// server/utils/firebase-admin.ts
import { getAuth } from 'firebase-admin/auth'

export async function generateVerificationLink(
  email: string,
  appUrl: string
): Promise<string> {
  const actionCodeSettings = {
    url: `${appUrl}/auth/action`,
    handleCodeInApp: false
  }

  const link = await getAuth().generateEmailVerificationLink(
    email,
    actionCodeSettings
  )

  return link
}
```

### 3.2 Como manter o Firebase responsável pela confirmação

O link gerado pelo `generateEmailVerificationLink` é **idêntico** ao gerado pelo `sendEmailVerification()` do Client SDK.

**Fluxo:**
1. Admin SDK gera o link com `oobCode` válido
2. Resend envia o e-mail com o link
3. Usuário clica → `/auth/action?mode=verifyEmail&oobCode=XXX`
4. Client SDK chama `applyActionCode($auth, oobCode)`
5. Firebase confirma o e-mail

**O `auth/action.vue` atual continua funcionando sem alterações.**

### 3.3 Como enviar via Resend

```typescript
// server/utils/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  to: string,
  verificationLink: string
) {
  await resend.emails.send({
    from: 'Agendamento <noreply@seudominio.com>',
    to,
    subject: 'Confirme seu e-mail — Agendamento',
    html: `
      <div style="font-family: 'Public Sans', sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://seudominio.com/logo.png" alt="Agendamento" width="120" />
        <h1 style="color: #002E29;">Confirme seu e-mail</h1>
        <p>Obrigado por se cadastrar! Clique no botão abaixo para confirmar:</p>
        <a href="${verificationLink}"
           style="display: inline-block; background: #002E29; color: #fff;
                  padding: 16px 32px; border-radius: 8px; text-decoration: none;">
          Confirmar E-mail
        </a>
        <p style="color: #666; font-size: 12px;">Link expira em 7 dias.</p>
      </div>
    `
  })
}
```

### 3.4 Configuração da URL de destino

```typescript
// ActionCodeSettings
const actionCodeSettings = {
  url: `${appUrl}/auth/action`,  // URL que processa a confirmação
  handleCodeInApp: false          // Abrir no navegador
}
```

**Importante:** A URL de destino **deve** estar configurada no Firebase Console em:
`Authentication → Settings → Authorized domains`

### 3.5 Compatibilidade com `auth/action.vue`

**O arquivo `auth/action.vue` NÃO precisa ser alterado.**

O link gerado pelo Admin SDK usa o mesmo protocolo:
- `mode=verifyEmail`
- `oobCode=XXX`

O `applyActionCode` continua funcionando normalmente.

### 3.6 Tratamento de links expirados/inválidos

O Firebase gerencia a expiração automaticamente:
- Links expiram em **7 dias** (padrão Firebase)
- `applyActionCode` retorna erro se o link for inválido/expirado
- O `auth/action.vue` já trata erros genéricos

**Melhoria sugerida:** Adicionar mensagens específicas:
```typescript
catch (error) {
  if (error.code === 'auth/invalid-action-code') {
    message = 'Link inválido ou expirado. Solicite um novo.'
  }
}
```

### 3.7 Implementação de reenvio

```typescript
// server/api/auth/resend.post.ts
export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  // Rate limiting
  await checkRateLimit(event, 'resend-verification', 3, 3600) // 3 por hora

  try {
    const link = await generateVerificationLink(email, appUrl)
    await sendVerificationEmail(email, link)

    return { ok: true, message: 'E-mail reenviado' }
  } catch (error) {
    // Não revelar se o usuário existe
    return { ok: true, message: 'Se o e-mail existir, enviaremos um link' }
  }
})
```

### 3.8 Prevenção contra abuso/Spam

| Estratégia | Implementação |
|------------|---------------|
| **Rate limiting por IP** | Máximo 5 cadastros/hora por IP |
| **Rate limiting por e-mail** | Máximo 3 reenvios/hora por e-mail |
| **Validação de e-mail** | Regex + verificação de domínio |
| **CAPTCHA** | ReCAPTCHA v3 no frontend (futuro) |
| **Logs de auditoria** | Registrar todos os envios |

### 3.9 Rate Limiting — Implementação

```typescript
// server/middleware/rate-limit.ts
const rateLimit = new Map<string, { count: number; resetAt: number }>()

export async function checkRateLimit(
  event: any,
  key: string,
  maxRequests: number,
  windowSeconds: number
) {
  const clientIp = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const rateKey = `${key}:${clientIp}`
  const now = Date.now()

  const record = rateLimit.get(rateKey)

  if (!record || now > record.resetAt) {
    rateLimit.set(rateKey, {
      count: 1,
      resetAt: now + windowSeconds * 1000
    })
    return
  }

  if (record.count >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Muitas tentativas. Tente novamente mais tarde.'
    })
  }

  record.count++
}
```

### 3.10 Proteção de Secrets

| Secret | Onde arquardar | Exposição |
|--------|----------------|-----------|
| `RESEND_API_KEY` | `process.env.RESEND_API_KEY` | ❌ Nunca no frontend |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `process.env.FIREBASE_ADMIN_PRIVATE_KEY` | ❌ Nunca no frontend |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `process.env.FIREBASE_ADMIN_CLIENT_EMAIL` | ❌ Nunca no frontend |

**Configuração no Nuxt:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-only (não exposto ao cliente)
    resendApiKey: process.env.RESEND_API_KEY,
    firebaseAdminPrivateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    firebaseAdminClientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,

    // Public (necessário no cliente)
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      // ... outras configs públicas
    }
  }
})
```

### 3.11 Tratamento de falhas do Resend

```typescript
// server/api/auth/register.post.ts
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  try {
    // 1. Criar usuário no Firebase
    const userRecord = await getAuth().createUser({
      email,
      password
    })

    // 2. Gerar link de verificação
    const verificationLink = await generateVerificationLink(email, appUrl)

    // 3. Enviar e-mail via Resend
    try {
      await sendVerificationEmail(email, verificationLink)
    } catch (emailError) {
      // Log do erro, mas não falha o cadastro
      console.error('Falha ao enviar e-mail:', emailError)
      // O usuário pode solicitar reenvio depois
    }

    return {
      ok: true,
      message: 'Cadastro criado. Verifique seu e-mail.'
    }
  } catch (error: any) {
    // Tratar erros do Firebase
    if (error.code === 'auth/email-already-exists') {
      throw createError({
        statusCode: 400,
        statusMessage: 'E-mail já cadastrado.'
      })
    }
    throw error
  }
})
```

### 3.12 Criação duplicada de usuários

**Problema:** E se o usuário for criado mas o e-mail não for enviado?

**Solução:**
1. Firebase rejeita e-mails duplicados (`auth/email-already-exists`)
2. Se o e-mail falhar, o usuário existe mas não verificou
3. Implementar endpoint de reenvio
4. Opcional: job para limpar usuários não confirmados após 7 dias

### 3.13 Compatibilidade com produção

| Aspecto | Status |
|---------|--------|
| **Firebase Auth** | ✅ Sem alterações |
| **Client SDK** | ✅ Sem alterações |
| **`applyActionCode`** | ✅ Continua funcionando |
| **`auth/action.vue`** | ✅ Sem alterações |
| **Middleware `auth.ts`** | ✅ Sem alterações |
| **Login** | ✅ Sem alterações |

---

## 4. Recomendação

### ✅ Opção B é a escolha correta

**Justificativa:**

1. **Tecnicamente viável** — `generateEmailVerificationLink` é oficial do Firebase Admin SDK
2. **Manutenção do Firebase** — A confirmação continua sendo feita pelo Firebase
3. **Identidade visual** — E-mails personalizados com a marca do sistema
4. **Controle total** — Logs, rate limiting, retry
5. **Compatibilidade** — Fluxo atual de confirmação permanece inalterado
6. **Custo benefício** — Resend gratuito até 100 e-mails/dia

### Fluxo Completo Recomendado

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐   │
│  │  Register Page  │     │   Login Page    │     │  auth/action.vue    │   │
│  └────────┬────────┘     └────────┬────────┘     └──────────┬──────────┘   │
└───────────┼───────────────────────┼───────────────────────────┼──────────────┘
            │                       │                           │
            ▼                       │                           ▼
┌───────────────────────┐           │               ┌───────────────────────┐
│  POST /api/auth/      │           │               │  applyActionCode()    │
│  register             │           │               │  (Firebase Client)    │
└───────────┬───────────┘           │               └───────────────────────┘
            │                       │
            ▼                       │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Nuxt Server)                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Rate Limiter Middleware                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│            │                       │                           │            │
│            ▼                       │                           ▼            │
│  ┌─────────────────┐               │               ┌─────────────────────┐  │
│  │  Firebase Admin │               │               │  Firebase Admin     │  │
│  │  createUser()   │               │               │  (verificação)      │  │
│  └────────┬────────┘               │               └─────────────────────┘  │
│           │                        │                                         │
│           ▼                        │                                         │
│  ┌─────────────────┐               │                                         │
│  │  Firebase Admin │               │                                         │
│  │  generateEmail  │               │                                         │
│  │  Verification   │               │                                         │
│  │  Link()         │               │                                         │
│  └────────┬────────┘               │                                         │
│           │                        │                                         │
│           ▼                        │                                         │
│  ┌─────────────────┐               │                                         │
│  │  Resend API     │               │                                         │
│  │  (envia e-mail) │               │                                         │
│  └─────────────────┘               │                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquivos a Criar/Modificar

**Novos arquivos:**
```
server/
├── utils/
│   ├── firebase-admin.ts      # Inicialização do Admin SDK
│   └── resend.ts              # Client Resend
├── api/
│   └── auth/
│       ├── register.post.ts   # Endpoint de registro
│       └── resend.post.ts     # Endpoint de reenvio
├── templates/
│   └── email/
│       └── verification.html  # Template do e-mail
└── middleware/
    └── rate-limit.ts          # Rate limiting
```

**Arquivos a modificar:**
```
nuxt.config.ts                 # Adicionar variáveis server-only
app/composables/
  useRegisterPage.ts           # Chamar API em vez de Firebase direto
app/pages/
  register/index.vue           # Adicionar tela "Verifique seu e-mail"
.env                           # Adicionar RESEND_API_KEY e FIREBASE_ADMIN_*
```

**Arquivos que NÃO precisam de alteração:**
```
app/composables/useAuth.ts     # Mantido
app/pages/auth/action.vue      # Mantido
app/middleware/auth.ts         # Mantido
app/composables/
  useLoginPage.ts              # Mantido
```

---

## 5. Resumo Final

| Pergunta | Resposta |
|----------|----------|
| **Podemos usar `generateEmailVerificationLink`?** | ✅ Sim, é oficial do Admin SDK |
| **Firebase continua responsável pela confirmação?** | ✅ Sim, `applyActionCode` continua funcionando |
| **Resend é apenas o provedor de envio?** | ✅ Sim, apenas envia o e-mail |
| **Precisamos alterar `auth/action.vue`?** | ❌ Não, continua igual |
| **Precisamos alterar o login?** | ❌ Não, continua igual |
| **A Opção B é segura?** | ✅ Sim, se implementada corretamente |
| **Custo adicional?** | Resend gratuito até 100 e-mails/dia |

**Recomendação final: Implementar a Opção B.**

---

> **Nota:** Esta análise valida a viabilidade técnica da Opção B. A implementação deve seguir o plano de 8 fases documentado anteriormente.