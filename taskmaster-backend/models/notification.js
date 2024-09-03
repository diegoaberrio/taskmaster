const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

const Notification = {
    createNotification: async (notificationData) => {
        try {
            console.log('Attempting to create notification with data:', notificationData);
            const [results] = await pool.query('INSERT INTO notifications SET ?', notificationData);
            console.log('Notification created successfully with result:', results); // Log adicional
            return results;
        } catch (err) {
            console.error('Error creating notification:', err); // Log adicional
            throw err;
        }
    },

    getUserNotifications: async (userId) => {
        try {
            console.log(`Getting notifications for user ${userId}`);
            const [results] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [userId]);
            console.log(`Notifications for user ${userId}:`, results); // Log adicional
            return results;
        } catch (err) {
            console.error(`Error getting notifications for user ${userId}:`, err); // Log adicional
            throw err;
        }
    },

    deleteNotification: async (notificationId) => {
        try {
            console.log(`Deleting notification with ID ${notificationId}`);
            const [results] = await pool.query('DELETE FROM notifications WHERE id = ?', [notificationId]);
            console.log('Notification deleted:', results); // Log adicional
            return results;
        } catch (err) {
            console.error(`Error deleting notification ${notificationId}:`, err); // Log adicional
            throw err;
        }
    },

    markAsRead: async (notificationId) => {
        try {
            console.log(`Marking notification with ID ${notificationId} as read`);
            const [results] = await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId]);
            console.log('Notification marked as read:', results); // Log adicional
            return results;
        } catch (err) {
            console.error(`Error marking notification ${notificationId} as read:`, err); // Log adicional
            throw err;
        }
    }
};

module.exports = Notification;
