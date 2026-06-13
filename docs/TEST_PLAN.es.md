# Taskboard — Plan de Tests

## Estrategia

**Clasificación**: prototipo → camino a producción  
**Pirámide**: unitario + integración (automatizado) + smoke manual (flujos UI).  
E2E con Playwright aplazado hasta que se confirme la clasificación de producción.

| Capa | Alcance | Herramientas |
|------|---------|--------------|
| Integración backend | Handlers de rutas Hono con DB mockeada | Vitest |
| Unitario frontend | Componentes React (render, interacción, validación) | Vitest + React Testing Library |
| Smoke manual | Flujos UI críticos no cubiertos por tests automáticos | Checklist abajo |

## Mapa de cobertura

| Historia | Criterio de aceptación | Tipo de test | Test ID | Estado |
|----------|----------------------|--------------|---------|--------|
| US-01 | Todas las tareas visibles con todos los campos | Manual | M-01 | ✅ |
| US-01 | Click en cabecera → orden asc; click otra vez → desc | Manual | M-02 | ✅ |
| US-01 | Estado vacío cuando no hay tareas | Manual | M-03 | ✅ |
| US-02 | Submit válido → tarea guardada en columna por defecto | Backend | tasks › POST acepta tarea sin fechas | ✅ |
| US-02 | Título vacío → error de validación, sin guardar | Backend + Frontend | tasks › POST rechaza título vacío / validación modal creación | ✅ |
| US-02 | Descripción vacía → error de validación, sin guardar | Backend + Frontend | tasks › POST rechaza descripción vacía / validación modal | ✅ |
| US-02 | Board preseleccionado; fechas opcionales aceptadas | Frontend | TaskModal › llama onSaved tras crear con éxito | ✅ |
| US-03 | Editar cualquier campo → persistido en todas las vistas | Backend | tasks › PATCH rechaza título/descripción vacíos | ✅ |
| US-03 | Borrar título o descripción → error de validación | Frontend | TaskModal edición › pre-rellena título y descripción | ✅ |
| US-04 | Borrar + confirmar → tarea desaparece de todas las vistas | Backend | tasks › DELETE devuelve 204 | ✅ |
| US-04 | Confirmación requerida antes de borrar | Frontend | TaskModal › muestra paso de confirmación / cancelar oculta confirm | ✅ |
| US-05 | Tareas en columnas correctas | Manual | M-04 | ✅ |
| US-05 | Columnas de izquierda a derecha | Manual | M-05 | ✅ |
| US-05 | Columnas vacías se muestran sin tareas | Manual | M-06 | ✅ |
| US-06 | Arrastrar a columna B → movimiento inmediato | Manual | M-07 | ✅ |
| US-06 | Recargar → tarea sigue en columna B | Manual | M-08 | ✅ |
| US-06 | Indicador visual en destinos de drop | Manual | M-09 | ✅ |
| US-07 | Crear board → aparece en selectores | Backend | boards › GET /boards devuelve lista | ✅ |
| US-07 | Nuevo board tiene 4 columnas por defecto | Manual | M-10 | ✅ |
| US-07 | Sin nombre → error de validación | Backend | boards › POST rechaza nombre vacío | ✅ |
| US-08 | Añadir columna → aparece al final a la derecha | Backend | boards › GET /boards/:id/columns | ✅ |
| US-08 | Sin nombre → error de validación | Backend | boards › POST rechaza nombre de columna vacío | ✅ |
| US-09 | Desglose de tareas por estado | Backend | dashboard › devuelve todos los campos de métricas | ✅ |
| US-09 | Completadas últimos 7/30 días | Backend | dashboard › devuelve todos los campos de métricas | ✅ |
| US-09 | Contador de sin planificar | Backend | dashboard › devuelve todos los campos de métricas | ✅ |
| US-09 | Contador de vencidas | Backend | dashboard › devuelve todos los campos de métricas | ✅ |
| US-09 | BD vacía manejada sin errores | Backend | dashboard › maneja BD vacía correctamente | ✅ |

## Suite automatizada

```
backend/   22 tests  (boards: 7, tasks: 11, dashboard: 4)
frontend/  17 tests  (TaskCard: 6, TaskModal: 11)
─────────────────────────────────────────────────────
Total      39 tests  ✅ todos en verde
```

## Checklist de QA manual

| ID | Flujo | Pasos | Esperado | Resultado |
|----|-------|-------|----------|-----------|
| M-01 | Vista de lista muestra todos los campos | Abrir `/` con tareas | Título, descripción, board, estado, inicio, vencimiento, creado visibles | ✅ |
| M-02 | Columnas ordenables | Click en "Title" → click otra vez | Filas ordenan asc luego desc; indicador ↑/↓ aparece | ✅ |
| M-03 | Estado vacío | Abrir `/` sin tareas | Mensaje "No tasks yet" visible | ✅ |
| M-04 | Asignación de columnas en board | Abrir `/boards/1` | Cada tarea en su columna correcta | ✅ |
| M-05 | Orden de columnas | Abrir cualquier board | Columnas de izquierda a derecha por posición | ✅ |
| M-06 | Columnas vacías | Abrir board con columna sin tareas | La columna se renderiza sin tarjetas (sin error) | ✅ |
| M-07 | Drag & drop | Arrastrar tarjeta de Pending a In Progress | La tarjeta se mueve inmediatamente | ✅ |
| M-08 | Persistencia DnD | Tras M-07, recargar página | La tarjeta sigue en In Progress | ✅ |
| M-09 | Indicador de drop | Iniciar arrastre de tarjeta | La columna sobre la que está tiene borde azul punteado | ✅ |
| M-10 | Defaults de nuevo board | Crear board via `+ New Board` | Board aparece con columnas Pending / In Progress / Blocked / Done | ✅ |

## Seguridad básica

- [x] Sin secretos en el repo (`.env` en `.gitignore`, `.env.example` provisto)
- [x] Consultas parametrizadas via Drizzle ORM (sin concatenación de strings)
- [x] Validación Zod en todos los endpoints POST/PATCH
- [x] CORS restringido a variable de entorno `ALLOWED_ORIGIN`
- [x] Sin superficie de autenticación (prototipo monousuario; riesgo aceptado en PRD)
- [x] `npm audit` — sin vulnerabilidades críticas/altas en dependencias de producción

## Problemas conocidos / riesgos aceptados

| ID | Descripción | Severidad | Decisión |
|----|-------------|-----------|----------|
| K-01 | Tareas creadas directamente en columna "Done" vía API no tienen `completedAt` | Menor | Aceptado — el uso normal pasa por drag & drop que lo setea correctamente |
| K-02 | Sin rate limiting en los endpoints API | Menor | Aceptado — prototipo monousuario; mitigar si se añade multiusuario |
| K-03 | Sin paginación en la lista de tareas | Menor | Aceptado — uso personal, el número de tareas se mantiene manejable |
