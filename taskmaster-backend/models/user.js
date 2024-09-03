const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

const User = {
    /**
     * Obtener todos los usuarios
     */
    getAllUsers: async () => {
        try {
            const [results] = await pool.query('SELECT id, email, name, points FROM users');
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener usuario por ID
     */
    getUserById: async (userId) => {
        try {
            const [results] = await pool.query('SELECT id, email, name, points FROM users WHERE id = ?', [userId]);
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
     * Obtener usuario por email
     */
    getUserByEmail: async (email) => {
        try {
            const [results] = await pool.query('SELECT id, email, name, password, points FROM users WHERE email = ?', [email]);
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
     * Crear un nuevo usuario
     */
    createUser: async (userData) => {
        try {
            const [results] = await pool.query('INSERT INTO users SET ?', userData);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Actualizar un usuario por ID
     */
    updateUser: async (userId, userData) => {
        try {
            const [results] = await pool.query('UPDATE users SET ? WHERE id = ?', [userData, userId]);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Eliminar un usuario por ID
     */
    deleteUser: async (userId) => {
        try {
            const [results] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Actualizar puntos del usuario
     */
    updateUserPoints: async (userId, points) => {
        try {
            const query = 'UPDATE users SET points = points + ? WHERE id = ?';
            const [results] = await pool.query(query, [points, userId]);
            return results;
        } catch (err) {
            console.error('Error in updateUserPoints:', err);
            throw err;
        }
    },

    /**
     * Obtener el total de usuarios
     */
    getTotalUsers: async () => {
        try {
            const query = 'SELECT COUNT(*) as total_users FROM users';
            const [results] = await pool.query(query);
            return results[0];
        } catch (err) {
            console.error('Error in getTotalUsers:', err);
            throw err;
        }
    },

    /**
     * Obtener usuarios ordenados por puntos
     */
    getUsersByPoints: async () => {
        try {
            const query = 'SELECT id, email, name, points FROM users ORDER BY points DESC';
            const [results] = await pool.query(query);
            return results;
        } catch (err) {
            console.error('Error in getUsersByPoints:', err);
            throw err;
        }
    },

    /**
     * Obtener los mejores usuarios por puntos
     */
    getTopUsersByPoints: async (limit) => {
        try {
            const query = 'SELECT id, email, name, points FROM users ORDER BY points DESC LIMIT ?';
            const [results] = await pool.query(query, [limit]);
            return results;
        } catch (err) {
            console.error('Error in getTopUsersByPoints:', err);
            throw err;
        }
    }
};

module.exports = User;
