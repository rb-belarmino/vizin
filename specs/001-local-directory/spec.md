# Feature Specification: Vizin Marketplace

**Feature Branch**: `001-local-directory`

**Created**: 2026-07-03

**Status**: Draft

**Input**: User description: "Define the functional specification and product requirements for the Vizin platform..."

## Clarifications

### Session 2026-07-03
- Q: Registration Collision / Apartment Verification → A: Allow multiple accounts per apartment (e.g., spouses/roommates) without strict uniqueness, trusting the closed community nature.
- Q: Contact Links Validation → A: Use predefined structural fields (e.g., a specific field for WhatsApp number, another for Instagram handle) to enforce clean formatting.
- Q: Empty States & Zero Results → A: Display a simple "No results" message with a button to easily clear active filters/search.

### Session 2026-07-06
- Q: O que o sistema deve fazer se um usuário tentar recuperar a senha informando um e-mail não cadastrado? → A: Mostrar um erro explícito informando que o e-mail não foi encontrado, priorizando a usabilidade.

### Session 2026-07-07
- Q: Exibição do Apartamento → A: Permitir que os usuários ocultem o número do apartamento nos anúncios públicos por questões de privacidade. Opcional na visualização, mas obrigatório no cadastro.
- Q: O que acontece se o upload da imagem falhar por erro de rede ou tamanho? → A: Exibir um erro visual (Toast/Alerta) e impedir a criação do anúncio até que a imagem seja enviada com sucesso (imagens são estritamente obrigatórias).
- Q: Feedback visual de Upload e Publicação → A: O upload da imagem deve exibir um indicador visual de carregamento (loading) que deve engatilhar **imediatamente e absolutamente** (capturando qualquer drop, clique na área tracejada ou no botão). Ao clicar em publicar, o sistema deve mostrar uma mensagem de sucesso ("Publicado com sucesso") e redirecionar/focar na listagem atualizada do dashboard. Além disso, o Modal de Edição deve apresentar uma largura massiva (ex: max-w-4xl / w-[900px]) para proporcionar máximo conforto visual.
- Q: Onde o provedor cria novos serviços? → A: Para manter o painel organizado, a criação de novos serviços deve ocorrer em uma tela isolada dedicada (`/dashboard/novo`), enquanto o `/dashboard` atua apenas como inventário (Meus serviços cadastrados) contendo um botão de atalho para a tela de criação.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Service Catalog (Priority: P1)

As a resident looking for a service, I want to access a public, easily searchable catalog of my neighbors' offerings so that I can hire trusted members of my immediate community.

**Why this priority**: This is the core value proposition for the demand side of the marketplace. Without a searchable catalog, the directory has no value.

**Independent Test**: Can be fully tested by a non-authenticated user visiting the homepage (`/`) and verifying the display, search, and filtering of mocked or existing listings.

**Acceptance Scenarios**:

1. **Given** a non-authenticated user on the homepage, **When** the page loads, **Then** they see a dynamic grid of active public services sorted by newest first.
2. **Given** a user viewing a listing, **When** they inspect it, **Then** they see the image, category badge, title, description, price baseline, unit identification (if allowed by provider), and active contact links.
3. **Given** a user on the homepage, **When** they type a query in the global search bar, **Then** the grid updates in real-time to show matches in titles and descriptions.
4. **Given** a user on the homepage, **When** they click a category pill (e.g., Gastronomia), **Then** the grid isolates listings to that specific business vector.
5. **Given** a user viewing a listing, **When** they trigger the share action, **Then** the native share drawer opens (mobile) or the link is copied to the clipboard (desktop).

---

### User Story 2 - Provider Dashboard (Priority: P1)

As a resident provider, I want to securely log in to a private area to create, edit, or toggle the visibility of my service listings, ensuring my neighbors see accurate information and up-to-date contact links.

**Why this priority**: This is the core value proposition for the supply side. Providers must be able to manage their offerings to populate the catalog.

**Independent Test**: Can be fully tested by creating an account, logging in, and performing CRUD operations on listings in the isolated dashboard.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they attempt to access `/dashboard`, **Then** they are summarily redirected to `/login`.
2. **Given** a new resident, **When** they sign up with Full Name, Email, Password, and a strictly numerical Apartment Identification, **Then** their identity is created and they can access the dashboard.
3. **Given** an authenticated resident provider, **When** they access `/dashboard`, **Then** they see an isolated inventory grid containing only their personal service entries.
4. **Given** an authenticated provider, **When** they use the multi-input creation form and upload an image, **Then** a new listing is created with upload state indicators during the process.
5. **Given** an authenticated provider, **When** they delete a service instance or replace its illustration, **Then** the underlying framework drops the orphaned physical asset on the storage provider.

---

### User Story 3 - Perfil do Usuário (Priority: P2)

Como um residente cadastrado, quero ter um local seguro ("Minha Conta" ou "Perfil") para administrar meus dados pessoais (nome, apartamento) e alterar minha senha, garantindo que minhas informações de contato e segurança estejam sempre atualizadas.

**Acceptance Scenarios**:

1. **Dado** um usuário autenticado acessando `/dashboard/profile`, **Quando** a página carregar, **Então** ele verá seus dados atuais (Nome, Email, Apartamento) preenchidos no formulário.
2. **Dado** um usuário editando seu perfil, **Quando** ele enviar novos dados válidos para Nome ou Apartamento, **Então** o sistema atualizará seu perfil e refletirá essas mudanças em seus anúncios existentes. O campo de Email estará visível, porém desativado para edição (imutável).
3. **Dado** um usuário na área de segurança, **Quando** ele fornecer a senha atual correta e a nova senha, **Então** o sistema atualizará suas credenciais com sucesso.

