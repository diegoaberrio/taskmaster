# TaskMaster (Gestor de Tareas)

**TaskMaster** es una aplicación web diseñada para ayudar a los usuarios a gestionar sus tareas diarias de manera efectiva. Con TaskMaster, los usuarios pueden crear, editar, eliminar y organizar sus tareas, establecer prioridades, recibir recompensas por completar tareas, y visualizar estadísticas detalladas sobre su rendimiento.

## Funcionalidades Principales

- **Gestión de Tareas:** Crear, editar, eliminar y organizar tareas con títulos, descripciones, prioridades y estados.
- **Sistema de Recompensas:** Acumula puntos por cada tarea completada y canjéalos por recompensas.
- **Estadísticas Detalladas:** Visualiza estadísticas sobre el rendimiento y progreso de tus tareas.
- **Notificaciones:** Recibe recordatorios automáticos sobre las tareas pendientes.

## Requerimientos del Sistema

- **Frontend:** Angular
- **Backend:** Node.js, Express
- **Base de Datos:** MySQL o MariaDB
- **Autenticación:** JWT (JSON Web Tokens)

## Estructura de la Base de Datos

**Usuarios:**
- `id`: Identificador único del usuario (INT, PK, AUTO_INCREMENT)
- `email`: Correo electrónico del usuario (VARCHAR)
- `nombre`: Nombre del usuario (VARCHAR)
- `contraseña`: Contraseña del usuario (VARCHAR)
- `avatar`: URL del avatar del usuario (VARCHAR)
- `fecha_creacion`: Fecha de creación de la cuenta (TIMESTAMP)

**Tareas:**
- `id`: Identificador único de la tarea (INT, PK, AUTO_INCREMENT)
- `titulo`: Título de la tarea (VARCHAR)
- `descripcion`: Descripción de la tarea (TEXT)
- `prioridad`: Prioridad de la tarea (ENUM: 'Baja', 'Media', 'Alta')
- `estado`: Estado de la tarea (ENUM: 'Pendiente', 'En Progreso', 'Completada')
- `fecha_inicio`: Fecha de inicio de la tarea (TIMESTAMP)
- `fecha_vencimiento`: Fecha de vencimiento de la tarea (TIMESTAMP)
- `usuario_id`: Referencia al usuario que creó la tarea (INT, FK)

**Recompensas:**
- `id`: Identificador único de la recompensa (INT, PK, AUTO_INCREMENT)
- `descripcion`: Descripción de la recompensa (TEXT)
- `puntos_requeridos`: Puntos necesarios para canjear la recompensa (INT)
- `usuario_id`: Referencia al usuario que canjeó la recompensa (INT, FK)

**Estadísticas:**
- `id`: Identificador único de la estadística (INT, PK, AUTO_INCREMENT)
- `usuario_id`: Referencia al usuario (INT, FK)
- `tareas_completadas`: Número de tareas completadas por el usuario (INT)
- `puntos_acumulados`: Puntos acumulados por el usuario (INT)
- `fecha_calculo`: Fecha de cálculo de la estadística (TIMESTAMP)

## Instalación y Configuración

Para desplegar TaskMaster localmente, sigue estos pasos:

1. **Clonar el Repositorio:**
   
   git clone https://github.com/diegoaberrio/gestor-de-tareas.git
  

2. **Navegar al Directorio del Proyecto:**
   
   cd gestor-de-tareas
  

3. **Instalar las Dependencias:**
   
   npm install
  

4. **Configurar la Base de Datos:**
   - Configura la conexión a la base de datos en el archivo `config/database.js`.
   - Ejecuta las migraciones para crear las tablas necesarias:
     
     npm run migrate
     

5. **Iniciar el Servidor:**
  
   npm start
   

6. **Acceder a la Aplicación:**
   - Abre tu navegador y accede a `http://localhost:3000` para comenzar a usar TaskMaster.

## Video Demo

Para ver TaskMaster en acción, mira este [video demo en YouTube](https://www.youtube.com/watch?v=0EFuaV1t96I).

## Mi Sitio Web Personal

Puedes explorar más sobre mi trabajo y otros proyectos en mi [página web personal](https://diegoincode-dc1cd734cb90.herokuapp.com/).

## Contacto

- **Correo electrónico:** diegoaberrio@hotmail.com
- **LinkedIn:** [Diego Alonso Berrío Gómez](https://www.linkedin.com/in/diego-alonso-berrío-gómez)
- **GitHub:** [Diego Aberrio](https://github.com/diegoaberrio)

