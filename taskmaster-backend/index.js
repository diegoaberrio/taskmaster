require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const cron = require('node-cron');
const { body, param } = require('express-validator');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, specs } = require('./config/swagger');
const app = express();
const port = 3000;

// Importación de controladores
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');
const rewardController = require('./controllers/rewardController');
const userRewardController = require('./controllers/userRewardController');
const notificationController = require('./controllers/notificationController');
const statisticsController = require('./controllers/statisticsController');




app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Simple test route
 *     responses:
 *       200:
 *         description: A simple hello message
 */
app.get('/', (req, res) => {
    res.send('Hello from the TaskMaster backend!');
});

/**
 * Rutas de usuarios
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get('/api/users/:id', param('id').isInt(), userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
app.post('/api/users', [
    body('email').isEmail(),
    body('name').isString().notEmpty(),
    body('password').isString().notEmpty(),
], userController.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid credentials
 */
app.post('/api/users/login', [
    body('email').isEmail(),
    body('password').isString().notEmpty(),
], userController.login);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
app.put('/api/users/:id', [
    param('id').isInt(),
    body('email').optional().isEmail(),
    body('name').optional().isString(),
    body('password').optional().isString(),
], userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
app.delete('/api/users/:id', param('id').isInt(), userController.deleteUser);

/**
 * Rutas de tareas
 */
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of all tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get('/api/tasks', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Retrieve a single task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: A single task
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
app.get('/api/tasks/:id', param('id').isInt(), taskController.getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Invalid input
 */
app.post('/api/tasks', [
    body('user_id').isInt(),
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('priority').isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('start_date').optional().isISO8601(),
    body('due_date').optional().isISO8601(),
], taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 */
app.put('/api/tasks/:id', [
    param('id').isInt(),
    body('user_id').optional().isInt(),
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('start_date').optional().isISO8601(),
    body('due_date').optional().isISO8601(),
], taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
app.delete('/api/tasks/:id', param('id').isInt(), taskController.deleteTask);

/**
 * @swagger
 * /api/tasks/today/{userId}:
 *   get:
 *     summary: Retrieve tasks for today for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Tasks for today
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: User not found
 */
app.get('/api/tasks/today/:userId', param('userId').isInt(), taskController.getTasksForToday);

/**
 * Rutas de recompensas
 */
/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Retrieve a list of all rewards
 *     responses:
 *       200:
 *         description: A list of rewards
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reward'
 */
app.get('/api/rewards', rewardController.getAllRewards);

/**
 * @swagger
 * /api/rewards/{id}:
 *   get:
 *     summary: Retrieve a single reward by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reward ID
 *     responses:
 *       200:
 *         description: A single reward
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/Reward'
 *       404:
 *         description: Reward not found
 */
app.get('/api/rewards/:id', param('id').isInt(), rewardController.getRewardById);

/**
 * @swagger
 * /api/rewards:
 *   post:
 *     summary: Create a new reward
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       201:
 *         description: Reward created
 *       400:
 *         description: Invalid input
 */
app.post('/api/rewards', [
    body('reward_name').isString().notEmpty(),
    body('points_required').isInt({ min: 1 }),
], rewardController.createReward);

/**
 * @swagger
 * /api/rewards/{id}:
 *   put:
 *     summary: Update a reward by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reward ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       200:
 *         description: Reward updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reward not found
 */
app.put('/api/rewards/:id', [
    param('id').isInt(),
    body('reward_name').optional().isString(),
    body('points_required').optional().isInt({ min: 1 }),
], rewardController.updateReward);

/**
 * @swagger
 * /api/rewards/{id}:
 *   delete:
 *     summary: Delete a reward by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reward ID
 *     responses:
 *       204:
 *         description: Reward deleted
 *       404:
 *         description: Reward not found
 */
app.delete('/api/rewards/:id', param('id').isInt(), rewardController.deleteReward);

/**
 * Rutas de redención de recompensas
 */
/**
 * @swagger
 * /api/redeem:
 *   post:
 *     summary: Redeem a reward
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The user ID
 *               reward_id:
 *                 type: integer
 *                 description: The reward ID
 *     responses:
 *       200:
 *         description: Reward redeemed
 *       400:
 *         description: Invalid input
 */
app.post('/api/redeem', [
    body('user_id').isInt(),
    body('reward_id').isInt(),
], userRewardController.redeemReward);

/**
 * Rutas de notificaciones
 */
/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The user ID
 *               message:
 *                 type: string
 *                 description: The notification message
 *     responses:
 *       201:
 *         description: Notification created
 *       400:
 *         description: Invalid input
 */
app.post('/api/notifications', [
    body('user_id').isInt(),
    body('message').isString().notEmpty(),
], notificationController.createNotification);

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Retrieve notifications for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Notifications for the user
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       404:
 *         description: User not found
 */
app.get('/api/notifications/:userId', param('userId').isInt(), notificationController.getUserNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notification ID
 *     responses:
 *       204:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
app.delete('/api/notifications/:id', param('id').isInt(), notificationController.deleteNotification);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
app.put('/api/notifications/:id/read', param('id').isInt(), notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/daily:
 *   post:
 *     summary: Create daily notifications
 *     responses:
 *       201:
 *         description: Daily notifications created
 */
app.post('/api/notifications/daily', notificationController.createDailyNotifications);

/**
 * Rutas de estadísticas
 */
/**
 * @swagger
 * /api/statistics/tasks/completed/{userId}:
 *   get:
 *     summary: Get statistics of completed tasks for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Statistics of completed tasks
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 completedTasks:
 *                   type: integer
 *                   description: The number of completed tasks
 */
app.get('/api/statistics/tasks/completed/:userId', param('userId').isInt(), taskController.getCompletedTasksStats);

app.get('/api/statistics/test/:userId', statisticsController.testUserTasksStats);

app.get('/api/statistics/testRewardNameById/:rewardId', statisticsController.testRewardNameById);

/**
 * @swagger
 * /api/statistics/tasks/pending/{userId}:
 *   get:
 *     summary: Get statistics of pending tasks for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Statistics of pending tasks
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 pendingTasks:
 *                   type: integer
 *                   description: The number of pending tasks
 */
app.get('/api/statistics/tasks/pending/:userId', param('userId').isInt(), taskController.getPendingTasksStats);

/**
 * @swagger
 * /api/statistics/tasks/priority/{userId}:
 *   get:
 *     summary: Get statistics of tasks by priority for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Statistics of tasks by priority
 *         content:
 *           application/json
 *             schema:
 *               type: object
 *               properties:
 *                 lowPriorityTasks:
 *                   type: integer
 *                   description: The number of low priority tasks
 *                 mediumPriorityTasks:
 *                   type: integer
 *                   description: The number of medium priority tasks
 *                 highPriorityTasks:
 *                   type: integer
 *                   description: The number of high priority tasks
 */
app.get('/api/statistics/tasks/priority/:userId', param('userId').isInt(), taskController.getPriorityTasksStats);

/**
 * @swagger
 * /api/statistics/users/points:
 *   get:
 *     summary: Retrieve points of all users
 *     responses:
 *       200:
 *         description: A list of user points
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPoints'
 */
app.get('/api/statistics/users/points', statisticsController.getUserPoints);

/**
 * @swagger
 * /api/statistics/users/top:
 *   get:
 *     summary: Retrieve top 3 users by points
 *     responses:
 *       200:
 *         description: A list of top 3 users by points
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPoints'
 */
app.get('/api/statistics/users/top', statisticsController.getTopUsersByPoints);


/**
 * @swagger
 * /api/statistics/rewards/redeemed:
 *   get:
 *     summary: Get statistics of redeemed rewards
 *     responses:
 *       200:
 *         description: Statistics of redeemed rewards
 *         content:
 *           application/json
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rewardId:
 *                     type: integer
 *                     description: The reward ID
 *                   redeemedCount:
 *                     type: integer
 *                     description: The count of redeemed rewards
 */
app.get('/api/statistics/rewards/redeemed', statisticsController.getRedeemedRewards);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   put:
 *     summary: Mark a task as completed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task completed
 *       404:
 *         description: Task not found
 */
app.put('/api/tasks/:id/complete', taskController.completeTask);

/**
 * @swagger
 * /api/statistics/tasks:
 *   get:
 *     summary: Retrieve task statistics
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/TaskStats'
 */
app.get('/api/statistics/tasks', statisticsController.getTaskStats);

/**
 * @swagger
 * /api/statistics/users:
 *   get:
 *     summary: Retrieve user statistics
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 */
app.get('/api/statistics/users', statisticsController.getUserStats);

/**
 * @swagger
 * /api/statistics/rewards:
 *   get:
 *     summary: Retrieve redeemed rewards statistics
 *     responses:
 *       200:
 *         description: Redeemed rewards statistics
 *         content:
 *           application/json
 *             schema:
 *               $ref: '#/components/schemas/RewardStats'
 */
app.get('/api/statistics/rewards', statisticsController.getRedeemedRewards);

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Programar la verificación diaria a las 00:00
cron.schedule('0 0 * * *', () => {
    notificationController.createDailyNotifications().then(() => {
        console.log('Daily notifications created successfully.');
    }).catch((error) => {
        console.error('Error creating daily notifications:', error);
    });
});

// Usar el middleware de gestión de errores
app.use(errorHandler);

// Iniciar el servidor
if (require.main === module) {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
    module.exports = server; // Exportar el servidor para las pruebas
} else {
    module.exports = app; // Exportar la aplicación de Express para las pruebas
}
