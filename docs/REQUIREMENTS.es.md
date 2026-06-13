# Taskboard — Requisitos

## Historias de usuario

### Obligatorio (MVP)

---

**US-01** — Lista de tareas ordenable
Como usuario, quiero ver todas mis tareas en una lista plana y ordenable para poder
revisarlas y encontrarlas rápidamente sea cual sea el tablero al que pertenezcan.

Criterios de aceptación:
- Dado que la vista de lista está abierta, veo todas las tareas con su título, descripción,
  fecha de inicio, fecha de fin, nombre del tablero y columna actual.
- Dado que la vista de lista está abierta, cuando hago clic en el encabezado de una columna,
  las tareas se ordenan por ese campo de forma ascendente; al volver a hacer clic el orden
  se invierte a descendente.
- Dado que no existen tareas, la lista muestra un mensaje de estado vacío.

---

**US-02** — Crear una tarea
Como usuario, quiero crear una nueva tarea para poder empezar a hacer seguimiento de un
trabajo.

Criterios de aceptación:
- Dado que el formulario de creación está abierto, cuando lo envío con título y descripción
  válidos, la tarea se guarda y aparece en la columna por defecto del tablero asignado.
- Dado que el formulario está abierto, cuando lo envío con el título o la descripción vacíos,
  se muestra un error de validación y la tarea no se guarda.
- Dado que el formulario está abierto, el selector de tablero viene preseleccionado con el
  tablero por defecto; puedo cambiarlo a cualquier tablero existente.
- Dado que el formulario está abierto, los campos de fecha de inicio y fecha de fin son
  opcionales; la tarea se guarda correctamente sin ellos.

---

**US-03** — Editar una tarea
Como usuario, quiero editar una tarea existente para poder actualizar sus datos conforme
evoluciona el trabajo.

Criterios de aceptación:
- Dado que existe una tarea, cuando abro su formulario de edición, modifico algún campo y
  guardo, los valores actualizados persisten y son visibles en todas las vistas.
- Dado que el formulario de edición está abierto, cuando borro el título o la descripción
  e intento guardar, se muestra un error de validación y el cambio no se persiste.

---

**US-04** — Eliminar una tarea
Como usuario, quiero eliminar una tarea para poder quitarme de encima trabajo que ya no
es relevante.

Criterios de aceptación:
- Dado que existe una tarea, cuando la elimino y confirmo, deja de aparecer en la lista,
  en el tablero y en las métricas del dashboard.
- Dado que se inicia una eliminación, se requiere un paso de confirmación antes de borrar
  la tarea definitivamente.

---

**US-05** — Ver un tablero Kanban
Como usuario, quiero ver un tablero Kanban para poder visualizar mis tareas organizadas
por estado.

Criterios de aceptación:
- Dado que existe un tablero con tareas, cuando abro la vista de tablero, las tareas se
  muestran en sus columnas correspondientes en formato tarjeta, mostrando como mínimo el título.
- Dado que un tablero tiene varias columnas, éstas se muestran de izquierda a derecha.
- Dado que un tablero no tiene tareas, las columnas se muestran con un estado vacío.

---

**US-06** — Mover tareas con arrastrar y soltar
Como usuario, quiero arrastrar tareas entre columnas de un tablero para poder actualizar
su estado sin abrir un formulario.

Criterios de aceptación:
- Dado que una tarea está en la columna A, cuando la arrastro y la suelto sobre la columna B,
  la tarea aparece en la columna B inmediatamente.
- Dado que arrastro una tarea a una nueva columna, cuando recargo la página, la tarea sigue
  en la columna B (el estado persiste).
- Dado que hay una operación de arrastre en curso, se muestra un indicador visual de las
  zonas de destino válidas.

---

**US-07** — Crear un nuevo tablero
Como usuario, quiero crear tableros Kanban adicionales para poder separar diferentes áreas
de mi trabajo.

Criterios de aceptación:
- Dado que creo un nuevo tablero con un nombre, se guarda y queda disponible de inmediato
  al crear tareas.
- Dado que se crea un nuevo tablero, viene precargado con las cuatro columnas por defecto:
  Pendiente, En progreso, Parada, Finalizada.
- Dado que intento crear un tablero sin nombre, se muestra un error de validación.

---

**US-08** — Añadir una columna a un tablero
Como usuario, quiero añadir columnas personalizadas a un tablero para poder adaptar el
flujo de trabajo a mis necesidades.

