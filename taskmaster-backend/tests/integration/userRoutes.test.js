const request = require('supertest');
const app = require('../../index');
const dbConfig = require('../../config').dbConfig;
const mysql = require('mysql2/promise');

const pool = mysql.createPool(dbConfig);

describe('User Routes', () => {
    let server;
    let createdUserId;

    beforeAll((done) => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should fetch all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should create a new user', async () => {
        const newUser = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password'
        };
        const res = await request(app)
            .post('/api/users')
            .send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        createdUserId = res.body.id;
    });

    it('should fetch a user by ID', async () => {
        const res = await request(app).get(`/api/users/${createdUserId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', createdUserId);
    });

    it('should update a user', async () => {
        const updateData = { name: 'Updated User' };
        const res = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send(updateData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', updateData.name);
    });

    it('should delete a user', async () => {
        const res = await request(app).delete(`/api/users/${createdUserId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for a non-existent user', async () => {
        const res = await request(app).get('/api/users/9999');
        expect(res.statusCode).toEqual(404);
    });
});
