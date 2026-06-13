# Taskboard — Despliegue

## Entornos y URLs

| Entorno | URL | Notas |
|---------|-----|-------|
| Desarrollo | http://localhost:5173 | Vite dev server + Docker postgres |
| Producción | http://tu-servidor-o-dominio | Stack Docker Compose completo |

## Arquitectura

```
                ┌─────────────────────────────────┐
                │   Host Docker (VPS / local)      │
                │                                  │
  Navegador ───►│  frontend:80  (nginx)            │
                │     │  sirve el SPA              │
                │     │  proxy /api/*              │
                │     ▼                            │
                │  backend:3000 (Hono/Node)        │
                │     │  API REST                  │
                │     │  ejecuta migraciones       │
                │     ▼                            │
                │  db:5432  (PostgreSQL 16)        │
                └─────────────────────────────────┘
```

## Setup del hosting

Tres servicios Docker en `docker-compose.prod.yml`:

| Servicio | Imagen | Rol |
|---------|-------|-----|
| `db` | postgres:16-alpine | Almacenamiento persistente |
| `backend` | construida desde `./backend` | API Hono + migraciones |
| `frontend` | construida desde `./frontend` | Nginx sirviendo el build React + proxy /api |

## Variables de entorno

Crea un fichero `.env.prod` en el host (nunca lo commits):

| Variable | Requerida | Por defecto | Propósito |
|----------|-----------|-------------|-----------|
| `POSTGRES_PASSWORD` | ✅ | — | Contraseña de PostgreSQL |
| `POSTGRES_USER` | — | `taskboard` | Usuario de PostgreSQL |
| `POSTGRES_DB` | — | `taskboard` | Nombre de la base de datos |
| `ALLOWED_ORIGIN` | ✅ | — | Origen CORS (ej. `http://192.168.1.100`) |
| `PORT` | — | `80` | Puerto del host para el frontend |

```bash
cp .env.prod.example .env.prod
# edita .env.prod con una contraseña real y la dirección de tu servidor
```

## Pipeline CI/CD

`.github/workflows/ci.yml` se ejecuta en cada push y pull request a `main`:

```
push / PR a main
  ├── test-backend    npm ci → npm test  (22 tests)
  ├── test-frontend   npm ci → npm test  (17 tests)
  └── build-images    (tras pasar los tests)
        ├── docker build ./backend
        └── docker build ./frontend
```

El despliegue a producción es **manual** — el pipeline verifica que el código es correcto, tú decides cuándo desplegar.

## Cómo desplegar

### Primera vez en el host

```bash
# 1. Instala Docker + Docker Compose
#    https://docs.docker.com/engine/install/

# 2. Clona el repositorio
git clone https://github.com/somber-lab/taskboard.git
cd taskboard

# 3. Crea el fichero de entorno de producción
cp .env.prod.example .env.prod
nano .env.prod          # establece POSTGRES_PASSWORD y ALLOWED_ORIGIN

# 4. Construye y arranca el stack
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. Verifica que todos los contenedores están corriendo
docker compose -f docker-compose.prod.yml ps
```

El backend ejecuta `drizzle-kit migrate` y el seed en el arranque — no hay que hacer nada en la BD manualmente.

### Actualizar a una nueva versión

```bash
git pull origin main
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Docker Compose reconstruirá solo los servicios que hayan cambiado.

## Cómo hacer rollback

### Opción A — revertir el código y reconstruir (recomendada)

```bash
# Encuentra el último commit bueno conocido
git log --oneline -10

# Vuelve a ese commit
git checkout <commit-hash>

# Reconstruye y redespliegua
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Opción B — etiquetar imágenes antes de desplegar (mejor práctica)

Antes de cada despliegue, etiqueta la imagen actual para rollback instantáneo:

```bash
docker tag taskboard-backend taskboard-backend:prev
docker tag taskboard-frontend taskboard-frontend:prev

# Para hacer rollback:
docker compose -f docker-compose.prod.yml down
docker tag taskboard-backend:prev taskboard-backend:latest
docker tag taskboard-frontend:prev taskboard-frontend:latest
docker compose -f docker-compose.prod.yml up -d
```

## Backups de la base de datos

```bash
# Backup manual
docker exec taskboard-db-1 pg_dump -U taskboard taskboard > backup_$(date +%Y%m%d).sql

# Restaurar
cat backup_20260613.sql | docker exec -i taskboard-db-1 psql -U taskboard taskboard
```

## Setup desde cero (recuperación ante desastre)

1. Provisionar un host con Docker + Docker Compose instalados.
2. Clonar el repo y crear `.env.prod` con los valores correctos.
3. Ejecutar `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build`.
4. Restaurar el último backup de la base de datos.
5. Verificar en `http://tu-servidor` — la app debe cargar con todos los datos.

Tiempo de recuperación total: ~10 minutos + tiempo de restauración del backup.
