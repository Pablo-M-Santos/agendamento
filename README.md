# Agendamento — Sistema de Agendamento de Serviços

Sistema web de agendamento de serviços focada em profissionais autônomos e pequenas empresas. Desenvolvido para resolver a necessidade real de organizar horários e serviços de forma simples, gratuita e confiável.

> **Mobile-first** — Toda a experiência é otimizada para navegação em smartphones, com uso frequente em uma mão.

---

## Sumário

1. [Arquitetura](#arquitetura)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Módulos](#módulos)
   - [Autenticação](#módulo-de-autenticação)
   - [Agendamentos](#módulo-de-agendamentos)
   - [Agenda](#módulo-de-agenda)
   - [Histórico](#módulo-de-histórico)
   - [Relatórios](#módulo-de-relatórios)
   - [Perfil](#módulo-de-perfil)
   - [E-mail (Backend)](#módulo-de-email-backend)
   - [Internacionalização & Tema](#módulo-de-internacionalização--tema)
5. [Modelo de Dados](#modelo-de-dados)
6. [Code Review](#code-review)
7. [Setup e Desenvolvimento](#setup-e-desenvolvimento)
8. [Deploy](#deploy)
9. [Roadmap](#roadmap)

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│  Nuxt 4 (SPA, ssr:false)                                  │
│                                                         │
│  Pages  →  Layouts  →  Composables  →  Components       │
│                                                         │
│  Plugins: Firebase Client SDK init                      │
│  Middleware: route protection (auth)                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Firebase (BaaS)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Auth        │  │  Firestore    │  │  Storage      │ │
│  │  (login,     │  │  (agendamentos│  │  (unused)     │ │
│  │   OAuth,     │  │   settings)   │  │               │ │
│  │   verify)    │  │               │  │               │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend (Nuxt Server)                 │
│  API Routes: /api/auth/register (POST)                  │
│  Server Utils: firebase-admin, email-service, resend,   │
│                 mailpit, gmail                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Provedores de E-mail                  │
│  Dev:  Mailpit (Docker SMTP) ↔ localhost:1025            │
│  Prod: Resend API (custom templates)                     │
│  Alt:  Gmail SMTP (via nodemailer)                       │
└─────────────────────────────────────────────────────────┘
```

### Padrão Arquitetural

- **SPA (Single Page Application)** — `ssr: false` no `nuxt.config.ts`
- **BaaS (Backend-as-a-Service)** — Firebase Auth + Firestore
- **Backend server-side** — Nuxt Server API routes para operações que exigem secrets (Admin SDK, envio de e-mails)
- **Composition API** — lógica de negócio encapsulada em composables
- **File-based routing** — Nuxt pages e Nuxt UI components

---

## Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 22 | Runtime |
| pnpm | 10.29.2 | Gerenciador de pacotes |
| Nuxt | ^4.3.1 | Framework (SPA) |
| Vue | 3.x | Framework frontend |
| TypeScript | ^5.9.3 | Tipagem estática |
| Tailwind CSS | ^4.1.18 | Estilização |
| @nuxt/ui | ^4.4.0 | Componentes UI |
| Firebase | ^12.9.0 | Auth + Firestore (client) |
| firebase-admin | ^13.10.0 | Backend (server-side) |
| resend | ^6.25.0 | Envio de e-mails (prod) |
| nodemailer | ^9.1.0 | Envio de e-mails (dev/alt) |
| date-fns | ^4.1.0 | Manipulação de datas |
| @heroicons/vue | ^2.2.0 | Ícones |
| apexcharts | ^7.1.0 | Gráficos (relatórios) |
| jspdf | ^4.2.1 | Exportação PDF |

---

## Estrutura de Pastas

```
agendamento/
├── app/
│   ├── assets/css/
│   │   └── main.css              # Tailwind + variáveis CSS
│   ├── components/
│   │   ├── auth/                  # Componentes de autenticação
│   │   ├── dashboard/             # Componentes do dashboard
│   │   ├── profile/               # Componentes de perfil
│   │   ├── reports/               # Componentes de relatórios
│   │   ├── schedule/              # Componentes da agenda
│   │   ├── charts/                # Componentes de gráficos (ApexCharts)
│   │   ├── DashboardSidebar.vue
│   │   ├── DashboardTopBar.vue    # (em dashboard/)
│   │   ├── BottomNav.vue
│   │   └── ModalAgendamento.vue
│   ├── composables/
│   │   ├── useAuth.ts             # Auth Firebase (login, logout, sessão)
│   │   ├── useAgendamentos.ts     # CRUD de agendamentos
│   │   ├── useSchedulePage.ts     # Lógica da página de agenda
│   │   ├── useLoginPage.ts        # Lógica da página de login
│   │   ├── useRegisterPage.ts     # Lógica de registro (chama API backend)
│   │   ├── useReportsPage.ts      # Lógica de relatórios
│   │   ├── useChartData.ts        # Processamento de dados para gráficos
│   │   ├── useReportPdf.ts        # Geração de PDF
│   │   ├── useUserSettings.ts     # Preferências (idioma, tema)
│   │   ├── useTheme.ts            # Tema escuro/claro
│   │   └── useAppI18n.ts          # Sistema de i18n customizado
│   ├── i18n/
│   │   ├── pt-BR.ts
│   │   ├── en-US.ts
│   │   └── es-ES.ts
│   ├── layouts/
│   │   └── app.vue                # Layout base
│   ├── middleware/
│   │   ├── auth.ts                # Proteção de rotas
│   │   └── legacy-routes.global.ts # Redirects de rotas legadas
│   ├── pages/
│   │   ├── auth/action.vue        # Handler de links (verificação e-mail)
│   │   ├── dashboard/index.vue
│   │   ├── history.vue
│   │   ├── index.vue              # Login
│   │   ├── profile/index.vue
│   │   ├── register/index.vue
│   │   ├── reports/index.vue
│   │   ├── reset-password/index.vue
│   │   └── schedule/index.vue
│   ├── plugins/
│   │   ├── firebase.client.ts     # Inicialização Firebase (client)
│   │   └── initAuth.client.ts     # Inicialização do Auth
│   ├── types/
│   │   └── agendamento.ts         # Tipos TypeScript
  │   ├── utils/
  │   │   ├── formatarTelefone.ts
  │   │   ├── formatarValor.ts
  │   │   └── validacao.ts            # Validação compartilhada (email, senha)
│   ├── app.config.ts
│   └── app.vue                    # Entry point
├── server/
│   ├── api/auth/register.post.ts  # Endpoint de registro (Admin SDK)
│   └── utils/
│       ├── firebase-admin.ts      # Admin SDK initialization
│       ├── email-service.ts       # Abstração de provedores de e-mail
│       ├── resend.ts              # Integração Resend (prod)
│       ├── mailpit.ts             # SMTP Mailpit (dev)
│       └── gmail.ts               # SMTP Gmail (alternativa)
├── public/                        # Assets estáticos
├── docs/                        # Documentação técnica
│   ├── ANALISE-TECNICA-V1.md
│   ├── ANALISE-RESEND.md
│   ├── ANALISE-ARQUITETURA-RESEND.md
│   ├── MAILPIT.md
│   └── images/
├── .github/workflows/ci.yml     # CI/CD (lint + typecheck)
├── firestore.rules              # Regras de segurança Firestore
├── firebase.json                # Config CLI Firebase
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                  # SPA rewrites
├── .env.example
└── pnpm-workspace.yaml
```

---

## Módulos

### Módulo de Autenticação

**Arquivos:** `composables/useAuth.ts`, `plugins/firebase.client.ts`, `pages/index.vue`, `pages/register/index.vue`, `pages/auth/action.vue`, `middleware/auth.ts`

**Funcionalidades:**
- Login com e-mail/senha e Google OAuth
- Verificação de e-mail obrigatória (bloqueia login até confirmação)
- Recuperação de senha
- Detecção de contas Google-only (orienta o usuário a usar Google)

**Fluxo:**
1. `firebase.client.ts` inicializa o Firebase Client SDK e fornece `$auth` e `$db` via `provide/inject`
2. `initAuth.client.ts` chama `useAuth().initAuth()` que registra `onAuthStateChanged`
3. Sessão gerenciada via `localStorage` (chave `agendamento-auth-session`) com expiração de 7 dias
4. `middleware/auth.ts` protege rotas — aguarda `loading` e redireciona para `/` se não autenticado
5. `useRegisterPage.ts` chama `POST /api/auth/register` (backend) em vez de criar usuário diretamente no client
6. `auth/action.vue` processa links de verificação via `applyActionCode`

**Decisão de projeto:** O registro agora vai pelo backend (`server/api/auth/register.post.ts`) usando Firebase Admin SDK, o que permite:
- Criar usuário server-side (não expõe credenciais no client)
- Gerar link de verificação via `generateEmailVerificationLink`
- Enviar e-mail customizado via Resend (prod) ou Mailpit (dev)

### Módulo de Agendamentos

**Arquivos:** `composables/useAgendamentos.ts`, `types/agendamento.ts`

**Operações CRUD:**
- `criarAgendamento()` — `addDoc` no Firestore
- `listarAgendamentos()` — query `where('userId', '==', user.uid)` (carrega tudo em memória)
- `editarAgendamento()` — `updateDoc`
- `excluirAgendamento()` — `deleteDoc`
- `atualizarStatus()` — toggle de `servicoConcluido` / `materialPronto`

**Validações:** cliente, número da casa, endereço e data são obrigatórios; valor validado como número positivo; senha mínima 6 caracteres.

### Módulo de Agenda

**Arquivos:** `pages/schedule/index.vue`, `composables/useSchedulePage.ts`, `components/schedule/*`

**Funcionalidades:**
- Carrossel de dias do mês (navegação entre meses via botões prev/next)
- Lista de agendamentos do dia selecionado
- Modal de criação/edição (`ModalAgendamento.vue`)
- Modal de detalhes (`ScheduleServiceDetailsModal.vue`)
- Confirmação de exclusão (`ScheduleConfirmDeleteModal.vue`)
- Toggle de status de serviço e material

**Componentes:**
| Componente | Responsabilidade |
|------------|-----------------|
| `ScheduleHeader.vue` | Título do mês + botões de navegação + botão de cadastro |
| `ScheduleDaysCarousel.vue` | Carrossel horizontal de dias com indicador de quantidade por dia |
| `ScheduleAppointmentsList.vue` | Lista de agendamentos do dia |
| `ScheduleServiceDetailsModal.vue` | Modal de visualização detalhada |
| `ScheduleConfirmDeleteModal.vue` | Modal de confirmação de exclusão |

### Módulo de Histórico

**Arquivo:** `pages/history.vue`

**Funcionalidades:**
- Lista todos os agendamentos do usuário
- Busca por cliente, endereço, número da casa e observações
- Filtros de status: todos, concluídos, abertos, material pronto, atrasados
- Ordenação por data (mais recentes primeiro)

**Observação:** Carrega todos os agendamentos em memória (sem paginação). Exibe data, valor (BRL), status de material e status do serviço.

### Módulo de Relatórios

**Arquivos:** `pages/reports/index.vue`, `composables/useReportsPage.ts`, `composables/useChartData.ts`, `composables/useReportPdf.ts`, `components/reports/*`

**Funcionalidades:**
- Períodos: 7 dias, 30 dias, mês atual
- Cards de resumo: total, concluídos, abertos, atrasados
- Taxa de conclusão
- Evolução diária (gráfico de linha)
- Distribuição por status (gráfico de pizza)
- Mapa de calor por dia/horário
- Insights rápidos e top clientes
- Exportação PDF

**Componentes de gráfico:**
| Componente | Tipo |
|------------|------|
| `ApexTrendChart` | Linha (evolução diária) |
| `ApexStatusStackedChart` | Barra empilhada (status) |
| `ApexDonutChart` | Donut (distribuição) |
| `ApexHourlyBarsChart` | Barra horizontal (horários) |
| `ApexMovementMapChart` | Mapa de calor (dia/horário) |
| `ApexPeriodComparisonChart` | Comparação entre períodos |
| `HeatmapChart` | Heatmap |

### Módulo de Perfil

**Arquivos:** `pages/profile/index.vue`, `composables/useUserSettings.ts`, `components/profile/*`

**Funcionalidades:**
- Exibição de dados da conta (UID, provedor de login, e-mail)
- Seleção de idioma (3 idiomas: PT-BR, EN-US, ES-ES)
- Tema (escuro — padrão, única opção atualmente)
- Logout

**Persistência:** Configurações salvas no Firestore (`user_settings`) e em cache local (`localStorage`).

### Módulo de E-mail (Backend)

**Arquivos:** `server/api/auth/register.post.ts`, `server/utils/firebase-admin.ts`, `server/utils/email-service.ts`, `server/utils/resend.ts`, `server/utils/mailpit.ts`, `server/utils/gmail.ts`

**Arquitetura:**
```
Frontend → POST /api/auth/register → Firebase Admin SDK
                                    → generateEmailVerificationLink
                                    → Resend / Mailpit / Gmail
```

**Provedores (configurados via `MAIL_PROVIDER`):**
| Provedor | Envio | Uso |
|----------|-------|-----|
| `mailpit` | SMTP (nodemailer → localhost:1025) | Desenvolvimento local |
| `resend` | API HTTP | Produção |
| `gmail` | SMTP (nodemailer) | Alternativa |

**Segurança:** Secrets (`RESEND_API_KEY`, `FIREBASE_ADMIN_*`) são server-only via `runtimeConfig` — nunca expostos ao cliente.

**Template de e-mail:** HTML customizado com identidade visual do sistema (cores #002E29, #4DA69C), logo e link de confirmação.

### Módulo de Internacionalização & Tema

**Arquivos:** `composables/useAppI18n.ts`, `composables/useTheme.ts`, `i18n/*.ts`

**i18n:** Sistema customizado (não usa `@nuxtjs/i18n`). Dicionários em arquivos `.ts`, seleção via `useUserSettings`. Fallback automático para PT-BR.

**Tema:** Dark mode é o padrão e única opção. `useTheme` aplica classe `dark` no `documentElement` no carregamento.

---

## Modelo de Dados

### Firestore Collections

#### `agendamentos`
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (auto) | — | ID do documento |
| `cliente` | string | ✅ | Nome do cliente |
| `numeroCasa` | string | ✅ | Número da casa |
| `endereco` | string | ✅ | Endereço completo |
| `valor` | number | ✅ | Valor do serviço (default: 0) |
| `data` | Timestamp | ✅ | Data/hora agendada |
| `materialPronto` | boolean/null | Não | Material no local |
| `servicoConcluido` | boolean/null | Não | Status de conclusão |
| `observacoes` | string | Não | Observações |
| `userId` | string | ✅ | ID do usuário dono |
| `createdAt` | Timestamp | ✅ | Data de criação |

#### `user_settings`
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `language` | string | ✅ | `pt-BR`, `en-US` ou `es-ES` |
| `theme` | string | ✅ | `dark` |
| `updatedAt` | Timestamp | Não | Última atualização |

### Relacionamentos
```
User (Firebase Auth)
    │
    ├── 1:N → agendamentos (via userId)
    └── 1:1 → user_settings (documentId = user.uid)
```

---

## Code Review

### 🔴 Problemas Críticos

| # | Problema | Local | Status |
|---|----------|-------|--------|
| 1 | **Sem regras de segurança Firestore** | Firebase Console | 🔧 **FIXED** — `firestore.rules` criado com isolamento por `userId` |
| 2 | **Sem testes automatizados** | Projeto inteiro | ✅ **RESOLVIDO** — Vitest + @nuxt/test-utils para unit tests, Playwright para e2e. Cobertura: utils, composables

### 🟠 Problemas de Alta Prioridade

| # | Problema | Local | Status |
|---|----------|-------|--------|
| 3 | **Carga total de dados sem paginação** | `useAgendamentos.ts:141-152` | 🔴 Aberto (requer cursor queries Firestore) |
| 4 | **Acoplamento direto ao Firebase** | Composables | 🟡 Em progresso (parcial — validação extraída) |
| 5 | **Sem rate limiting** | `server/api/auth/register.post.ts` | 🔧 **FIXED** — 5 tentativas / 15 min por IP |
| 6 | **Sem error boundaries** | App inteiro | 🟡 Parcialmente fixed (history.vue) |
| 7 | **Sem sanitização de inputs** | `useRegisterPage.ts` | 🔧 **FIXED** — `.trim().toLowerCase()` no endpoint + validação compartilhada |

### 🟡 Problemas de Média Prioridade

| # | Problema | Local | Status |
|---|----------|-------|--------|
| 8 | **Duplicação de validação** | `useLoginPage.ts` + `useRegisterPage.ts` | 🔧 **FIXED** — `utils/validacao.ts` |
| 9 | **Strings hardcoded** | `history.vue`, `useLoginPage.ts`, `useRegisterPage.ts`, `DashboardStatsCards.vue`, `dashboard/index.vue` | 🔧 **FIXED** — todos usam `t()` |
| 10 | **Locale fixo** | `history.vue`, `DashboardRecentServicesSection.vue` | 🔧 **FIXED** — `dateLocale` de `useUserSettings()` |
| 11 | **Estado de erro não exibido** | `history.vue` | 🔧 **FIXED** — `v-else-if="erro"` + try/catch |
| 12 | **Sem lazy loading** | Componentes | 🔴 Aberto |
| 13 | **Sem PWA** | `nuxt.config.ts` | 🔴 Aberto |
| 14 | **Logs via console** | Composables/server | 🟡 Mantido (appropriado para server-side warnings) |

### 🟢 Pontos Positivos

| Aspecto | Avaliação |
|---------|-----------|
| Arquitetura de composables | ✅ Separação clara (pages, components, composables) |
| Mobile-first | ✅ Interface responsiva otimizada para smartphones |
| i18n (3 idiomas) | ✅ Estrutura pronta para internacionalização |
| Tema escuro | ✅ Dark mode com persistência |
| Fluxo de autenticação | ✅ Completo (login, registro, verificação, reset) |
| TypeScript | ✅ Fortemente tipado |
| Backend de e-mail | ✅ Admin SDK + Resend/Mailpit/Gmail com abstração |
| CI/CD | ✅ GitHub Actions (lint + typecheck) |
| Code splitting | ✅ Automático via Nuxt |
| ESLint + Prettier | ✅ Configurados |
| Segurança de dados | ✅ Regras Firestore + Admin SDK server-side |
| Rate limiting | ✅ Proteção de endpoint de registro |

### Problemas Pendentes

Os itens abaixo precisam de atenção. Priorizados por impacto:

| Prioridade | Problema | Onde | O que fazer |
|-----------|----------|------|-------------|
| **Alta** | Sem rate limiting no login | `useLoginPage.ts` | Adicionar throttling no client ou backend |
| **Alta** | Paginação de agendamentos | `useAgendamentos.ts:144` | Migrar de `getDocs` para cursor queries com limite (ex: 50 por página) |
| **Alta** | Acoplamento direto ao Firebase | Composables | Criar interface/repository pattern (`AgendamentoRepository`) para abstrair Firestore |
| **Média** | Lazy loading de componentes | Todos os componentes pesados | Usar `defineAsyncComponent` para charts e modais |
| **Média** | PWA / offline | `nuxt.config.ts` | Adicionar `@vite-pwa/nuxt` |
| **Média** | Error boundaries app-wide | App inteiro | Adicionar `<NuxtErrorBoundary>` em componentes críticos |
| **Baixa** | Console logs estruturados | Composables/server | Substituir `console.log` por logger estruturado |

## Segurança

### Firestore Security Rules (`firestore.rules`)

Regras de segurança definidas para isolar dados por usuário:

- **`agendamentos/{id}`** — usuários só leem/escrevem agendamentos onde `userId == request.auth.uid`
  - `create`: valida `request.resource.data.userId`
  - `read/update/delete`: valida `resource.data.userId`
- **`user_settings/{uid}`** — document ID = UID do usuário; apenas o proprietário acessa
- **Default deny** — tudo não especificado é negado

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

### Rate Limiting (`server/api/auth/register.post.ts`)

- 5 tentativas de registro por IP a cada 15 minutos
- Retorna HTTP 429 quando excedido
- Baseado em Map em memória (reset em restart do servidor)

### Email Verification

- Usuário não ativo até clicar no link enviado via Resend (prod) ou Mailpit (dev)
- Link gerado via Firebase Admin SDK (`generateEmailVerificationLink`)
- Flow processado em `pages/auth/action.vue` via `applyActionCode`

---

## Changelog

### [V2] — Code Review & Melhorias

#### 🔒 Segurança
- **Firestore Security Rules** (`firestore.rules`) — isolamento de dados por usuário na coleção `agendamentos` e `user_settings`
- **Rate limiting** no endpoint de registro (5 req / 15 min por IP)

#### 🛠️ Refatoração
- **Validação compartilhada** — `app/utils/validacao.ts` com `validarEmail` e `validarSenha` usados por `useLoginPage.ts`, `useRegisterPage.ts` e `server/api/auth/register.post.ts`
- **i18n completo em history.vue** — todos os strings hardcoded substituídos por chaves `t()`, incluindo labels, placeholders, status e empty states
- **Locale dinâmico** — `history.vue` e `DashboardRecentServicesSection` agora usam `dateLocale` de `useUserSettings()` em vez de `ptBR` hardcoded
- **Formatação de moeda** — `formatarValor` no history usa `Intl.NumberFormat` com locale do usuário

#### 🐛 Correções
- **Duplicate `onMounted`** em `history.vue` — unificado em um único handler
- **Missing `watch` import** em `dashboard/index.vue` — adicionado
- **Error handling** em `history.vue` — try/catch adicionado, `v-else-if="erro"` exibindo erros reais
- **Strings hardcoded** em `DashboardStatsCards.vue` e `dashboard/index.vue` — substituídos por i18n

#### 🌐 i18n
- 40+ novas chaves adicionadas: `history.*`, `auth.*`, `dashboard.stats.*`, `dashboard.historyCard`, `dashboard.quickLinks.title`
- Traduções em PT-BR, EN-US e ES-ES

#### 📋 Remoções
- Módulo de notificações removido (3 arquivos deletados, referências limpas em 6 arquivos)

---

## Setup e Desenvolvimento

### Pré-requisitos
- Node.js 22
- pnpm 10.29.2
- Docker (opcional, para Mailpit)

### 1. Instalar dependências

```bash
cp .env.example .env
pnpm install
```

### 2. Configurar ambiente (.env)

```env
# App
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Client (público)
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (server-only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=""

# E-mail provider (server-only)
MAIL_PROVIDER=mailpit      # mailpit | resend | gmail
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

### 3. Iniciar ambiente de desenvolvimento

```bash
# Terminal 1: Mailpit (e-mails locais)
docker compose up -d

# Terminal 2: App
pnpm dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Mailpit Web UI: [http://localhost:8025](http://localhost:8025)

### 4. Testar fluxo de e-mail (dev)

1. Acesse `/register`
2. Cadastre um e-mail
3. Abra [http://localhost:8025](http://localhost:8025)
4. Clique no e-mail recebido → botão "Confirmar E-mail"
5. Faça login com o e-mail verificado

### 5. Build de produção

```bash
pnpm build
pnpm preview
```

---

## Deploy

| Componente | Plataforma | Config |
|------------|-----------|--------|
| Frontend | Vercel | `vercel.json` — SPA rewrites |
| Backend | Vercel (SSR) | Nitro server routes |
| Banco | Firebase Firestore | Google Cloud |
| Auth | Firebase Auth | Google Cloud |
| E-mails (prod) | Resend | API externa |
| E-mails (dev) | Mailpit | Docker local |

### CI/CD
`.github/workflows/ci.yml` — roda `pnpm lint` e `pnpm typecheck` em todo push, Node 22, ubuntu-latest.

---

## Roadmap

- [ ] **Crítico:** Regras de segurança Firestore
- [x] **Crítico:** Suite de testes (Vitest + Playwright)
- [ ] **Alto:** Paginação de agendamentos (cursor queries)
- [ ] **Alto:** Rate limiting no backend
- [ ] **Alto:** Error boundaries
- [ ] **Médio:** Search de CEP (autofill de endereço)
- [ ] **Médio:** Notificações push
- [ ] **Médio:** PWA / Service Worker
- [ ] **Médio:** Lazy loading de componentes
- [ ] **Futuro:** App mobile (Capacitor/Flutter)

---

> Sistema em uso real e evoluindo ativamente. Cada atualização é guiada por necessidades práticas do dia a dia.
