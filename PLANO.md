# Plano — Formulário de Inscrição de Voluntário (Ser Solidário)

Status: planejamento aprovado, aguardando início do desenvolvimento.

## 1. Objetivo

Criar a base de um site institucional para o Ser Solidário, implementando nesta primeira fase
apenas a seção/página do formulário de inscrição de voluntários, com os dados sendo salvos em
um banco de dados próprio (não planilha, não e-mail). A estrutura deve já nascer pronta para,
no futuro, receber as demais páginas do site completo.

## 2. Decisões já tomadas

- **Armazenamento:** banco de dados próprio (PostgreSQL).
- **Escopo atual:** apenas a página/seção do formulário. O restante do site fica como base
  (layout, header/footer, home placeholder) para expansão futura.
- **Stack:** Next.js (App Router, TypeScript) + PostgreSQL + Prisma (ORM) + Tailwind CSS.
- **Deploy:** Vercel (app) + banco gerenciado gratuito (Neon ou Supabase).

## 3. Formulário — perguntas e regras (conteúdo definido pelo usuário)

Título: **Formulário de Inscrição de Voluntário**

| Campo | Tipo | Obrigatório | Regras / lógica condicional |
|---|---|---|---|
| Nome completo | texto | sim | — |
| Idade | número | sim | — |
| Data de Nascimento | data | sim | — |
| Bairro onde mora | texto | sim | — |
| Whatsapp | texto/telefone | sim | — |
| E-mail | e-mail | sim | validar formato de e-mail |
| Instagram | texto | sim | — |
| Como conheceu o Ser Solidário? | rádio (escolha única) | sim | Opções: **Redes sociais** / **Indicação por outro voluntário** / **Indicação de amigos/família** / **Outro** |
| ↳ Nome do voluntário do Ser Solidário | texto (placeholder "Nome e Sobrenome") | condicional | aparece somente se "Indicação por outro voluntário" |
| ↳ Qual? | texto | condicional | aparece somente se "Outro" |
| O que você espera aprender ou vivenciar com o voluntariado do Ser Solidário? | texto longo | sim | — |
| Você já teve alguma experiência com trabalho voluntário? | rádio (Sim/Não) | sim | — |
| ↳ Conte um pouco sobre ela | texto longo | condicional | aparece somente se "Sim" |
| Em quais áreas você gostaria de contribuir como voluntário no Ser Solidário? | checkbox (múltipla escolha) | sim (mínimo 1) | Texto informativo: "Não é necessário ter experiência. Escolha as áreas que despertam seu interesse ou nas quais você gostaria de aprender e ajudar." |

Opções de áreas (checkbox, múltiplas):
1. **Mídias Sociais e Marketing** — criação e gerenciamento do conteúdo de divulgação e participação nos stories do Instagram
2. **Fotos e Vídeos** — fotografar e registrar os momentos das ações e eventos
3. **Recreação e Oficinas** — ajudar na organização e realização das atividades e oficinas
4. **Culinária e Alimentação** — ajudar no preparo e organização de lanches e alimentos
5. **Organização e Logística** — preparar e separar materiais, organizar os itens necessários para as ações e ajudar no transporte e na montagem

| Campo adicional | Tipo | Obrigatório | Regras |
|---|---|---|---|
| Concordo com o uso dos meus dados para contato do Ser Solidário (LGPD) | checkbox | sim | precisa estar marcado para permitir o envio |

### Decisões confirmadas com o usuário
- **Idade** e **Data de Nascimento** permanecem como dois campos independentes (sem cálculo
  automático de um a partir do outro), por escolha explícita do usuário.
- **Instagram**: máscara/formatação com `@` fixo no início (ex: `@usuario`).
- **WhatsApp**: máscara de telefone brasileiro `(99) 99999-9999`.
- **Consentimento LGPD**: incluído como campo obrigatório (checkbox) no formulário.

## 4. Modelagem de dados (rascunho do schema Prisma)

```prisma
model Volunteer {
  id                String   @id @default(cuid())
  fullName          String
  age               Int
  birthDate         DateTime
  neighborhood      String
  whatsapp          String
  email             String
  instagram         String

  howFoundOut       HowFoundOut
  referralName      String?     // preenchido se "Indicação por outro voluntário"
  otherSourceDetail String?     // preenchido se "Outro"

  expectations      String      // o que espera aprender/vivenciar

  hasExperience     Boolean
  experienceDetail  String?     // preenchido se hasExperience = true

  interestAreas     InterestArea[]

  lgpdConsent       Boolean   @default(false)

  status            VolunteerStatus @default(NOVO)
  createdAt         DateTime  @default(now())
}

enum HowFoundOut {
  REDES_SOCIAIS
  INDICACAO_VOLUNTARIO
  INDICACAO_AMIGOS_FAMILIA
  OUTRO
}

enum InterestArea {
  MIDIAS_SOCIAIS_MARKETING
  FOTOS_VIDEOS
  RECREACAO_OFICINAS
  CULINARIA_ALIMENTACAO
  ORGANIZACAO_LOGISTICA
}

enum VolunteerStatus {
  NOVO
  CONTATADO
  ATIVO
  INATIVO
}
```

## 5. Páginas da fase atual (3 páginas funcionando)

1. **`/voluntariado`** — formulário de inscrição (conteúdo da seção 3).
2. **`/voluntariado/confirmacao`** — página de confirmação exibida após o envio bem-sucedido
   (mensagem de agradecimento; sem acesso direto sem vir de um envio real).
