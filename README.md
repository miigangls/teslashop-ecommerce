## Teslo Shop — Migración a Next.js 15 (App Router)

Repositorio del proyecto de la tienda del proyecto **Teslo Shop** con **Next.js 15**, manteniendo el flujo original (auth, guards, catálogo con filtros en URL, admin CRUD) y aplicando una arquitectura por dominios (SRP/DRY) con separación clara entre **UI (client)** y **casos de uso / fetchers (server)**.

### Estado del proyecto

- Fase 0 ✅ setup (deps + shadcn + Jotai + React Query)
- Fase 1 ✅ layout/providers/rutas base
- Fase 2 ✅ auth (cookies httpOnly + JWT + middleware + endpoints)
- Fase 3 ✅ catálogo (filtros URL + Jotai + React Query + API mock)
- Fase 4 ✅ admin CRUD productos + uploads + invalidación cache
- Fase 5 ✅ hardening + documentación + `lint/build` verdes

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + `tailwind-merge`
- **TanStack React Query v5** (data remota / cache / invalidación)
- **Jotai** (estado global UI/auth/filtros)
- `react-hook-form` (formularios admin)
- `sonner` (toasts)
- `jose` (JWT)

## Arquitectura (por dominios)

Convención general:

- `src/app/*`: rutas (pages/layouts) y route handlers `src/app/api/*`
- `src/modules/<domain>/*`:
  - `infrastructure/`: tipos y contratos
  - `server/`: fetchers/acciones/persistencia mock
  - `sections/`: componentes UI + hooks del feature
  - `state/`: atoms/selectors (Jotai)
  - `utils/`: helpers puros

Estructura relevante:

```text
src/
  app/
    api/
      auth/*
      products/*
      files/product/*
    (ecommerce)/*
    (auth)/*
    (authenticated)/*
  modules/
    auth/
    products/
    fetch/
    common/
public/
  data/products.json
  data/users.json
  uploads/products/
```

## Setup

### Requisitos

- Node.js + pnpm

### Variables de entorno

- **`JWT_SECRET`** (obligatoria): firma/verificación del JWT.
- `NEXT_PUBLIC_APP_URL` (opcional): base URL para construir `NEXT_API_URL` (default `http://localhost:3000`).

Ejemplo:

```bash
export JWT_SECRET="dev-secret-change-me"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Rutas

- **Shop**: `/`, `/products`, `/gender/[gender]`, `/product/[idSlug]`
- **Auth**: `/auth/login`, `/auth/register`
- **Admin**: `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`

## Catálogo (Fase 3)

### Filtros (URL ↔ Jotai)

Search params soportados:

- `query`: texto de búsqueda
- `page`: página actual
- `sizes`: CSV (`xs,s,m,l,xl,xxl`)
- `price`: `any | 0-50 | 50-100 | 100-200 | 200+`
- `viewMode`: `grid | list`

Reglas:

- Cambiar `query/sizes/price/viewMode` **resetea `page=1`**.
- React Query construye `queryKey` con filtros + `gender`.

### API (mock)

- `GET /api/products`: filtros + paginación (lee `public/data/products.json`)
- `GET /api/products/[id]`: busca por `id` o por `slug`

## Auth (Fase 2)

### Cookies

- `auth_token` (JWT httpOnly)
- `auth_role` (`admin` / `user` httpOnly)

### Endpoints

- `POST /api/auth/login`
- `GET /api/auth/check-status`
- `POST /api/auth/logout`

### Middleware

Protege:

- `/admin/*`
- `/dashboard/*`

## Admin CRUD productos (Fase 4)

### UI

- `/admin/products`: tabla con búsqueda (`?query=`) + paginación
- `/admin/products/new`: creación
- `/admin/products/[id]`: edición (RHF)

### API (mock persistente)

- `POST /api/products`: crea producto y escribe `public/data/products.json`
- `PATCH /api/products/[id]`: actualiza producto y escribe `public/data/products.json`

### Upload de imágenes

- `POST /api/files/product`: `multipart/form-data` (key `file`) guarda en `public/uploads/products`
- `GET /api/files/product/[image]`: sirve la imagen (cache largo)

> Nota: la persistencia y uploads son **solo para demo/local** (no es storage productivo).

## Decisiones técnicas

- **React Query vs Jotai**
  - React Query: datos remotos (productos/auth status), caché e invalidación.
  - Jotai: estado global UI y sincronización URL↔filtros.
- **Cookies httpOnly vs localStorage**
  - Token en cookie httpOnly reduce superficie ante XSS vs `localStorage`.

## Troubleshooting

- **Falla auth/middleware**: verifica `JWT_SECRET`.
- **Cambios en data mock**: el CRUD escribe `public/data/products.json`.