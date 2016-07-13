/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const User = require('../../dst/models/user');

describe('games', () => {
  let player1 = null;
  let player2 = null;
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populatePlayers.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      User.findById('012345678901234567890001', (err1, p1) => {
        User.findById('012345678901234567890002', (err2, p2) => {
          player1 = p1._id.toString();
          player2 = p2._id.toString();
          done();
        });
      });
    });
  });

  describe('post /games', () => {
    it('should create a game', done => {
      request(app)
      .post('/games')
      .send({
        player1,
        player2,
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.turn).to.equal(0);
        expect(rsp.body.game.player1.toString()).to.equal('012345678901234567890001');
        expect(rsp.body.game.player2.toString()).to.equal('012345678901234567890002');
        done();
      });
    });
    it('should NOT create a game -- invalid object id for player1', done => {
      request(app)
      .post('/games')
      .send({
        player1: 'wrongid',
        player2,
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"player1" with value "wrongid" fails to match the required pattern');
        done();
      });
    });
    it('should NOT create a game -- missing player1', done => {
      request(app)
      .post('/games')
      .send({
        player2,
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"player1" is required']);
        done();
      });
    });
    it('should NOT create a game -- invalid object id for player2', done => {
      request(app)
      .post('/games')
      .send({
        player1,
        player2: 'wrongid',
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"player2" with value "wrongid" fails to match the required pattern');
        done();
      });
    });
    it('should NOT create a game -- missing player2', done => {
      request(app)
      .post('/games')
      .send({
        player1,
      })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"player2" is required']);
        done();
      });
    });
  });
});