Criterios de aceptación:
- Dado que un tablero está abierto, cuando añado una nueva columna con un nombre, aparece
  al extremo derecho del tablero y está disponible de inmediato para recibir tareas.
- Dado que intento añadir una columna sin nombre, se muestra un error de validación.

---

**US-09** — Dashboard de métricas
Como usuario, quiero un dashboard de métricas para entender el estado general y el progreso
de mi trabajo.

Criterios de aceptación:
- Dado que el dashboard está abierto, veo el total de tareas desglosado por estado en todos
  los tableros.
- Dado que el dashboard está abierto, veo el número de tareas completadas (movidas a
  Finalizada) en los últimos 7 días y en los últimos 30 días.
- Dado que el dashboard está abierto, veo el recuento de tareas que no tienen fecha de fin
  (sin planificar).
- Dado que el dashboard está abierto, veo el recuento de tareas cuya fecha de fin está en
  el pasado y cuya columna actual no es Finalizada (vencidas).

---

### Recomendable (post-MVP)

**US-10** — Renombrar un tablero
Como usuario, quiero renombrar un tablero para poder corregir o actualizar su nombre.
- Dado que existe un tablero, cuando lo renombro, el nuevo nombre se refleja en todos los sitios.

**US-11** — Eliminar un tablero
Como usuario, quiero eliminar un tablero que ya no necesito (con confirmación y gestión
de sus tareas).
- Dado que un tablero tiene tareas, cuando lo elimino, se me avisa y se me ofrece la opción
  de reasignar las tareas a otro tablero o eliminarlas junto con él.

**US-12** — Renombrar una columna
Como usuario, quiero renombrar una columna de un tablero para ajustar su etiqueta.
- Dado que existe una columna, cuando la renombro, el nuevo nombre se guarda de inmediato.

**US-13** — Reordenar columnas
Como usuario, quiero arrastrar columnas dentro de un tablero para cambiar su orden y que
mi flujo de trabajo se lea en el orden correcto.
- Dado que un tablero está abierto, cuando arrastro el encabezado de una columna a una nueva
  posición, la columna se mueve y el orden persiste.

---

### Opcional (backlog)

**US-14** — Filtrar tareas en la lista
Como usuario, quiero filtrar la lista de tareas por tablero o estado para poder centrarme
en un subconjunto concreto.

**US-15** — Buscar tareas
Como usuario, quiero buscar tareas por título para poder encontrar una tarea concreta
rápidamente.

**US-16** — Eliminar una columna
Como usuario, quiero eliminar una columna de un tablero (reasignando primero sus tareas)
para poder limpiar etapas de flujo que ya no uso.

---

## Entidades del dominio (primera pasada)

**Tarea (Task)**
Atributos: título (obligatorio), descripción (obligatorio), fecha_inicio (opcional),
fecha_fin (opcional), fecha_creación.
Relaciones: pertenece a un Tablero; pertenece a una Columna dentro de ese Tablero.

**Tablero (Board)**
Atributos: nombre (obligatorio), es_predeterminado (booleano — exactamente un tablero es
el predeterminado).
Relaciones: tiene muchas Columnas; tiene muchas Tareas (a través de las Columnas).

**Columna (Column)**
Atributos: nombre (obligatorio), posición (entero — orden de visualización dentro del tablero).
Relaciones: pertenece a un Tablero; tiene muchas Tareas.

---

## Requisitos no funcionales

Diferidos — clasificación de prototipo. Se abordarán si el proyecto escala a producción.

---

## Suposiciones

- Una tarea pertenece siempre a exactamente un tablero y una columna.
- El tablero por defecto no se puede eliminar (solo renombrar en US-10).
- "Finalizada" se identifica por coincidencia de nombre de columna; si un tablero renombra
  esa columna, las métricas de completado podrían necesitar un flag explícito `es_finalizada` —
  a revisar en la Fase 2.
- La aplicación tendrá un backend desde el primer día. Los datos persisten en el servidor,
  no en el navegador. Esta decisión condiciona la recomendación de stack en la Fase 2.

---

## Fuera de alcance (heredado del PRD)

- Autenticación de usuario / soporte multi-usuario.
- Aplicación móvil nativa.
- Notificaciones push o recordatorios.
- Tareas recurrentes.
- Colaboración en equipo o compartir tableros.
