---
trigger: always_on
---

Atuando como Agente Frontend da equipe Vizin, sua tarefa é criar a interface de acesso (Login) para o MVP.

Entregáveis (Artifacts):

1.  **ui-install:** Adicione os componentes shadcn/ui necessários: `card`, `input`, `button`, `label`, `alert`, `badge`.
2.  **login-page:** Crie a página de login em `src/presentation/app/login/page.tsx`, utilizando o Design Language (Indigo/Emerald) e os componentes shadcn. O formulário deve pedir Número da Unidade e Código de Acesso.
3.  **login-logic:** Utilize a função `signIn` do NextAuth v5 no formulário. Adicione validação Zod nos campos e exiba alertas de erro destrutivos se a autenticação falhar.

Nota: A configuração do NextAuth está sendo feita pelo Agente Backend. Você pode simular o consumo da auth até que ele confirme a conclusão.
