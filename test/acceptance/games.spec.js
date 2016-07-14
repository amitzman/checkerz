/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const User = require('../../dst/models/user');
const Game = require('../../dst/models/game');

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
        expect(rsp.body.game.turn).to.equal(1);
        expect(rsp.body.game.player1.toString()).to.equal('012345678901234567890001');
        expect(rsp.body.game.player2.toString()).to.equal('012345678901234567890002');
        expect(rsp.body.game.player1Pieces).to.have.length(12);
        expect(rsp.body.game.player1Pieces[0].x).to.equal(1);
        expect(rsp.body.game.player1Pieces[0].y).to.equal(0);
        expect(rsp.body.game.player1Pieces[6].x).to.equal(4);
        expect(rsp.body.game.player1Pieces[6].y).to.equal(1);
        expect(rsp.body.game.player1Pieces[11].x).to.equal(7);
        expect(rsp.body.game.player1Pieces[11].y).to.equal(2);
        expect(rsp.body.game.player2Pieces).to.have.length(12);
        expect(rsp.body.game.player2Pieces[2].x).to.equal(2);
        expect(rsp.body.game.player2Pieces[2].y).to.equal(7);
        expect(rsp.body.game.player2Pieces[5].x).to.equal(5);
        expect(rsp.body.game.player2Pieces[5].y).to.equal(6);
        expect(rsp.body.game.player2Pieces[11].x).to.equal(0);
        expect(rsp.body.game.player2Pieces[11].y).to.equal(5);
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

  describe('put /games/:id/move', () => {
    it('should move a piece', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: 6,
          targetY: 3,
        })
        .end((err, rsp) => {
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.turn).to.equal(2);
          expect(rsp.body.game.player1Pieces[10].x).to.equal(6);
          expect(rsp.body.game.player1Pieces[10].y).to.equal(3);
          done();
        });
      });
    });
    it('should NOT move a piece - out of bounds', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: 8,
          targetY: 5,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages[0]).to.equal('"targetX" must be less than or equal to 7');
          done();
        });
      });
    });
    it('should NOT move a piece - out of bounds', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: -2,
          targetY: 5,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages[0]).to.equal('"targetX" must be larger than or equal to 0');
          done();
        });
      });
    });
    it('should NOT move a piece - out of bounds', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: 5,
          targetY: 9,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages[0]).to.equal('"targetY" must be less than or equal to 7');
          done();
        });
      });
    });
    it('should NOT move a piece - out of bounds', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: 5,
          targetY: -2,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages[0]).to.equal('"targetY" must be larger than or equal to 0');
          done();
        });
      });
    });
    it('should NOT move a piece - piece is currently in that spot', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[6],
          targetX: 3,
          targetY: 2,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.equal('Location already occupied');
          done();
        });
      });
    });
    it('should NOT move a piece - invalid move 2 spaces vertically', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generatePieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[10],
          targetX: 5,
          targetY: 4,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.equal('Invalid Move');
          done();
        });
      });
    });
    it('should king a piece when it reaches the opposite side - player1', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generateTestKingPieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player1Pieces[0],
          targetX: 3,
          targetY: 7,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.player1Pieces[0].isKing).to.equal(true);
          expect(rsp.body.game.player1Pieces[0].x).to.equal(3);
          expect(rsp.body.game.player1Pieces[0].y).to.equal(7);
          done();
        });
      });
    });
    it('should king a piece when it reaches the opposite side - player2', done => {
      const game = new Game({
        player1: '012345678901234567890001',
        player2: '012345678901234567890002',
      });
      game.generateTestKingPieces(() => {
        request(app)
        .put(`/games/${game._id}/move`)
        .send({
          piece: game.player2Pieces[0],
          targetX: 0,
          targetY: 0,
        })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.player2Pieces[0].isKing).to.equal(true);
          expect(rsp.body.game.player2Pieces[0].x).to.equal(0);
          expect(rsp.body.game.player2Pieces[0].y).to.equal(0);
          done();
        });
      });
    });
  });
});
