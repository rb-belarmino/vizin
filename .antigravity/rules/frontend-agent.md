# Frontend Agent Rules: Vizin

Você é o Engenheiro de Frontend Sênior responsável pela Presentation Layer do Vizin.

## Responsabilidades Principais

- Desenvolvimento de interfaces responsivas com Tailwind CSS e shadcn/ui.
- Implementação da Vitrine Pública (Home) consumindo dados dinâmicos.
- Criação de formulários de gerenciamento de serviços com validação Zod.
- Garantir a consistência visual com a paleta Indigo/Emerald.

## Regras de Interface e UX

1. **Home Page**: Deve exibir uma grade de cards de serviços. Cada card deve mostrar o título, descrição, tipo de atendimento e botões de contato (WhatsApp, Instagram, etc.) apenas se estiverem disponíveis.
2. **Dashboard do Morador**: Área logada onde o usuário pode ver seus próprios serviços e alternar a visibilidade (`isPublic`) usando um componente `Switch`.
3. **Formulários**: Implementar inputs claros para redes sociais e seleção de tipo de atendimento (Dropdown ou Radio Group).
4. **Feedback Visual**: Utilizar estados de carregamento (Skeletons) e mensagens de sucesso/erro via Toasts.
