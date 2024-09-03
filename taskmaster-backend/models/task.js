const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

const Task = {
    /**
     * Obtener todas las tareas
     */
    getAllTasks: async () => {
        try {
            const [results] = await pool.query('SELECT * FROM tasks');
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener tarea por ID
     */
    getTaskById: async (taskId) => {
        try {
            const [results] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
            if (results.length === 0) {
                return null;
            }
            return results[0];
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Crear una nueva tarea
     */
    createTask: async (taskData) => {
        try {
            const [results] = await pool.query('INSERT INTO tasks SET ?', taskData);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Actualizar una tarea por ID
     */
    updateTask: async (taskId, taskData) => {
        try {
            const [results] = await pool.query('UPDATE tasks SET ? WHERE id = ?', [taskData, taskId]);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Eliminar una tarea por ID
     */
    deleteTask: async (taskId) => {
        try {
            const [results] = await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener tareas para hoy
     */
    getTasksForToday: async (date) => {
        try {
            const query = 'SELECT * FROM tasks WHERE DATE(start_date) <= ? AND DATE(due_date) >= ?';
            const [results] = await pool.query(query, [date, date]);
            console.log(`Tasks retrieved for date ${date}: ${JSON.stringify(results)}`); // Log adicional
            return results;
        } catch (err) {
            console.error(`Error fetching tasks for date ${date}:`, err); // Log adicional
            throw err;
        }
    },

    /**
     * Obtener el total de tareas
     */
    getTotalTasks: async () => {
        try {
            const query = 'SELECT COUNT(*) as total_tasks FROM tasks';
            const [[result]] = await pool.query(query);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener tareas por estado y prioridad
     */
    getTasksByStatus: async () => {
        try {
            const query = 'SELECT priority, status, COUNT(*) as count FROM tasks GROUP BY priority, status';
            const [results] = await pool.query(query);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener tareas por usuario
     */
    getTasksByUser: async () => {
        try {
            const query = 'SELECT user_id, COUNT(*) as count FROM tasks GROUP BY user_id';
            const [results] = await pool.query(query);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener estadísticas de tareas completadas para un usuario
     */
    getCompletedTasksStats: async (userId) => {
        try {
            const query = 'SELECT COUNT(*) as completed_tasks FROM tasks WHERE user_id = ? AND status = \'completed\'';
            const [results] = await pool.query(query, [userId]);
            return results[0];
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener estadísticas de tareas pendientes para un usuario
     */
    getPendingTasksStats: async (userId) => {
        try {
            const query = 'SELECT COUNT(*) as pending_tasks FROM tasks WHERE user_id = ? AND status = \'pending\'';
            const [results] = await pool.query(query, [userId]);
            return results[0];
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener estadísticas de tareas por prioridad para un usuario
     */
    getPriorityTasksStats: async (userId) => {
        try {
            const query = 'SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY priority';
            const [results] = await pool.query(query, [userId]);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    getTasksAssignedToUser: async (userId) => {
        try {
            const query = 'SELECT COUNT(*) as total_tasks FROM tasks WHERE user_id = ?';
            const [[result]] = await pool.query(query, [userId]);
            console.log(`Tasks assigned to user ${userId}:`, result); // Log adicional
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    getTasksCompletedByUser: async (userId) => {
        try {
            const query = 'SELECT COUNT(*) as completed_tasks FROM tasks WHERE user_id = ? AND status = "completed"';
            const [[result]] = await pool.query(query, [userId]);
            console.log(`Tasks completed by user ${userId}:`, result); // Log adicional
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
};

module.exports = Task;
