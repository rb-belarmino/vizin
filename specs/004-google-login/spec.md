# Feature Specification: Google Login Integration

**Feature Branch**: `004-google-login`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "quero criar uma ova feature que sera para que seja possivel logar no sistema atraves do login do Google"

## Clarifications

### Session 2026-07-07
- Q: Como lidamos com novos usuários que fazem login pelo Google e não possuem o número do apartamento cadastrado? → A: Redirecionar para uma tela de onboarding (`/onboarding` ou `/completar-perfil`) obrigando o preenchimento do número do apartamento, pois essa informação é crítica para o funcionamento do marketplace local.
- Q: O que acontece com usuários existentes que tentam logar com o Google (mesmo email)? → A: A conta do Google deve ser automaticamente vinculada à conta existente através do endereço de e-mail, permitindo um login sem atrito.
- Q: O PrismaAdapter do NextAuth tenta criar o usuário imediatamente após o callback do Google. Como lidamos com `apartmentId` e `passwordHash` que hoje são obrigatórios no DB? → A: **Opção A**. Alteraremos o banco de dados (`schema.prisma`) para tornar `apartmentId` (`Int?`) e `passwordHash` (`String?`) opcionais. O Middleware forçará o preenchimento do apartamento em seguida.
- Q: O model de Account (para tokens OAuth) é necessário para o NextAuth. Devemos adicioná-lo? → A: Sim. Adicionar a infraestrutura completa do Auth.js no schema.
- Q: O usuário deve poder fazer Logout se ficar preso na tela de Onboarding com a conta errada? → A: Sim, incluir um botão explícito de "Sair" na UI do Onboarding.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autenticação via Google (Priority: P1)

Como um residente (usuário), quero poder fazer login usando minha conta do Google, para que eu tenha um acesso mais rápido e não precise memorizar mais uma senha.

**Acceptance Scenarios**:

1. **Given** um usuário na página de login (`/login`), **When** ele visualiza as opções, **Then** um botão explícito de "Continuar com o Google" deve estar disponível acima ou abaixo do formulário de login padrão.
2. **Given** um usuário clicando em "Continuar com o Google", **When** a autenticação é bem-sucedida, **Then** ele é logado no sistema e redirecionado para o `/dashboard`.
3. **Given** um usuário com e-mail já cadastrado (via senha) fazendo login pelo Google pela primeira vez, **When** o processo do Google finaliza, **Then** a conta é mesclada silenciosamente (Account Linking) e ele tem acesso aos seus dados.

---

### User Story 2 - Onboarding para Novos Usuários Google (Priority: P1)

Como um novo residente acessando o sistema via Google, quero poder fornecer meu número de apartamento logo no primeiro acesso, garantindo que eu cumpra os requisitos do sistema.

**Acceptance Scenarios**:

1. **Given** um novo usuário (cujo e-mail nunca foi cadastrado) fazendo login pelo Google, **When** ele retorna da tela de autenticação do Google, **Then** ele é redirecionado para uma tela de complemento de cadastro exigindo o "Número do Apartamento".
2. **Given** um usuário na tela de complemento de cadastro, **When** ele tentar acessar o `/dashboard` sem preencher, **Then** ele será bloqueado e forçado a retornar ou permanecer na tela de Onboarding.
3. **Given** um usuário na tela de complemento de cadastro, **When** ele clica no botão de Logout ("Sair"), **Then** a sessão é encerrada e ele é redirecionado para a página inicial ou de login.

### User Story 3 - Conta Híbrida (Senha Local para Usuários Google) (Priority: P2)

Como um residente que criou a conta através do Google, quero poder cadastrar uma senha local dentro do meu perfil, para que eu possa ter a flexibilidade de logar usando meu e-mail e senha caso eu perca acesso ao Google ou prefira não usar o botão de login social.

**Acceptance Scenarios**:

1. **Given** um usuário logado exclusivamente via Google acessando a página de Perfil, **When** ele visualiza a seção de Segurança, **Then** ele deve ver uma interface específica para "Criar uma Senha Local" em vez de "Alterar Senha".
2. **Given** um usuário logado via Google preenchendo a nova senha local, **When** ele submete o formulário, **Then** a senha deve ser criptografada, salva, e a interface deve se transformar imediatamente no padrão "Alterar Senha".
3. **Given** um usuário que criou uma senha local saindo do sistema (Logout), **When** ele tenta fazer login tradicional com E-mail e Senha, **Then** o acesso deve ser concedido e vinculado ao mesmo perfil.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer um botão "Continuar com o Google" na tela de Login (`/login`) e Registro (`/signup`).
- **FR-002**: O sistema DEVE utilizar o provedor de autenticação existente do projeto para gerenciar o OAuth 2.0 com o Google.
- **FR-003**: O sistema DEVE mapear os dados fornecidos pelo Google (Nome, E-mail) para a entidade de usuário existente (mapeando `fullName` para o `name` da sessão JWT e vice-versa).
- **FR-004**: O sistema DEVE garantir que, caso o e-mail retornado pelo Google já exista na base, ele relacione a conta OAuth à conta de e-mail/senha correspondente (Account Linking).
- **FR-005**: O sistema DEVE implementar uma etapa de *Onboarding* para novos usuários provenientes do Google que não possuem a propriedade de apartamento (`apartmentId` nulo), redirecionando-os para completá-la antes de usar o sistema. O Middleware (`proxy.ts`) deve proteger a aplicação contra acessos de usuários com `apartmentId` nulo.
- **FR-006**: A tela de *Onboarding* DEVE ter um botão/ação de Logout para impedir que usuários fiquem bloqueados caso tenham feito login com a conta Google incorreta.
- **FR-007**: O schema do banco de dados DEVE ser atualizado: tornar `passwordHash` e `apartmentId` opcionais e adicionar os models requeridos pelo NextAuth (ex: `Account`).
- **FR-008**: O sistema DEVE suportar a criação de senhas locais a posteriori (Contas Híbridas) para usuários de OAuth sem senha via Perfil.
- **FR-009**: A configuração do NextAuth DEVE ser separada em dois arquivos: `auth.config.ts` (Edge Runtime, mapeamento básico de JWT para Session do Middleware) e `auth.ts` (Node Runtime, validações que dependem do Prisma), devido a limitações do framework. O arquivo de middleware oficial do Next.js deve ser nomeado como `proxy.ts` devido à depreciação do nome `middleware.ts`.

### Key Entities

- **Resident/User**: A tabela passará a ter `apartmentId` e `passwordHash` como opcionais.
- **Account (OAuth)**: Nova tabela no banco. Armazena o `provider` (google), `providerAccountId` e tokens, além de relacionar com o ID do usuário (Auth.js Prisma Adapter).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo usuário consegue clicar em "Login com Google", autorizar o app, preencher seu apartamento e acessar o sistema perfeitamente em menos de 1 minuto.
- **SC-002**: Usuários antigos com senha conseguem clicar no Google e logar na mesma conta existente (Account Linking funciona perfeitamente, sem criar contas duplicadas).
- **SC-003**: Migração de banco de dados executada com sucesso, mantendo os dados de usuários e apartamentos atuais, porém flexibilizando a criação via provedor externo.

## Assumptions

- **Provedor OAuth**: Assumimos que o administrador irá configurar as credenciais do Google Cloud Console (`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`).
