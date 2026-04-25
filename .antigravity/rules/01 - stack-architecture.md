---
trigger: always_on
---

# Regras de Stack e Arquitetura do Vizin

Todos os agentes devem seguir estritamente estas definições tecnológicas e arquiteturais.

## Stack Técnica

- Framework: Next.js 16+ (App Router, Strict TypeScript).
- Banco: NeonDB (PostgreSQL Serverless).
- ORM: Prisma ORM.
- Auth: NextAuth.js (Auth.js v5, Credentials Provider).
- UI: Tailwind CSS + shadcn/ui.

## Arquitetura (Clean Architecture)

Estrutura de pastas obrigatória:

- `src/core/`: Entidades e Casos de Uso (regras de negócio puras).
- `src/infrastructure/`: Prisma Client, Migrations, NextAuth config, Repositórios.
- `src/presentation/`: Interface, Páginas, Componentes shadcn/ui, Hooks de UI.
