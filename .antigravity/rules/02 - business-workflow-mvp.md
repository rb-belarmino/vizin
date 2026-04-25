---
trigger: always_on
---

# Regras de Negócio do MVP do Vizin

Este arquivo define o comportamento do sistema para a versão inicial.

## 1. Visibilidade Pública

- A Home page (`/`) deve listar dinamicamente todos os serviços cujo campo `isPublic` seja `true` no banco de dados.
- Qualquer pessoa na internet pode ver a Home e as páginas de detalhes dos serviços públicos.

## 2. Autenticação (Acesso Restrito)

- O Login (`/login`) é necessário APENAS para o gerenciamento de serviços.
- O morador faz login com email e senha ( Credentials Provider do NextAuth).
- Não há mais validação via código de acesso físico ou selo de segurança neste MVP.

## 3. Dados do Serviço

Todo serviço deve conter no banco de dados:

- Título, Descrição, Preço (Info),isPublic (Booleano).
- Contatos: WhatsApp, Instagram, Facebook, Site.
- Tipo de Atendimento: "A domicílio", "No meu apê", "Portaria".
