const assert = require('assert');
const request = require('supertest');
const app = require('../app-ora-backend'); // Replace '../app' with the path to your Express app file

describe('API Routes', () => {
    describe('GET /etablissement', () => {
        it('should return a 200 status code and an array in a data param', (done) => {
            request(app)
                .get('/etablissement') // Replace '/api/route' with the actual route you want to test
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    assert(Array.isArray(res.body.data));
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    })
    describe('GET /etablissement/1', () => {
        it('should return a 200 status code and an array', (done) => {
            request(app)
                .get('/etablissement/1') // Replace '/api/route' with the actual route you want to test
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    // Add more describe blocks for other routes you want to test
});