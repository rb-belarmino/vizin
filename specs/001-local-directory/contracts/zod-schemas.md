# Validation Contracts (Zod Schemas)

Since the project uses Next.js 16 Server Actions as edge controllers, input boundaries are defined by Zod schemas to ensure strict validation before delegating to pure domain use-cases.

## Authentication Boundaries

### Registration Payload (Credentials)
> Usado apenas no cadastro via formulário (email + senha). Para usuários do Google, o `apartmentId` é coletado separadamente no Onboarding.
```typescript
const RegisterSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  apartmentId: z.coerce.number().int().positive() // obrigatório no fluxo de credenciais
});
```

### Login Payload (Credentials)
```typescript
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
```

### Onboarding Payload (Google OAuth — Complemento de Cadastro)
> Usado na tela `/onboarding` para usuários que autenticaram via Google e ainda não possuem `apartmentId`.
```typescript
const OnboardingSchema = z.object({
  apartmentId: z.coerce.number().int().positive()
});
```

## Listing Management Boundaries

### Create/Update Listing Payload
```typescript
const ListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  categoryId: z.enum(['Gastronomia', 'Reformas', 'Aulas', 'Beleza', 'Saúde', 'Outros']),
  portfolioImageUrl: z.string().url(),
  portfolioImageKey: z.string(),
  priceBaseline: z.string().optional(),
  whatsappNumber: z.string().regex(/^[0-9]+$/).optional(),
  instagramHandle: z.string().regex(/^[^@\s]+$/).optional(),
  visibilityStatus: z.enum(['Public', 'Hidden']).default('Public')
}).refine(data => data.whatsappNumber || data.instagramHandle, {
  message: "At least one contact method is required",
  path: ["whatsappNumber"]
});
```
