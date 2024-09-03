const Task = require('../models/task');
const User = require('../models/user');
const Reward = require('../models/reward');

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskStats:
 *       type: object
 *       properties:
 *         totalTasks:
 *           type: integer
 *           description: The total number of tasks
 *         tasksByStatus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               count:
 *                 type: integer
 *         tasksByUser:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               name:
 *                 type: string
 *               count:
 *                 type: integer
 *     UserPoints:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user name
 *         points:
 *           type: integer
 *           description: The points of the user
 *     RewardStats:
 *       type: object
 *       properties:
 *         totalRewards:
 *           type: integer
 *           description: The total number of rewards redeemed
 *         totalPointsSpent:
 *           type: integer
 *           description: The total points spent
 *         popularRewards:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               rewardId:
 *                 type: integer
 *               rewardName:
 *                 type: string
 *               count:
 *                 type: integer
 *     UserStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           description: The total number of users
 *         usersByPoints:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               name:
 *                 type: string
 *               points:
 *                 type: integer
 */

/**
 * @swagger
 * /statistics/tasks/completed:
 *   get:
 *     summary: Retrieve a list of completed tasks
 *     responses:
 *       200:
 *         description: A list of completed tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
exports.getCompletedTasks = async (req, res) => {
    try {
        const result = await Task.getTasksByStatus();
        const completedTasks = result.filter(task => task.status === 'completed');
        res.json(completedTasks);
    } catch (err) {
        console.error('Error fetching completed tasks:', err);
        res.status(500).json({ message: 'Error fetching completed tasks' });
    }
};

/**
 * @swagger
 * /statistics/users/points:
 *   get:
 *     summary: Retrieve points of all users
 *     responses:
 *       200:
 *         description: A list of user points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPoints'
 */
exports.getUserPoints = async (req, res) => {
    try {
        const users = await User.getUsersByPoints();
        const userPoints = users.map(user => ({
            userId: user.id,
            name: user.name,
            points: user.points
        }));
        res.json(userPoints);
    } catch (err) {
        console.error('Error fetching user points:', err);
        res.status(500).json({ message: 'Error fetching user points' });
    }
};

// Obtener los 3 mejores usuarios con más puntos
exports.getTopUsersByPoints = async (req, res) => {
    try {
        const users = await User.getTopUsersByPoints(3);
        const topUsers = users.map(user => ({ userId: user.id, name: user.name, points: user.points }));
        res.json(topUsers);
    } catch (err) {
        console.error('Error fetching top users by points:', err);
        res.status(500).json({ message: 'Error fetching top users by points' });
    }
};

/**
 * @swagger
 * /statistics/rewards/redeemed:
 *   get:
 *     summary: Retrieve redeemed rewards statistics
 *     responses:
 *       200:
 *         description: Redeemed rewards statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RewardStats'
 */
exports.getRedeemedRewards = async (req, res) => {
    try {
        const totalRewards = await Reward.getTotalRewardsRedeemed();
        console.log('Total Rewards:', totalRewards);

        const totalPoints = await Reward.getTotalPointsSpent();
        console.log('Total Points Spent:', totalPoints);

        const popularRewards = await Reward.getMostPopularRewards(5);
        console.log('Popular Rewards:', popularRewards);

        const popularRewardsWithName = await Promise.all(popularRewards.map(async (reward) => {
            const rewardNameResult = await Reward.getRewardNameById(reward.id);
            console.log(`Reward ID: ${reward.id}, Name: ${rewardNameResult ? rewardNameResult.reward_name : 'Unknown'}`);
            return {
                ...reward,
                rewardName: rewardNameResult ? rewardNameResult.reward_name : 'Unknown'
            };
        }));

        res.json({
            totalRewards: totalRewards.total,
            totalPointsSpent: totalPoints.total_points,
            popularRewards: popularRewardsWithName
        });
    } catch (err) {
        console.error('Error fetching redeemed rewards statistics:', err);
        res.status(500).json({ message: 'Error fetching redeemed rewards statistics' });
    }
};



/**
 * @swagger
 * /statistics/tasks:
 *   get:
 *     summary: Retrieve task statistics
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStats'
 */
exports.getTaskStats = async (req, res) => {
    try {
        const totalTasks = await Task.getTotalTasks();
        const tasksByStatus = await Task.getTasksByStatus();
        const tasksByUser = await Task.getTasksByUser();

        const tasksByUserWithNames = await Promise.all(tasksByUser.map(async (task) => {
            const user = await User.getUserById(task.user_id);
            return {
                ...task,
                name: user ? user.name : 'Unknown'
            };
        }));

        res.json({
            totalTasks: totalTasks.total_tasks,
            tasksByStatus,
            tasksByUser: tasksByUserWithNames
        });
    } catch (err) {
        console.error('Error fetching task statistics:', err);
        res.status(500).json({ message: 'Error fetching task statistics' });
    }
};

/**
 * @swagger
 * /statistics/users:
 *   get:
 *     summary: Retrieve user statistics
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 */
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.getTotalUsers();
        const usersByPoints = await User.getUsersByPoints();

        const usersWithTaskStats = await Promise.all(usersByPoints.map(async (user) => {
            const tasksAssigned = await Task.getTasksAssignedToUser(user.id);
            const tasksCompleted = await Task.getTasksCompletedByUser(user.id);
            console.log(`User ${user.id} - Tasks Assigned: ${tasksAssigned.total_tasks}, Tasks Completed: ${tasksCompleted.completed_tasks}`);
            return {
                ...user,
                tasksAssigned: tasksAssigned.total_tasks || 0,
                tasksCompleted: tasksCompleted.completed_tasks || 0
            };
        }));

        res.json({
            totalUsers: totalUsers.total_users,
            usersByPoints: usersWithTaskStats
        });
    } catch (err) {
        console.error('Error fetching user statistics:', err);
        res.status(500).json({ message: 'Error fetching user statistics' });
    }
};


exports.testUserTasksStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const tasksAssigned = await Task.getTasksAssignedToUser(userId);
        const tasksCompleted = await Task.getTasksCompletedByUser(userId);
        
        res.json({
            userId: userId,
            tasksAssigned: tasksAssigned.total_tasks,
            tasksCompleted: tasksCompleted.completed_tasks
        });
    } catch (err) {
        console.error('Error fetching test user task stats:', err);
        res.status(500).json({ message: 'Error fetching test user task stats' });
    }
};

exports.testRewardNameById = async (req, res) => {
    try {
        const rewardId = req.params.rewardId;
        const rewardName = await Reward.getRewardNameById(rewardId);
        res.json(rewardName);
    } catch (err) {
        console.error('Error fetching reward name by ID:', err);
        res.status(500).json({ message: 'Error fetching reward name by ID' });
    }
};

