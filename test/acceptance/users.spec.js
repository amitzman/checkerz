/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('users', () => {
  afterEach((done) => {
    cp.execFile(`${__dirname}/../scripts/dropDB.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /users', () => {
    it('should create a user', done => {
      request(app)
      .post('/users')
      .send({ name: 'Bob' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.user.name).to.equal('Bob');
        done();
      });
    });
    it('should NOT create a user -- name missing', done => {
      request(app)
      .post('/users')
      .send({})
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
    it('should NOT create a user -- name is not a string', done => {
      request(app)
      .post('/users')
      .send({
        name: 2,
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" must be a string']);
        done();
      });
    });
  });
});
