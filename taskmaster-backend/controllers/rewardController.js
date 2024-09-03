const { body, param, query, validationResult } = require('express-validator');
const Reward = require('../models/reward');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reward:
 *       type: object
 *       required:
 *         - reward_name
 *         - points_required
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the reward
 *         reward_name:
 *           type: string
 *           description: The name of the reward
 *         points_required:
 *           type: integer
 *           description: The number of points required to redeem the reward
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the reward was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the reward was last updated
 */

/**
 * @swagger
 * /rewards:
 *   get:
 *     summary: Retrieve a list of all rewards
 *     responses:
 *       200:
 *         description: A list of rewards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reward'
 */
exports.getAllRewards = (req, res) => {
    console.log('Fetching all rewards');
    Reward.getAllRewards()
        .then(rewards => {
            console.log('Rewards retrieved:', rewards);
            res.json(rewards);
        })
        .catch(err => {
            console.error('Error retrieving rewards:', err);
            res.status(500).send(err);
        });
};

/**
 * @swagger
 * /rewards/{id}:
 *   get:
 *     summary: Retrieve a reward by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reward ID
 *     responses:
 *       200:
 *         description: A reward object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reward'
 *       404:
 *         description: Reward not found
 */
exports.getRewardById = [
    param('id').isInt().withMessage('Reward ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rewardId = req.params.id;
        console.log(`Fetching reward with ID: ${rewardId}`);
        Reward.getRewardById(rewardId)
            .then(reward => {
                if (!reward) {
                    console.log('Reward not found');
                    return res.status(404).send('Reward not found');
                }
                console.log('Reward retrieved:', reward);
                res.json(reward);
            })
            .catch(err => {
                console.error('Error retrieving reward:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /rewards:
 *   post:
 *     summary: Create a new reward
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       201:
 *         description: Reward created
 *       400:
 *         description: Invalid input
 */
exports.createReward = [
    body('reward_name').isString().withMessage('Reward name must be a string'),
    body('points_required').isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rewardData = req.body;
        console.log('Creating reward with data:', rewardData);
        Reward.createReward(rewardData)
            .then(result => {
                console.log('Reward created:', result);
                res.status(201).json({ id: result.insertId, ...rewardData });
            })
            .catch(err => {
                console.error('Error creating reward:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /rewards/{id}:
 *   put:
 *     summary: Update a reward
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
 *         application/json:
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
exports.updateReward = [
    param('id').isInt().withMessage('Reward ID must be an integer'),
    body('reward_name').isString().withMessage('Reward name must be a string').optional(),
    body('points_required').isInt({ min: 0 }).withMessage('Points required must be a non-negative integer').optional(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rewardId = req.params.id;
        const rewardData = req.body;

        console.log(`Updating reward with ID: ${rewardId}, Data:`, rewardData);
        Reward.getRewardById(rewardId)
            .then(reward => {
                if (!reward) {
                    console.log('Reward not found');
                    return res.status(404).send('Reward not found');
                }
                return Reward.updateReward(rewardId, rewardData);
            })
            .then(() => {
                console.log('Reward updated');
                res.status(200).json({ id: rewardId, ...rewardData });
            })
            .catch(err => {
                console.error('Error updating reward:', err);
                if (!res.headersSent) {
                    res.status(500).send(err);
                }
            });
    }
];


/**
 * @swagger
 * /rewards/{id}:
 *   delete:
 *     summary: Delete a reward
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
exports.deleteReward = [
    param('id').isInt().withMessage('Reward ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rewardId = req.params.id;
        console.log(`Deleting reward with ID: ${rewardId}`);
        Reward.getRewardById(rewardId)
            .then(reward => {
                if (!reward) {
                    console.log('Reward not found');
                    return res.status(404).send('Reward not found');
                }
                return Reward.deleteReward(rewardId);
            })
            .then(() => {
                console.log('Reward deleted');
                res.status(204).send();
            })
            .catch(err => {
                console.error('Error deleting reward:', err);
                res.status(500).send(err);
            });
    }
];

/**
 * @swagger
 * /rewards/total-redeemed:
 *   get:
 *     summary: Retrieve the total number of rewards redeemed
 *     responses:
 *       200:
 *         description: Total rewards redeemed
 */
exports.getTotalRewardsRedeemed = (req, res) => {
    console.log('Fetching total rewards redeemed');
    Reward.getTotalRewardsRedeemed()
        .then(result => {
            console.log('Total rewards redeemed retrieved:', result);
            res.json(result);
        })
        .catch(err => {
            console.error('Error retrieving total rewards redeemed:', err);
            res.status(500).send(err);
        });
};

/**
 * @swagger
 * /rewards/total-points-spent:
 *   get:
 *     summary: Retrieve the total number of points spent
 *     responses:
 *       200:
 *         description: Total points spent
 */
exports.getTotalPointsSpent = (req, res) => {
    console.log('Fetching total points spent');
    Reward.getTotalPointsSpent()
        .then(result => {
            console.log('Total points spent retrieved:', result);
            res.json(result);
        })
        .catch(err => {
            console.error('Error retrieving total points spent:', err);
            res.status(500).send(err);
        });
};

/**
 * @swagger
 * /rewards/most-popular:
 *   get:
 *     summary: Retrieve the most popular rewards
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The maximum number of rewards to retrieve
 *     responses:
 *       200:
 *         description: A list of the most popular rewards
 */
exports.getMostPopularRewards = [
    query('limit').isInt({ min: 1 }).withMessage('Limit must be a positive integer').optional(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const limit = parseInt(req.query.limit) || 5;
        console.log(`Fetching most popular rewards with limit: ${limit}`);
        Reward.getMostPopularRewards(limit)
            .then(results => {
                console.log('Most popular rewards retrieved:', results);
                res.json(results);
            })
            .catch(err => {
                console.error('Error retrieving most popular rewards:', err);
                res.status(500).send(err);
            });
    }
];
