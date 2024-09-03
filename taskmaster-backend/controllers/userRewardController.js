const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const dbConfig = require('../config').dbConfig;

const pool = mysql.createPool(dbConfig);

/**
 * @swagger
 * /redeem:
 *   post:
 *     summary: Redeem a reward for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user
 *               reward_id:
 *                 type: integer
 *                 description: The ID of the reward
 *             required:
 *               - user_id
 *               - reward_id
 *     responses:
 *       200:
 *         description: Reward redeemed successfully
 *       400:
 *         description: Not enough points to redeem this reward or validation errors
 *       404:
 *         description: User or reward not found
 *       500:
 *         description: Internal server error
 */
exports.redeemReward = [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('reward_id').isInt().withMessage('Reward ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.body.user_id;
        const rewardId = req.body.reward_id;

        console.log(`Attempting to redeem reward. User ID: ${userId}, Reward ID: ${rewardId}`);

        try {
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();

                console.log(`Fetching points for user ID: ${userId}`);
                const [userResults] = await connection.query('SELECT points FROM users WHERE id = ?', [userId]);
                if (userResults.length === 0) {
                    await connection.rollback();
                    console.log('User not found');
                    return res.status(404).json({ message: 'User not found' });
                }

                const userPoints = userResults[0].points;
                console.log(`User points: ${userPoints}`);

                console.log(`Fetching points required for reward ID: ${rewardId}`);
                const [rewardResults] = await connection.query('SELECT points_required FROM rewards WHERE id = ?', [rewardId]);
                if (rewardResults.length === 0) {
                    await connection.rollback();
                    console.log('Reward not found');
                    return res.status(404).json({ message: 'Reward not found' });
                }

                const pointsRequired = rewardResults[0].points_required;
                console.log(`Points required for reward: ${pointsRequired}`);

                if (userPoints < pointsRequired) {
                    await connection.rollback();
                    console.log('Not enough points to redeem this reward');
                    return res.status(400).json({ message: 'Not enough points to redeem this reward' });
                }

                console.log(`Inserting redeemed reward into user_rewards. User ID: ${userId}, Reward ID: ${rewardId}`);
                await connection.query('INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)', [userId, rewardId]);

                console.log(`Updating user points. Deducting ${pointsRequired} points from user ID: ${userId}`);
                await connection.query('UPDATE users SET points = points - ? WHERE id = ?', [pointsRequired, userId]);

                await connection.commit();
                console.log('Reward redeemed successfully for user_id:', userId, 'reward_id:', rewardId);
                res.status(200).json({ message: 'Reward redeemed successfully' });
            } catch (err) {
                await connection.rollback();
                console.error('Error redeeming reward:', err);
                res.status(500).json({ message: 'Internal server error', error: err });
            } finally {
                connection.release();
            }
        } catch (err) {
            console.error('Error getting connection:', err);
            res.status(500).json({ message: 'Internal server error', error: err });
        }
    }
];
