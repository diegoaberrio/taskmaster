const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

const UserReward = {
    redeemReward: async (userId, rewardId) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [[userPoints]] = await connection.query('SELECT points FROM users WHERE id = ?', [userId]);
            const [[rewardPoints]] = await connection.query('SELECT points_required FROM rewards WHERE id = ?', [rewardId]);

            if (!userPoints) {
                throw new Error('User not found');
            }
            if (!rewardPoints) {
                throw new Error('Reward not found');
            }

            if (userPoints.points < rewardPoints.points_required) {
                throw new Error('Not enough points to redeem this reward');
            }

            await connection.query('INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)', [userId, rewardId]);
            await connection.query('UPDATE users SET points = points - ? WHERE id = ?', [rewardPoints.points_required, userId]);

            await connection.commit();
            return { success: true };
        } catch (err) {
            await connection.rollback();
            console.error('Error redeeming reward:', err.message);
            throw err;
        } finally {
            connection.release();
        }
    }
};

module.exports = UserReward;
