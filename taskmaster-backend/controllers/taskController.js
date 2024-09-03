const { body, param, validationResult } = require('express-validator');
const Task = require('../models/task');
const User = require('../models/user');
const { calculatePoints } = require('../utils/pointsCalculator'); // Importar la función de cálculo de puntos

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - user_id
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         user_id:
 *           type: integer
 *           description: The id of the user
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         priority:
 *           type: string
 *           description: The priority of the task
 *         status:
 *           type: string
 *           description: The status of the task
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: The start date of the task
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: The due date of the task
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
exports.getAllTasks = async (req, res) => {
    try {
        console.log('Invoking getAllTasks in taskController');
        const tasks = await Task.getAllTasks();
        const tasksWithUserNames = await Promise.all(tasks.map(async (task) => {
            const user = await User.getUserById(task.user_id);
            return {
                ...task,
                userName: user ? user.name : 'Unknown'
            };
        }));
        console.log('Tasks retrieved:', tasksWithUserNames);
        res.json(tasksWithUserNames);
    } catch (err) {
        console.error('Error retrieving tasks:', err);
        res.status(500).send(err);
    }
};

/**
 * @swagger
 * /tasks/{id}:
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
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
exports.getTaskById = [
    param('id').isInt().withMessage('Task ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = req.params.id;
        try {
            console.log(`Invoking getTaskById in taskController with ID: ${taskId}`);
            const task = await Task.getTaskById(taskId);
            if (!task) {
                console.log('Task not found');
                return res.status(404).send('Task not found');
            }
            const user = await User.getUserById(task.user_id);
            console.log('Task retrieved:', task);
            res.json({
                ...task,
                userName: user ? user.name : 'Unknown'
            });
        } catch (err) {
            console.error('Error retrieving task:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Invalid input
 */
exports.createTask = [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('status').isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskData = req.body;
        try {
            console.log('Invoking createTask in taskController with data:', taskData);
            const result = await Task.createTask(taskData);
            console.log('Task created with ID:', result.insertId);
            res.status(201).json({ id: result.insertId, ...taskData });
        } catch (err) {
            console.error('Error creating task:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
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
 *         application/json:
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
exports.updateTask = [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('user_id').optional().isInt().withMessage('User ID must be an integer'),
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = req.params.id;
        const taskData = req.body;
        try {
            console.log(`Invoking updateTask in taskController with ID: ${taskId} and data:`, taskData);
            const task = await Task.getTaskById(taskId);
            if (!task) {
                console.log('Task not found');
                return res.status(404).send('Task not found');
            }
            await Task.updateTask(taskId, taskData);
            console.log('Task updated with ID:', taskId);
            res.status(200).json({ id: taskId, ...taskData });
        } catch (err) {
            console.error('Error updating task:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
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
exports.deleteTask = [
    param('id').isInt().withMessage('Task ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = req.params.id;
        try {
            console.log(`Invoking deleteTask in taskController with ID: ${taskId}`);
            const result = await Task.deleteTask(taskId);
            if (result.affectedRows === 0) {
                console.log('Task not found');
                return res.status(404).send('Task not found');
            }
            console.log('Task deleted with ID:', taskId);
            res.status(204).send();
        } catch (err) {
            console.error('Error deleting task:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /tasks/today/{userId}:
 *   get:
 *     summary: Retrieve tasks for today for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of tasks for today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
exports.getTasksForToday = [
    param('userId').isInt().withMessage('User ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.userId;
        const today = new Date().toISOString().slice(0, 10);

        try {
            console.log(`Invoking getTasksForToday in taskController for userId: ${userId} and date: ${today}`);
            const tasks = await Task.getTasksForToday(userId, today);
            console.log('Tasks for today:', tasks);
            res.json(tasks);
        } catch (err) {
            console.error('Error retrieving tasks for today:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /statistics/tasks/completed/{userId}:
 *   get:
 *     summary: Retrieve completed task statistics for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Completed task statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCompleted:
 *                   type: integer
 *                   description: Total number of completed tasks
 */
exports.getCompletedTasksStats = [
    param('userId').isInt().withMessage('User ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.userId;
        try {
            console.log(`Invoking getCompletedTasksStats in taskController for userId: ${userId}`);
            const stats = await Task.getCompletedTasksStats(userId);
            console.log('Completed task stats:', stats);
            res.json(stats);
        } catch (err) {
            console.error('Error retrieving completed task stats:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /statistics/tasks/pending/{userId}:
 *   get:
 *     summary: Retrieve pending task statistics for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Pending task statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPending:
 *                   type: integer
 *                   description: Total number of pending tasks
 */
exports.getPendingTasksStats = [
    param('userId').isInt().withMessage('User ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.userId;
        try {
            console.log(`Invoking getPendingTasksStats in taskController for userId: ${userId}`);
            const stats = await Task.getPendingTasksStats(userId);
            console.log('Pending task stats:', stats);
            res.json(stats);
        } catch (err) {
            console.error('Error retrieving pending task stats:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /statistics/tasks/priority/{userId}:
 *   get:
 *     summary: Retrieve task statistics by priority for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Task statistics by priority
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 low:
 *                   type: integer
 *                   description: Number of low priority tasks
 *                 medium:
 *                   type: integer
 *                   description: Number of medium priority tasks
 *                 high:
 *                   type: integer
 *                   description: Number of high priority tasks
 */
exports.getPriorityTasksStats = [
    param('userId').isInt().withMessage('User ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.userId;
        try {
            console.log(`Invoking getPriorityTasksStats in taskController for userId: ${userId}`);
            const stats = await Task.getPriorityTasksStats(userId);
            console.log('Priority task stats:', stats);
            res.json(stats);
        } catch (err) {
            console.error('Error retrieving priority task stats:', err);
            res.status(500).send(err);
        }
    }
];

/**
 * @swagger
 * /tasks/{id}/complete:
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
exports.completeTask = [
    param('id').isInt().withMessage('Task ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = req.params.id;
        try {
            console.log(`Invoking completeTask in taskController with ID: ${taskId}`);
            const task = await Task.getTaskById(taskId);
            if (!task) {
                console.log('Task not found');
                return res.status(404).send('Task not found');
            }

            // Marcar la tarea como completada
            await Task.updateTask(taskId, { status: 'completed' });

            // Calcular los puntos según la prioridad
            const points = calculatePoints(task.priority);

            // Actualizar los puntos del usuario
            await User.updateUserPoints(task.user_id, points);

            console.log('Task completed and points awarded:', { taskId, points });
            res.status(200).json({ id: taskId, points });
        } catch (err) {
            console.error('Error completing task:', err);
            res.status(500).send(err);
        }
    }
];
