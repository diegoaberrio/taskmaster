const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

const Reward = {
    /**
     * Obtener todas las recompensas
     */
    getAllRewards: async () => {
        try {
            console.log('Executing query: SELECT * FROM rewards');
            const [results] = await pool.query('SELECT * FROM rewards');
            console.log('Query results:', results);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener recompensa por ID
     */
    getRewardById: async (rewardId) => {
        try {
            console.log('Executing query: SELECT * FROM rewards WHERE id = ?', [rewardId]);
            const [[result]] = await pool.query('SELECT * FROM rewards WHERE id = ?', [rewardId]);
            if (!result) {
                return null;
            }
            console.log('Query result:', result);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener el nombre de una recompensa por ID
     */
    getRewardNameById: async (rewardId) => {
        try {
            console.log('Executing query: SELECT reward_name FROM rewards WHERE id = ?', [rewardId]);
            const [[result]] = await pool.query('SELECT reward_name FROM rewards WHERE id = ?', [rewardId]);
            if (!result) {
                return { reward_name: 'Unknown' }; // Cambiado para retornar 'Unknown' si no se encuentra la recompensa
            }
            console.log('Query result:', result);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },
    /**
     * Crear una nueva recompensa
     */
    createReward: async (rewardData) => {
        try {
            console.log('Executing query: INSERT INTO rewards SET ?', rewardData);
            const [results] = await pool.query('INSERT INTO rewards SET ?', rewardData);
            console.log('Query results:', results);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Actualizar una recompensa por ID
     */
    updateReward: async (rewardId, rewardData) => {
        try {
            console.log('Executing query: UPDATE rewards SET ? WHERE id = ?', [rewardData, rewardId]);
            const [results] = await pool.query('UPDATE rewards SET ? WHERE id = ?', [rewardData, rewardId]);
            console.log('Query results:', results);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Eliminar una recompensa por ID
     */
    deleteReward: async (rewardId) => {
        try {
            console.log('Executing query: DELETE FROM rewards WHERE id = ?', [rewardId]);
            const [results] = await pool.query('DELETE FROM rewards WHERE id = ?', [rewardId]);
            console.log('Query results:', results);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener el total de recompensas redimidas
     */
    getTotalRewardsRedeemed: async () => {
        try {
            const query = 'SELECT COUNT(*) as total FROM user_rewards';
            console.log('Executing query:', query);
            const [[result]] = await pool.query(query);
            console.log('Query result:', result);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener el total de puntos gastados en recompensas
     */
    getTotalPointsSpent: async () => {
        try {
            const query = `
                SELECT SUM(rewards.points_required) as total_points
                FROM user_rewards
                JOIN rewards ON user_rewards.reward_id = rewards.id
            `;
            console.log('Executing query:', query);
            const [[result]] = await pool.query(query);
            console.log('Query result:', result);
            return result;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    },

    /**
     * Obtener las recompensas más populares
     */
    getMostPopularRewards: async (limit) => {
        try {
            const query = `
                SELECT rewards.*, COUNT(user_rewards.reward_id) as times_redeemed
                FROM user_rewards
                JOIN rewards ON user_rewards.reward_id = rewards.id
                GROUP BY user_rewards.reward_id
                ORDER BY times_redeemed DESC
                LIMIT ?
            `;
            console.log('Executing query:', query, [limit]);
            const [results] = await pool.query(query, [limit]);
            console.log('Query results:', results);
            return results;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    }
};

module.exports = Reward;
