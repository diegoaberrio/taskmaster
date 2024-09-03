const request = require('supertest');
const app = require('../../index');
const dbConfig = require('../../config').dbConfig;
const mysql = require('mysql2/promise');

const pool = mysql.createPool(dbConfig);

describe('Notification Routes', () => {
    let server;
    let createdNotificationId;

    beforeAll((done) => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should fetch notifications for a user', async () => {
        const userId = 1;
        const res = await request(app).get(`/api/notifications/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should create a new notification', async () => {
        const newNotification = {
            user_id: 1,
            message: 'Test Notification'
        };
        const res = await request(app)
            .post('/api/notifications')
            .send(newNotification);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        createdNotificationId = res.body.id;
    });

    it('should delete a notification', async () => {
        const res = await request(app).delete(`/api/notifications/${createdNotificationId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for a non-existent notification', async () => {
        const res = await request(app).get('/api/notifications/9999');
        expect(res.statusCode).toEqual(404);
    });
});
