# Taskboard — Backlog

Elementos aplazados del MVP. Ordenados por prioridad dentro de cada nivel.

---

## Post-MVP (Debería tener)

### US-10 — Renombrar un board
Edición inline del nombre en `BoardsPage` y en la cabecera de `BoardPage`.  
**Enfoque**: input click-to-edit con `PATCH /api/boards/:id`. La estructura de rutas ya existe; añadir el endpoint y un componente de formulario inline pequeño.

### US-11 — Eliminar un board
Botón de eliminar en `BoardsPage` con confirmación en dos pasos.  
**Enfoque**: añadir `DELETE /api/boards/:id` (cascade elimina columnas y tareas vía FK). Avisar al usuario de que perderá todas las tareas del board. El board por defecto debe estar protegido de eliminación.

### US-12 — Renombrar una columna
Edición inline en la cabecera de columna en `BoardPage`.  
**Enfoque**: `PATCH /api/boards/:boardId/columns/:columnId`. Directo — mismo patrón que el renombrado de board.

### US-13 — Reordenar columnas
Arrastrar cabeceras de columna para cambiar su orden.  
**Enfoque**: extender `@dnd-kit` que ya está en el proyecto — añadir un `SortableContext` horizontal alrededor de las columnas. Al soltar, enviar `PATCH /api/boards/:boardId/columns/reorder` con el array de nuevas posiciones. El campo `position` ya existe en el esquema.

---

## Backlog (Podría tener)

### US-14 — Filtrar tareas en la vista de lista
Barra de filtros encima de la tabla: por board y/o por columna de estado.  
**Enfoque**: filtrado en cliente con `getFilteredRowModel` de TanStack Table (ya importado). Sin cambios de backend para filtrado básico; añadir estado `columnFilters` a `ListPage`.

### US-15 — Buscar tareas
Búsqueda de texto libre por título en la vista de lista.  
**Enfoque**: añadir un input de búsqueda que filtre la columna `title` mediante el filtro global de TanStack Table. Para búsqueda en servidor, añadir parámetro `?q=` a `GET /api/tasks` y usar PostgreSQL `ILIKE`.

### US-16 — Eliminar una columna
Eliminar una columna de un board, reasignando sus tareas primero.  
**Enfoque**: requiere un modal de "reasignar tareas a columna X antes de eliminar". El más complejo del backlog — aplazado hasta que US-12/US-13 estén hechos.

---

## Problemas conocidos (aceptados en v1.0.0)

| ID | Descripción | Solución temporal |
|----|-------------|-------------------|
| K-01 | Las tareas creadas vía API directamente en una columna Done no tienen `completedAt` | Usar drag & drop en la UI — lo establece correctamente vía endpoint `/move` |
| K-02 | Sin rate limiting en los endpoints de la API | App monousuario en red privada; revisar si se expone públicamente |
| K-03 | Sin paginación en la lista de tareas | Manejable a escala de uso personal; añadir si la lista crece demasiado |

---

## Ideas para más adelante

- **Recordatorios de fecha límite** — notificación del navegador o email cuando `endDate` es mañana.
- **Etiquetas / tags en tareas** — tags libres para categorización entre boards.
- **Tareas recurrentes** — repetir una tarea según un calendario (revisión semanal, etc.).
- **Archivo de tareas completadas** — ocultar las tareas Done del board pero conservarlas en métricas.
- **Atajos de teclado** — `n` nueva tarea, `e` editar, `j/k` navegar filas en la lista.
- **Modo oscuro** — theming con variables CSS, Tailwind ya lo soporta.
