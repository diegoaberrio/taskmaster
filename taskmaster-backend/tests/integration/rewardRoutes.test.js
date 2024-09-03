const request = require('supertest');
const app = require('../../index');
const dbConfig = require('../../config').dbConfig;
const mysql = require('mysql2/promise');

const pool = mysql.createPool(dbConfig);

describe('Reward Routes', () => {
    let server;
    let createdRewardId;

    beforeAll((done) => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should fetch all rewards', async () => {
        const res = await request(app).get('/api/rewards');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should create a new reward', async () => {
        const newReward = {
            reward_name: 'Test Reward',
            points_required: 10
        };
        const res = await request(app)
            .post('/api/rewards')
            .send(newReward);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        createdRewardId = res.body.id;
    });

    it('should fetch a reward by ID', async () => {
        const res = await request(app).get(`/api/rewards/${createdRewardId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', createdRewardId);
    });

    it('should update a reward', async () => {
        const updateData = { reward_name: 'Updated Reward' };
        const res = await request(app)
            .put(`/api/rewards/${createdRewardId}`)
            .send(updateData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reward_name', updateData.reward_name);
    });

    it('should delete a reward', async () => {
        const res = await request(app).delete(`/api/rewards/${createdRewardId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for a non-existent reward', async () => {
        const res = await request(app).get('/api/rewards/9999');
        expect(res.statusCode).toEqual(404);
    });
});
