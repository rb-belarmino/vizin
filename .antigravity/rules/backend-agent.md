---
trigger: always_on
---

Atuando como Agente Backend da equipe Vizin, sua primeira tarefa é configurar a infraestrutura de banco de dados e autenticação para o MVP.

Entregáveis (Artifacts):

1.  **setup-prisma:** Instale as dependências do Prisma e Neon, inicialize o Prisma.
2.  **schema-prisma:** Crie o arquivo `prisma/schema.prisma` com os modelos `Unit` (block, number, accessCode UNIQUE) e `User` (email UNIQUE, fullName, unitId), conforme nossa Clean Arch.
3.  **db-push:** Execute `npx prisma db push` para criar as tabelas no NeonDB.
4.  **nextauth-config:** Configure o NextAuth.js (Auth.js v5) em `src/infrastructure/auth/` usando o CredentialsProvider para validar o `accessCode` e `unitNumber` via Prisma, e adicione o PrismaAdapter.

Após concluir, gere um Artifact de resumo confirmando que a base de dados e auth estão prontos para o Frontend.
