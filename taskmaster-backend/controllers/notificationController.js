const { body, param, validationResult } = require('express-validator');
const Notification = require('../models/notification');
const Task = require('../models/task');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user_id
 *         - message
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the notification
 *         user_id:
 *           type: integer
 *           description: The id of the user
 *         message:
 *           type: string
 *           description: The content of the notification
 *         is_read:
 *           type: boolean
 *           description: The read status of the notification
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the notification was last updated
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created
 *       400:
 *         description: Invalid input
 */
exports.createNotification = [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('message').isString().withMessage('Message must be a string'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notificationData = req.body;
        Notification.createNotification(notificationData)
            .then(result => {
                res.status(201).json({ id: result.insertId, ...notificationData });
            })
            .catch(err => {
                console.error('Error creating notification:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Retrieve notifications for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
exports.getUserNotifications = [
    param('userId').isInt().withMessage('User ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.userId;
        Notification.getUserNotifications(userId)
            .then(notifications => res.json(notifications))
            .catch(err => {
                console.error('Error getting notifications for user:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
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
exports.deleteNotification = [
    param('id').isInt().withMessage('Notification ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notificationId = req.params.id;
        Notification.deleteNotification(notificationId)
            .then(result => {
                if (result.affectedRows === 0) {
                    return res.status(404).send('Notification not found');
                }
                res.status(204).send();
            })
            .catch(err => {
                console.error('Error deleting notification:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /notifications/daily:
 *   post:
 *     summary: Create daily notifications for tasks
 *     responses:
 *       200:
 *         description: Daily notifications created
 *       500:
 *         description: Internal server error
 */
exports.createDailyNotifications = async (req, res) => {
    const today = new Date().toISOString().slice(0, 10); // Obtener la fecha de hoy en formato YYYY-MM-DD
    console.log(`Today's date: ${today}`); // Mensaje de depuración

    try {
        const tasks = await Task.getTasksForToday(today);
        console.log(`Tasks retrieved for date ${today}: ${JSON.stringify(tasks)}`); // Mensaje de depuración

        if (tasks.length === 0) {
            console.log('No tasks for today.'); // Mensaje de depuración
            if (res) return res.status(200).send('No tasks for today.');
            return;
        }

        const notificationPromises = tasks.map(task => {
            const notificationData = {
                user_id: task.user_id,
                message: `Tarea del día: ${task.title} - ${task.description}`
            };

            console.log(`Creating notification for task: ${JSON.stringify(task)}`); // Mensaje de depuración

            return Notification.createNotification(notificationData)
                .then(result => {
                    console.log(`Notification created: ${JSON.stringify(notificationData)}`); // Mensaje de depuración
                })
                .catch(err => {
                    console.error('Error creating notification:', err); // Mensaje de depuración
                    throw err; // Lanzar el error para que sea manejado en el catch principal
                });
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(notificationPromises);

        console.log('All notifications created successfully.');
        if (res) res.status(200).send('Notificaciones diarias creadas.');
    } catch (err) {
        console.error('Error in createDailyNotifications:', err); // Mensaje de depuración
        if (res) res.status(500).send('Error creating daily notifications.');
    }
};

/**
 * @swagger
 * /notifications/{id}/read:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification marked as read.
 *       404:
 *         description: Notification not found
 */
exports.markAsRead = [
    param('id').isInt().withMessage('Notification ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notificationId = req.params.id;
        try {
            const result = await Notification.markAsRead(notificationId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json({ message: 'Notification marked as read' });
        } catch (err) {
            console.error('Error marking notification as read:', err);
            res.status(500).json({ message: 'Error marking notification as read' });
        }
    }
];

