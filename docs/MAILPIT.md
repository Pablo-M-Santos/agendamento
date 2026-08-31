# Mailpit — Ambiente Local de E-Mail

Mailpit é um servidor SMTP de desenvolvimento que captura e-mails enviados localmente. Ele permite testar o fluxo completo de confirmação de e-mail sem enviar mensagens reais.

## Arquitetura

### Desenvolvimento (Mailpit)

```
Frontend → Nuxt Server → Firebase Admin → Mailpit SMTP → http://localhost:8025
```

### Produção (Resend)

```
Frontend → Nuxt Server → Firebase Admin → Resend API → E-mail real
```

A troca entre provedores é automática baseada na variável `MAIL_PROVIDER`.

## Pré-requisitos

- Docker
- Docker Compose

## Como iniciar

### 1. Iniciar o Mailpit

```bash
docker compose up -d
```

O Mailpit estará disponível em:
- **SMTP**: `localhost:1025`
- **Web UI**: http://localhost:8025

### 2. Iniciar a aplicação

```bash
pnpm dev
```

## Como parar

```bash
docker compose down
```

## Variáveis de ambiente

Adicione no seu `.env` (baseado no `.env.example`):

```env
# Email Provider (server-only)
MAIL_PROVIDER=mailpit      # Use "mailpit" para desenvolvimento
MAIL_HOST=localhost       # Host do Mailpit
MAIL_PORT=1025            # Porta SMTP do Mailpit
MAIL_USER=                # Opcional: usuário SMTP
MAIL_PASSWORD=            # Opcional: senha SMTP
```

Para produção:

```env
MAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@seudominio.com
```

## Como testar o cadastro

1. Certifique-se de que o Mailpit está rodando: `docker compose ps`
2. Acesse http://localhost:8025 para ver a caixa de entrada
3. Inicie a aplicação: `pnpm dev`
4. Acesse http://localhost:3000/register
5. Preencha um e-mail e senha
6. Clique em "Criar conta"

## Como verificar o e-mail

1. Acesse http://localhost:8025
2. O e-mail enviado aparecerá na lista
3. Clique no e-mail para abrir
4. Verifique:
   - **Remetente**: Agendamento <noreply@agendamento.app>
   - **Destinatário**: o e-mail usado no cadastro
   - **Conteúdo**: link de confirmação

## Como confirmar a conta

1. No e-mail aberto no Mailpit, clique no botão "Confirmar E-mail"
2. Ou copie o link e cole no navegador
3. A página `auth/action.vue` receberá a ação
4. `applyActionCode()` será executado
5. O e-mail será confirmado no Firebase

## Diferença entre ambiente

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Provider | Mailpit | Resend |
| `MAIL_PROVIDER` | `mailpit` | `resend` |
| E-mails | Locais (não saem) | Reais (entregues) |
| Interface | http://localhost:8025 | N/A |
| SMTP/API | localhost:1025 | API Resend |

## Troubleshooting

### E-mail não aparece no Mailpit

1. Verifique se o container está rodando: `docker compose ps`
2. Verifique os logs: `docker compose logs mailpit`
3. Confira as variáveis de ambiente no `.env`

### Erro de conexão SMTP

1. Verifique se a porta 1025 está livre: `lsof -i :1025`
2. Reinicie o Mailpit: `docker compose restart`

### Mailpit não inicia

1. Verifique se o Docker está rodando: `docker info`
2. Verifique permissões na pasta do projeto

## Notas importantes

- **Nunca** use `MAIL_PROVIDER=resend` sem configurar `RESEND_API_KEY`
- O Mailpit armazena e-mails em volume Docker (dados persistem entre reinicializações)
- Para limpar e-mails: use a interface web ou recrie o volume: `docker compose down -v && docker compose up -d`
