const request = require('supertest');
const app = require('../../index');
const dbConfig = require('../../config').dbConfig;
const mysql = require('mysql2/promise');

const pool = mysql.createPool(dbConfig);

describe('Task Routes', () => {
    let server;
    let createdTaskId;

    beforeAll((done) => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should fetch all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

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
        const res = await request(app)
            .post('/tasks')
            .send(newTask);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        createdTaskId = res.body.id;
    });

    it('should fetch a task by ID', async () => {
        const res = await request(app).get(`/tasks/${createdTaskId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', createdTaskId);
    });

    it('should update a task', async () => {
        const updateData = { title: 'Updated Task' };
        const res = await request(app)
            .put(`/tasks/${createdTaskId}`)
            .send(updateData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', updateData.title);
    });

    it('should delete a task', async () => {
        const res = await request(app).delete(`/tasks/${createdTaskId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for a non-existent task', async () => {
        const res = await request(app).get('/tasks/9999');
        expect(res.statusCode).toEqual(404);
    });
});
