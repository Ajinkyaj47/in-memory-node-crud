const chai = require('chai');
const supertest = require('supertest');
const app = require('./app'); // Replace with the actual path to your app file

const { expect } = chai;
const request = supertest(app);

describe('User API Tests', () => {
  let userId;

  it('should get all users and return an empty array', async () => {
    const response = await request.get('/api/users');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').that.is.empty;
  });

  it('should create a new user and return the created record', async () => {
    const userData = {
      username: 'JohnDoe',
      age: 30,
      hobbies: ['Reading', 'Traveling', 'Coding'],
    };

    const response = await request.post('/api/users').send(userData);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    userId = response.body.id;
  });

  it('should get the created user by userId', async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status).to.equal(200);
    expect(response.body.id).to.equal(userId);
  });

  it('should update the created user and return the updated record', async () => {
    const updatedUserData = {
      username: 'UpdatedJohnDoe',
      age: 31,
      hobbies: ['Reading', 'Traveling', 'Coding', 'Gaming'],
    };

    const response = await request.put(`/api/users/${userId}`).send(updatedUserData);
    expect(response.status).to.equal(200);
    expect(response.body.id).to.equal(userId);
    expect(response.body.username).to.equal(updatedUserData.username);
  });

  it('should delete the created user and return a success message', async () => {
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status).to.equal(204);
    expect(response.body).to.be.empty;

    // Verify that the user has been deleted
    const getUserResponse = await request.get(`/api/users/${userId}`);
    expect(getUserResponse.status).to.equal(404);
    expect(getUserResponse.body).to.have.property('error').that.includes('User not found');
  });
});
