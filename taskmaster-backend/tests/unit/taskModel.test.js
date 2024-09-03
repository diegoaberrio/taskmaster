const Task = require('../../models/task');
const dbConfig = require('../../config').dbConfig;
const mysql = require('mysql2/promise');

let pool;

beforeAll(async () => {
    pool = await mysql.createPool(dbConfig);
    Task.connection = pool; // Assuming your model uses this connection
});

afterAll(async () => {
    await pool.end();
});

describe('Task Model', () => {
    let createdTaskId;

    it('should create a new task', async () => {
        const newTask = {
            user_id: 1,
            title: 'Test Task',
            description: 'Test Description',
            priority: 'low',
            status: 'pending',
            start_date: '2024-07-01',
            due_date: '2024-07-10',
        };
        const result = await Task.createTask(newTask);
        expect(result).toHaveProperty('insertId');
        createdTaskId = result.insertId;
    });

    it('should fetch a task by ID', async () => {
        const task = await Task.getTaskById(createdTaskId);
        expect(task).toBeDefined();
        expect(task).toHaveProperty('id', createdTaskId);
    });

    it('should update a task', async () => {
        const updatedTask = { title: 'Updated Task' };
        const result = await Task.updateTask(createdTaskId, updatedTask);
        expect(result).toHaveProperty('affectedRows', 1);

        const task = await Task.getTaskById(createdTaskId);
        expect(task).toHaveProperty('title', updatedTask.title);
    });

    it('should delete a task', async () => {
        const result = await Task.deleteTask(createdTaskId);
        expect(result).toHaveProperty('affectedRows', 1);

        const task = await Task.getTaskById(createdTaskId);
        expect(task).toBeNull();
    });
});
