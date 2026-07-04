# Regras do Projeto Vizin

Este arquivo contém as diretrizes arquiteturais e de estilo para o projeto Vizin. Os agentes de IA devem seguir estas regras estritamente ao escrever código para este repositório.

## 1. Arquitetura Hexagonal (Clean Architecture)

- **Separação de Responsabilidades**: O projeto Next.js utiliza uma separação lógica rigorosa baseada em Ports & Adapters.
- **Frontend Isolado**: Componentes de UI em `src/app` e `src/components` NUNCA devem importar ou instanciar o Prisma, bancos de dados, ou regras de negócio centrais.
- **A Ponte (Server Actions)**: A comunicação entre a UI e a infraestrutura deve ocorrer EXCLUSIVAMENTE através de Server Actions localizadas em `src/actions`. Estas actions agem como os Controladores (Driving Adapters).
- **Core e Infraestrutura**: Server actions devem delegar a lógica complexa de negócios para a camada `src/core/` (Entidades e Use Cases) e operações de banco de dados/serviços externos para `src/infrastructure/` (Driven Adapters).

## 2. Formulários e Validação

- **React Hook Form + Zod**: Todos os formulários na interface devem usar `react-hook-form` acoplado ao `zodResolver`.
- **Schemas Compartilhados**: Os schemas do Zod devem residir em `src/actions/schemas/` e ser utilizados tanto no Client-side (pelos forms) quanto no Server-side (pelas Server Actions) para garantir que a validação seja perfeitamente síncrona em ambas as pontas.

## 3. UI/UX e Design System

- **Variáveis CSS OKLCH**: O projeto utiliza um sistema de cores dinâmico configurado no `src/app/globals.css`. Nunca utilize cores hexadecimais rígidas ou cores padrão do Tailwind (ex: `bg-blue-500`) para elementos primários da marca. Sempre utilize as variáveis CSS semânticas do Tailwind (ex: `bg-primary`, `text-muted-foreground`).
- **Classes de Marca**:
  - Para fundos premium/hero: Utilize a utilitária `.hero-gradient`.
  - Para botões primários ou detalhes de destaque: Utilize a utilitária `.brand-gradient`.
  - Para modais e cards flutuantes sobre fundos escuros: Utilize a utilitária `.glass` para aplicar glassmorphism moderno.
- **Micro-interações**: Favoreça componentes vivos que respondem ao usuário. Exemplo: aplique animações suaves de entrada (como `.animate-slide-up` ou `.animate-fade-in`) e efeitos de elevação em hover (`hover:-translate-y-0.5`).

## 4. Atualizações de Banco de Dados

- **Prisma Schema**: Ao atualizar o `prisma/schema.prisma`, certifique-se de definir relações de exclusão adequadas (como `onDelete: Cascade`) caso haja dependências estritas.
- Ao gerar mocks ou seeds, adicione-os no script principal `prisma/seed.ts`.