3. **`/admin`** — painel simples para visualizar as inscrições recebidas (lista/tabela),
   protegido por senha única.
   - **`/admin/login`** — tela de login com a senha única.
   - Autenticação: senha única cujo hash bcrypt fica em variável de ambiente
     (`ADMIN_PASSWORD_HASH`, nunca a senha em texto puro), sessão via
     cookie assinado (httpOnly, secure em produção) após login correto. Middleware do Next.js
     protege todas as rotas `/admin/*` exceto `/admin/login`, redirecionando quem não estiver
     autenticado.

A home (`/`) do site institucional completo fica para uma fase futura — não faz parte das
3 páginas funcionando desta etapa.

## 6. Estrutura do projeto

```
formulario/
├── PLANO.md
├── src/
│   ├── app/
│   │   ├── voluntariado/
│   │   │   ├── page.tsx              # página do formulário de inscrição
│   │   │   └── confirmacao/
│   │   │       └── page.tsx          # página de confirmação pós-envio
│   │   ├── admin/
│   │   │   ├── page.tsx              # lista de inscrições (protegida)
│   │   │   └── login/
│   │   │       └── page.tsx          # login com senha única
│   │   ├── api/
│   │   │   ├── volunteers/
│   │   │   │   └── route.ts          # POST: valida (Zod) e grava no banco via Prisma
│   │   │   └── admin/
│   │   │       ├── login/route.ts    # POST: valida senha, cria cookie de sessão
│   │   │       └── logout/route.ts   # POST: destrói cookie de sessão
│   └── proxy.ts                       # protege /admin/* (convenção Next.js 16, antigo middleware.ts)
│   ├── components/
│   │   └── VolunteerForm.tsx         # componente do formulário (client component)
│   ├── lib/
│   │   ├── prisma.ts                 # client Prisma singleton
│   │   ├── validation.ts             # schema Zod compartilhado (client + server), com máscaras
│   │   └── auth.ts                   # helpers de sessão/cookie do admin
├── prisma/
│   └── schema.prisma
├── .env.example
└── package.json
```

## 7. Etapas de desenvolvimento

1. **Setup do projeto** — `create-next-app` (TypeScript, App Router, Tailwind, ESLint).
2. **Banco de dados** — criar instância gratuita (Neon ou Supabase), configurar `DATABASE_URL`,
   escrever `schema.prisma` (incluindo `lgpdConsent`), rodar migration inicial.
3. **Validação compartilhada** — schema Zod único usado no client (feedback imediato) e no
   server (fonte da verdade), cobrindo campos condicionais, máscaras (Instagram `@usuario`,
   WhatsApp `(99) 99999-9999`) e o checkbox de LGPD obrigatório.
4. **Formulário (frontend)** — construir `VolunteerForm.tsx` com todos os campos, máscaras de
   input, lógica condicional (mostrar/esconder conforme resposta), estados de erro/sucesso,
   responsivo (mobile-first). Ao enviar com sucesso, redireciona para `/voluntariado/confirmacao`.
5. **Página de confirmação** — `/voluntariado/confirmacao` com mensagem de agradecimento.
6. **API de gravação** — rota `POST /api/volunteers`: valida payload, grava no Postgres via
   Prisma, retorna sucesso/erro tratado.
7. **Proteção básica contra spam** — honeypot field invisível + rate limit simples por IP.
8. **Autenticação admin** — `ADMIN_PASSWORD_HASH` (hash bcrypt, nunca a senha em texto puro) em variável de ambiente, rota de login
   (`/admin/login` + `POST /api/admin/login`), cookie de sessão httpOnly assinado, middleware
   protegendo `/admin/*`, logout.
9. **Página admin** — `/admin` lista as inscrições (tabela com nome, contato, áreas de
   interesse, data, status), buscando os dados via Prisma no servidor (Server Component).
10. **Testes manuais** — fluxo completo (preencher → enviar → ver confirmação → conferir no
    admin), casos de borda (campos obrigatórios vazios, condicionais, e-mail inválido, LGPD
    desmarcado, tentativa de acessar `/admin` sem login).
11. **Deploy** — publicar banco gerenciado, configurar variáveis de ambiente (`DATABASE_URL`,
    `ADMIN_PASSWORD_HASH` (hash bcrypt, nunca a senha em texto puro), chave de sessão) na Vercel, deploy do projeto, teste em produção com
    envio real e login admin real.
12. **Entrega** — link final do formulário e do admin para o usuário, com a senha admin
    compartilhada de forma segura (fora do chat/commit).

## 8. Pós-deploy / próximos passos (fora do escopo desta fase)

- Login individual por pessoa no admin (em vez de senha única), se a equipe crescer.
- Filtros/exportação (CSV) e mudança de status direto pela página admin.
- Notificação por e-mail à equipe do Ser Solidário a cada nova inscrição.
- Domínio próprio.
- Demais páginas do site institucional completo (home real, sobre, ações, contato, doações etc.).

## 9. Checklist de progresso

- [ ] Setup do projeto Next.js
- [ ] Banco de dados provisionado e schema criado (com `lgpdConsent`)
- [ ] Validação (Zod) implementada com máscaras
- [ ] Formulário completo com lógica condicional (`/voluntariado`)
- [ ] Página de confirmação (`/voluntariado/confirmacao`)
- [ ] API de gravação funcionando localmente
- [ ] Proteção antispam
- [ ] Autenticação admin (senha única + sessão + middleware)
- [ ] Página admin listando inscrições (`/admin`)
- [ ] Testes manuais do fluxo completo (form → confirmação → admin)
- [ ] Deploy em produção
- [ ] Teste de ponta a ponta em produção
