# Boulevard Automoviles

Sitio web full-stack para Boulevard Automoviles, automotora de Rosario, Uruguay.

Incluye sitio publico, catalogo, ficha individual, comparador, WhatsApp directo, panel admin protegido, CRUD de autos, subida de imagenes a Supabase Storage, ficha tecnica automatica y SEO.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL en Supabase
- Supabase Storage
- Zod
- jose para sesiones admin

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run prisma:validate
npm run prisma:generate
npm run db:push
npm run db:seed
```

## Variables De Entorno

Copiar `.env.example` a `.env` y completar:

```bash
NEXT_PUBLIC_SITE_URL="https://tu-dominio.com"
NEXT_PUBLIC_WHATSAPP_PHONE="59800000000"
NEXT_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/tu-cuenta/"

DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

AUTH_SECRET="secreto-largo"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="contrasena-segura"

SUPABASE_URL="https://proyecto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
SUPABASE_BUCKET="autos"

OPENAI_API_KEY="opcional"
```

## Supabase

1. Crear proyecto en Supabase.
2. Copiar `DATABASE_URL` pooler y `DIRECT_URL` directa.
3. Crear bucket publico llamado `autos`.
4. Copiar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
5. Ejecutar:

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

El seed crea:

- Usuario admin.
- Configuracion del sitio.
- Precios de combustible demo.
- Referencias de consumo.
- 6 autos demo.

## Vercel

1. Crear proyecto en Vercel.
2. Conectar el repositorio.
3. Configurar Root Directory como `boulevard-web` si el repo contiene la carpeta superior.
4. Agregar las variables de entorno.
5. Deploy.
6. En produccion ejecutar migracion con `npm run db:push` desde un entorno con las variables cargadas.

## Admin

- Login: `/admin/login`
- Panel: `/admin`
- Autos: `/admin/autos`
- Configuracion: `/admin/configuracion`

No existe registro publico. El admin se crea por seed o variables de entorno.

## Ficha Tecnica Automatica

El admin puede buscar ficha tecnica desde el formulario del auto.

Orden de fuentes:

1. `fueleconomy.gov` para consumo cuando existe el modelo en mercado estadounidense.
2. `NHTSA vPIC` para confirmar marca/modelo/año cuando existe.
3. OpenAI como fallback opcional si `OPENAI_API_KEY` existe.

Si la fuente es IA se marca como `AI_ESTIMADO` y se obliga revision humana antes de publicar.

## SEO

- `sitemap.xml` dinamico.
- `robots.txt`.
- Metadata por auto.
- Open Graph con portada del auto.
- JSON-LD `Vehicle` en fichas.
- JSON-LD `AutoDealer` en inicio.
- `noindex` en comparaciones con query params.

## Notas

- Los autos vendidos pueden mostrarse u ocultarse desde admin.
- Las imagenes requieren minimo 3 y maximo 8.
- El comparador usa precios de combustible configurables.
- Las referencias de consumo por categoria son editables desde admin.
