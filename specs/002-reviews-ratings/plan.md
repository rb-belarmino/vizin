# Implementation Plan: Sistema de Avaliações e Estrelas (Reviews & Ratings)

## 1. Abordagem Arquitetural
A funcionalidade será implementada seguindo a Arquitetura Hexagonal do projeto Vizin, distribuindo as responsabilidades de ponta a ponta:

1. **Infraestrutura (Prisma/DB)**: O `data-model.md` já define a tabela `Review`. O Prisma cuidará da agregação das notas (cálculo da média aritmética) diretamente via `_avg` para garantir performance (NFR-001).
2. **Core (Entidade)**: Criaremos uma interface TypeScript pura `Review` em `src/core/entities/review.ts` com os campos básicos da avaliação.
3. **Actions (A Ponte)**: Criaremos um novo arquivo `src/actions/review-actions.ts` contendo:
   - `createReviewAction(listingId, data)`: Valida sessão, impede autoavaliação (FR-002) e usa o `upsert` do Prisma para criar ou atualizar a avaliação (FR-003).
   - `getListingReviewsAction(listingId)`: Retorna a lista detalhada de avaliações de um serviço para exibição no modal.
4. **UI (Apresentação)**:
   - **`StarRating`**: Componente visual (somente leitura) que exibe as estrelas preenchidas com base na média.
   - **`ReviewForm`**: Formulário interativo com input de estrelas (rádios invisíveis com hover state em CSS/Tailwind) e campo de comentário.
   - **`ReviewsModal`**: Um modal expansível no catálogo público onde o usuário clica no serviço para ver a lista de comentários deixados por outros vizinhos e deixar o seu próprio.

## 2. Fases de Execução

### Fase 1: Banco de Dados e Contratos
O objetivo desta fase é deixar a base pronta.
1. Inserir o modelo `Review` no `schema.prisma`.
2. Executar `npx prisma db push` para criar as tabelas no Neon.
3. Atualizar a entidade `Listing` para receber `averageRating?: number` e `reviewCount?: number`.
4. Atualizar o método `findPublicListings` no `listing-repository.ts` para usar o `include: { _count: { select: { reviews: true } } }` e agregar a média.

### Fase 2: Backend (Server Actions e Validação)
O objetivo desta fase é criar as APIs seguras.
1. Criar o `ReviewSchema` com Zod (nota de 1 a 5).
2. Escrever a lógica do `createReviewAction`.
3. Escrever a lógica de busca detalhada (`getListingReviewsAction`).

### Fase 3: Frontend (Componentes de UI)
O objetivo desta fase é construir os blocos visuais.
1. Construir `StarRating.tsx` (visual) adaptado para frações (ex: 4.5 estrelas).
2. Construir `StarRatingInput.tsx` (interativo) usando Tailwind para os efeitos de cor e hover.
3. Atualizar o `ListingCard.tsx` para mostrar as estrelas e a contagem.

### Fase 4: Integração (O Modal de Avaliações)
O objetivo desta fase é juntar as pontas na tela final.
1. Implementar o botão no card que abre o `ReviewsModal`.
2. Dentro do modal, listar as avaliações de outros moradores.
3. Mostrar o formulário de avaliação apenas se o usuário estiver logado E não for o dono do serviço.

## 3. Riscos e Prevenções
- **Spam/Flood**: O uso de `upsert` (baseado em `@@unique([authorId, listingId])`) anula o risco de spam, pois requisições repetidas apenas sobrescrevem a nota anterior do próprio usuário.
- **Autoavaliação**: Validada rigidamente no Server Action (backend). Mesmo que um usuário mal-intencionado force um POST, a Action checará `if (listing.providerId === session.user.id) throw Error`.
