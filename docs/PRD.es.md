# Taskboard — Requisitos de Producto

## Declaración del problema

Gestionar tareas personales sin una herramienta unificada lleva a listas fragmentadas y sin
visibilidad real sobre el progreso. Un único espacio de trabajo que soporte tanto la navegación
libre en lista como la organización estructurada en tableros Kanban — con un dashboard que muestre
si el trabajo avanza de verdad — resuelve eso para un usuario individual sin la complejidad de
herramientas de gestión de proyectos pesadas.

## Usuarios objetivo

Un solo usuario (uso personal). No se requiere autenticación ni multi-tenancy en v1.

## Propuesta de valor principal

Un espacio de trabajo personal para capturar, organizar y seguir tareas — en vista de lista o
tablero, lo que mejor encaje en cada momento — con un dashboard que muestra si el trabajo
realmente se mueve.

## Objetivos (v1)

1. Crear, editar y eliminar tareas con título, descripción y fechas de inicio/fin opcionales.
2. Organizar tareas en múltiples tableros Kanban con nombre; siempre existe un tablero por defecto.
3. Cada tablero tiene columnas configurables (conjunto por defecto: Pendiente / En progreso / Parada / Finalizada).
4. Mover tareas entre columnas arrastrando y soltando.
5. Ver todas las tareas en una lista plana y ordenable (ordenable por cada columna).
6. Monitorizar el trabajo a través de un dashboard de métricas (ver § Criterios de éxito).

## No-objetivos (fuera de alcance para v1)

- Autenticación de usuario / inicio de sesión / soporte multi-usuario.
- Aplicación móvil nativa (solo navegador).
- Notificaciones push o recordatorios.
- Tareas recurrentes.
- Colaboración en equipo o compartir tableros.

## Restricciones

- Plataforma: solo navegador web moderno.
- Sin pila tecnológica prescrita.
- Sin fecha de entrega fija.

## Criterios de éxito

Todos los criterios de aceptación de v1 se cumplen cuando:

- El CRUD completo funciona para tareas y tableros sin pérdida de datos.
- Las transiciones de columna por arrastrar y soltar persisten correctamente tras recargar la página.
- La vista de lista ordena por cada campo de tarea sin errores.
- El dashboard muestra como mínimo:
  - Recuento de tareas por estado en todos los tableros.
  - Tareas completadas en los últimos 7 y 30 días.
  - Tareas sin fecha de fin (sin planificar).
  - Tareas vencidas (fecha de fin pasada y no finalizadas).

## Preguntas abiertas

Ninguna que bloquee la Fase 1.
