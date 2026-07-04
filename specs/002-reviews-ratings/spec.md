# Feature Specification: Sistema de Avaliações e Estrelas (Reviews & Ratings)

## 1. Visão Geral
O sistema de avaliações visa gerar confiança na comunidade do condomínio. Moradores poderão avaliar os serviços uns dos outros usando um sistema clássico de 1 a 5 estrelas e deixando um comentário opcional sobre a experiência.

## Clarifications

### Session 2026-07-04
- Q: Does the system enforce that a resident actually utilized the service before rating, or can any resident rate any service? → A: (Recommended) Any resident can rate (Trust-based community)
- Q: If a service listing is deleted by the provider, what happens to the associated reviews? → A: (Recommended) Hard delete (Cascade delete) - reviews are purged with the service.
- Q: Can residents delete a review they previously left, or are they only able to update it? → A: (Recommended) Allow deletion (users should control their data).
- Q: Since comments are optional, is there a mechanism to report or moderate inappropriate review comments? → A: (Recommended) No built-in reporting (rely on community trust/offline resolution for now).

## 2. Histórias de Usuário (User Stories)

- **US1: Avaliar um serviço**
  - *Como* morador autenticado, *quero* poder dar uma nota de 1 a 5 estrelas e escrever um comentário sobre um serviço, *para que* outros moradores saibam da qualidade do serviço prestado (baseado na confiança da comunidade, sem necessidade de comprovar o uso prévio).
- **US2: Visualizar a reputação de um serviço**
  - *Como* visitante ou morador, *quero* ver a nota média de um serviço e o total de avaliações diretamente no cartão (Listing Card) no catálogo, *para* decidir rapidamente se o serviço é confiável.
- **US3: Ler avaliações detalhadas**
  - *Como* visitante ou morador, *quero* poder clicar nas estrelas de um serviço para ler os comentários detalhados deixados por outros vizinhos.

## 3. Requisitos Funcionais (FR)

- **FR-001**: O sistema DEVE permitir que apenas usuários autenticados (Logados) criem uma avaliação.
- **FR-002**: O sistema DEVE impedir que um provedor de serviço avalie o próprio serviço.
- **FR-003**: O sistema DEVE garantir que um usuário só possa deixar **uma única avaliação** por serviço (se tentar avaliar de novo, atualiza a anterior).
- **FR-003b**: O sistema DEVE permitir que o usuário exclua sua própria avaliação a qualquer momento.
- **FR-004**: Uma avaliação DEVE conter obrigatoriamente uma nota de 1 a 5 (inteiros) e, opcionalmente, um comentário de texto.
- **FR-005**: O catálogo público DEVE exibir a média aritmética das notas arredondada para 1 casa decimal e o número total de avaliações no `ListingCard`.
- **FR-006**: O sistema DEVE fornecer uma interface (modal ou página de detalhes) para listar todas as avaliações de um anúncio específico, mostrando a nota, o comentário, a data e o nome do avaliador.

## 4. Requisitos Não Funcionais (NFR)

- **NFR-001 (Performance)**: A média de estrelas deve ser calculada de forma eficiente. O Prisma permite agrupar ou podemos agregar no momento da consulta com `include` ou views, mas para esta escala, um `.aggregate()` simples é suficiente e deve responder em menos de 100ms.
- **NFR-002 (UX)**: A interface de seleção de estrelas deve ser reativa, preenchendo as estrelas ao passar o mouse (hover) antes do clique definitivo.

## 5. Edge Cases & Failure Handling

- **Exclusão de Serviço**: Se um provedor excluir seu serviço (Listing), todas as avaliações (Reviews) associadas àquele serviço devem ser excluídas automaticamente (Hard Delete / Cascade).
- **Moderação de Conteúdo**: Não há mecanismo nativo de denúncia (Report). Conflitos ou comentários inadequados devem ser resolvidos offline, confiando na natureza fechada da comunidade.