---

### User Story 4 - Recuperação de Senha (Priority: P1)

Como um residente que esqueceu sua senha, quero poder solicitar um link seguro de recuperação para o meu e-mail cadastrado, para que eu possa recuperar o acesso à minha conta.

**Acceptance Scenarios**:

1. **Dado** um usuário na tela de login, **Quando** ele clicar em "Esqueci minha senha" e enviar seu e-mail, **Então** o sistema enviará um token de recuperação seguro para o endereço de e-mail informado — ou exibirá um erro explícito ("Email not found") caso o endereço não esteja cadastrado.
2. **Dado** um usuário com um link de recuperação válido, **Quando** ele acessá-lo e definir uma nova senha, **Então** sua senha será atualizada e ele será redirecionado para o login.

---

### Edge Cases

- **Image Upload Failure**: If the image upload fails due to network issues or file size limits, display a visual error (Toast/Alert) and block the listing creation until a successful upload occurs.
- **Empty Search Fallback**: Display a simple "No results" message with a button to easily clear active filters/search.
- **Account Collision**: Allow multiple accounts per apartment (e.g., spouses/roommates) without strict uniqueness, trusting the closed community nature.
- **Expired Recovery Link**: If a password recovery link expires before the user clicks it, show an invalid link warning and prompt them to generate a new one.
- **Unregistered Email Recovery**: If a user attempts to recover a password using an unregistered email, the system MUST display an explicit error message ("Email not found") instead of failing silently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a dynamic grid of active, public services on the home page (`/`), sorted by newest first.
- **FR-002**: System MUST render each listing with a main portfolio image, category badge with emoji (Gastronomia 🍽️, Reformas 🔨, Aulas 📚, Beleza 💇, Saúde 🏥, or Outros ⭐), title, clamped description, optional price baseline, provider full name, numerical unit identification (apartment number - if visibility is granted), and active contact trigger components.
- **FR-003**: System MUST provide a real-time global search mechanism indexing text matches inside titles and descriptions.
- **FR-004**: System MUST provide category quick filter pills to isolate listings.
- **FR-005**: System MUST support a native share system using the Web Share API (mobile drawer) with clipboard copy as desktop fallback, triggered from a share button on each listing card.
- **FR-006**: System MUST intercept unauthenticated access to `/dashboard/*` and redirect to `/login`.
- **FR-007**: System MUST collect Full Name, Email, Password, and strictly numerical Apartment Identification during Sign Up via the credentials form. For Google OAuth sign-up, only Full Name and Email are obtained from Google; Apartment ID is collected in a mandatory Onboarding step.
- **FR-008**: System MUST authenticate users via Email and Password OR via Google OAuth (Login com Google) for Log In.
- **FR-009**: System MUST isolate the dashboard inventory grid to show only the logged-in resident's listings.
- **FR-010**: System MUST provide a multi-input creation form for listings, including a visible file upload zone with visual loading states during upload, an option to hide their apartment number from public view, and MUST provide clear success feedback upon publishing before navigating the user to the updated grid.
- **FR-011**: System MUST instruct the storage provider to physically delete orphaned assets when a listing is purged or its image is switched.
- **FR-012**: System MUST use predefined structural fields (e.g., specific field for WhatsApp, another for Instagram) when creating listings to enforce clean contact formatting.
- **FR-013**: System MUST provide a protected route (`/dashboard/profile`) for authenticated users to view their current registration data (Name, Email, Apartment).
- **FR-014**: System MUST allow users to update their Full Name and Apartment ID, but MUST strictly prevent Email changes (immutable primary key).
- **FR-015**: System MUST provide a password change mechanism in the profile, requiring validation of the current password before applying the new encrypted password.
- **FR-016**: System MUST provide a public "Forgot Password" flow (`/forgot-password` and `/reset-password`) sending a secure (expiring) token via email to allow credential reset for accounts that lost access.
- **FR-016b**: System MUST display an explicit error message ("Email not found") on the `/forgot-password` form when the submitted email address does not match any registered account, prioritizing usability over security obfuscation.

### Key Entities

- **Resident (User)**: Represents a member of the condominium. Key attributes: Full Name, Email, Password Hash (optional — null for Google OAuth users), Apartment ID (optional until Onboarding is complete).
- **Service Listing**: Represents an offering by a resident. Key attributes: Title, Description, Portfolio Image URL, Category, Price Baseline, Contact Links (predefined structural fields for WhatsApp and Instagram), Visibility Status (Public/Hidden), Show Apartment Flag (Boolean), Reference to Provider (Resident).
- **Account (OAuth)**: Represents the link between a User and an external OAuth provider (e.g., Google). Managed automatically by Auth.js PrismaAdapter. Contains the provider name, providerAccountId, and OAuth tokens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Demand-side users can successfully load the homepage, search, and filter the catalog with immediate UI feedback (sub-second perceived latency).
- **SC-002**: Unauthenticated traffic attempting to reach `/dashboard` routes is successfully intercepted 100% of the time.
- **SC-003**: Supply-side users can complete the entire listing creation flow (including image upload) without errors.
- **SC-004**: Storage provider metrics confirm 1:1 parity with database state (zero orphaned image assets remaining after listing deletions or updates).

## Assumptions

- **Single-Tower Architecture**: The requirement for a strictly numerical Apartment Identification assumes the condominium is a single tower or block, meaning the unit number alone is uniquely identifying.
- **Image Optimization**: The UploadThing SDK will handle necessary image transformations or standardizations (resizing/compression) to maintain grid performance.
- **Approval Workflow**: Listings are instantly visible upon creation if flagged as public, assuming a high-trust neighborhood environment without pre-moderation requirements.
