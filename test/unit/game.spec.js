/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../dst/models/game');
const players = require('../data/players');

describe('Game', () => {
  let game = null;
  beforeEach((done) => {
    game = new Game({
      player1: players[0]._id.$oid,
      player2: players[1]._id.$oid,
    });
    done();
  });
  describe('constructor', () => {
    it('should create a game', done => {
      game.validate(err => {
        expect(err).to.be.undefined;
        expect(game.turn).to.equal(1);
        expect(game.player1.toString()).to.equal('012345678901234567890001');
        expect(game.player2.toString()).to.equal('012345678901234567890002');
        expect(game.player1Pieces).to.have.length(0);
        expect(game.player2Pieces).to.have.length(0);
        done();
      });
    });
  });
  describe('#generatePieces', () => {
    it('should generate pieces and initialize the board', sinon.test(function (done) {
      this.stub(game, 'save').yields(null, {});
      game.generatePieces(() => {
        expect(game.save.getCall(0).thisValue.player1Pieces).to.have.length(12);
        expect(game.save.getCall(0).thisValue.player1Pieces[0].x).to.equal(1);
        expect(game.save.getCall(0).thisValue.player1Pieces[0].y).to.equal(0);
        expect(game.save.getCall(0).thisValue.player1Pieces[6].x).to.equal(4);
        expect(game.save.getCall(0).thisValue.player1Pieces[6].y).to.equal(1);
        expect(game.save.getCall(0).thisValue.player1Pieces[11].x).to.equal(7);
        expect(game.save.getCall(0).thisValue.player1Pieces[11].y).to.equal(2);
        expect(game.save.getCall(0).thisValue.player2Pieces).to.have.length(12);
        expect(game.save.getCall(0).thisValue.player2Pieces[2].x).to.equal(2);
        expect(game.save.getCall(0).thisValue.player2Pieces[2].y).to.equal(7);
        expect(game.save.getCall(0).thisValue.player2Pieces[5].x).to.equal(5);
        expect(game.save.getCall(0).thisValue.player2Pieces[5].y).to.equal(6);
        expect(game.save.getCall(0).thisValue.player2Pieces[11].x).to.equal(0);
        expect(game.save.getCall(0).thisValue.player2Pieces[11].y).to.equal(5);
        done();
      });
    }));
  });
  describe('#movePiece', () => {
    it('should successfully move a piece', sinon.test(function (done) {
      this.stub(game, 'save').yields(null, {});
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[10], 6, 3, () => {
          expect(game.save.getCall(1).thisValue.turn).to.equal(2);
          expect(game.save.getCall(1).thisValue.player1Pieces[10].x).to.equal(6);
          expect(game.save.getCall(1).thisValue.player1Pieces[10].y).to.equal(3);
          done();
        });
      });
    }));
    it('should not move a piece - out of bounds', done => {
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[10], 10, 5, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[10].x).to.equal(5);
          expect(game.player1Pieces[10].y).to.equal(2);
          done();
        });
      });
    });
    it('should not move a piece - out of bounds', done => {
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[10], -10, 5, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[10].x).to.equal(5);
          expect(game.player1Pieces[10].y).to.equal(2);
          done();
        });
      });
    });
    it('should not move a piece - out of bounds', done => {
      game.generatePieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[10], 1, -15, () => {
          expect(game.turn).to.equal(2);
          expect(game.player2Pieces[10].x).to.equal(2);
          expect(game.player2Pieces[10].y).to.equal(5);
          done();
        });
      });
    });
    it('should not move a piece - out of bounds', done => {
      game.generatePieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[10], 1, 15, () => {
          expect(game.turn).to.equal(2);
          expect(game.player2Pieces[10].x).to.equal(2);
          expect(game.player2Pieces[10].y).to.equal(5);
          done();
        });
      });
    });
    it('should not move a piece - location already occupied', done => {
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[6], 3, 2, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[6].x).to.equal(4);
          expect(game.player1Pieces[6].y).to.equal(1);
          done();
        });
      });
    });
    it('should not move a piece - vertical move one space, player 1', done => {
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[8], 1, 3, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[8].x).to.equal(1);
          expect(game.player1Pieces[8].y).to.equal(2);
          done();
        });
      });
    });
    it('should not move a piece - horizontal move one space, player 1', done => {
      game.generatePieces(() => {
        game.movePiece(game.player1Pieces[8], 2, 2, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[8].x).to.equal(1);
          expect(game.player1Pieces[8].y).to.equal(2);
          done();
        });
      });
    });
    it('should not move a piece - vertical move one space, player 2', done => {
      game.generatePieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[8], 6, 4, () => {
          expect(game.turn).to.equal(2);
          expect(game.player2Pieces[8].x).to.equal(6);
          expect(game.player2Pieces[8].y).to.equal(5);
          done();
        });
      });
    });
    it('should not move a piece - horizontal move one space, player 2', done => {
      game.generatePieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[8], 5, 5, () => {
          expect(game.turn).to.equal(2);
          expect(game.player2Pieces[8].x).to.equal(6);
          expect(game.player2Pieces[8].y).to.equal(5);
          done();
        });
      });
    });
    it('should move a king piece backwards, player 2', done => {
      game.generatePieces(() => {
        game.player2Pieces[8].isKing = true;
        game.turn = 2;
        game.movePiece(game.player2Pieces[8], 7, 4, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[8].x).to.equal(7);
          expect(game.player2Pieces[8].y).to.equal(4);
          game.turn = 2;
          game.movePiece(game.player2Pieces[8], 6, 5, () => {
            expect(game.turn).to.equal(1);
            expect(game.player2Pieces[8].x).to.equal(6);
            expect(game.player2Pieces[8].y).to.equal(5);
            done();
          });
        });
      });
    });
    it('should move a king piece backwards, player 1', done => {
      game.generatePieces(() => {
        game.player1Pieces[8].isKing = true;
        game.movePiece(game.player1Pieces[8], 2, 3, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[8].x).to.equal(2);
          expect(game.player1Pieces[8].y).to.equal(3);
          game.turn = 1;
          game.movePiece(game.player1Pieces[8], 1, 2, () => {
            expect(game.turn).to.equal(2);
            expect(game.player1Pieces[8].x).to.equal(1);
            expect(game.player1Pieces[8].y).to.equal(2);
            done();
          });
        });
      });
    });
    it('should king a piece when it reaches the other side, player 1', done => {
      game.generatePieces(() => {
        game.player2Pieces.splice(2, 1);
        game.player2Pieces.splice(6, 1);
        game.player1Pieces[0].x = 3;
        game.player1Pieces[0].y = 6;
        game.movePiece(game.player1Pieces[0], 2, 7, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[0].x).to.equal(2);
          expect(game.player1Pieces[0].y).to.equal(7);
          expect(game.player1Pieces[0].isKing).to.equal(true);
          done();
        });
      });
    });
    it('should king a piece when it reaches the other side, player 2', done => {
      game.generatePieces(() => {
        game.player1Pieces.splice(2, 1);
        game.player1Pieces.splice(6, 1);
        game.player2Pieces[0].x = 4;
        game.player2Pieces[0].y = 1;
        game.movePiece(game.player2Pieces[0], 5, 0, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[0].x).to.equal(5);
          expect(game.player2Pieces[0].y).to.equal(0);
          expect(game.player2Pieces[0].isKing).to.equal(true);
          done();
        });
      });
    });
    it('should succesfully jump an opponents piece, player 1, down-right jump', done => {
      game.generateTestJumpPieces(() => {
        game.movePiece(game.player1Pieces[0], 5, 5, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[0].x).to.equal(5);
          expect(game.player1Pieces[0].y).to.equal(5);
          expect(game.player2Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('should succesfully jump an opponents piece, player 2, up-left jump', done => {
      game.generateTestJumpPieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[0], 2, 2, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[0].x).to.equal(2);
          expect(game.player2Pieces[0].y).to.equal(2);
          expect(game.player1Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('should succesfully jump an opponents piece, player 2, up-right jump', done => {
      game.generateTestJumpPieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[1], 4, 2, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[1].x).to.equal(4);
          expect(game.player2Pieces[1].y).to.equal(2);
          expect(game.player1Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('should succesfully jump an opponents piece, player 1, down-left jump', done => {
      game.generateTestJumpPieces(() => {
        game.movePiece(game.player1Pieces[0], 1, 5, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[0].x).to.equal(1);
          expect(game.player1Pieces[0].y).to.equal(5);
          expect(game.player2Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('king should succesfully jump an opponents piece, player 2, down-right jump', done => {
      game.generateTestJumpKingPieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[1], 4, 4, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[1].x).to.equal(4);
          expect(game.player2Pieces[1].y).to.equal(4);
          expect(game.player1Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('king should succesfully jump an opponents piece, player 1, up-left jump', done => {
      game.generateTestJumpKingPieces(() => {
        game.movePiece(game.player1Pieces[0], 1, 1, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[0].x).to.equal(1);
          expect(game.player1Pieces[0].y).to.equal(1);
          expect(game.player2Pieces).to.have.length(2);
          done();
        });
      });
    });
    it('king should succesfully jump an opponents piece, player 1, up-right jump', done => {
      game.generateTestJumpKingPieces(() => {
        game.movePiece(game.player1Pieces[0], 5, 1, () => {
          expect(game.turn).to.equal(2);
          expect(game.player1Pieces[0].x).to.equal(5);
          expect(game.player1Pieces[0].y).to.equal(1);
          expect(game.player2Pieces).to.have.length(2);
          done();
        });
      });
    });
    it('king should succesfully jump an opponents piece, player 2, down-left jump', done => {
      game.generateTestJumpKingPieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[0], 2, 4, () => {
          expect(game.turn).to.equal(1);
          expect(game.player2Pieces[0].x).to.equal(2);
          expect(game.player2Pieces[0].y).to.equal(4);
          expect(game.player1Pieces).to.have.length(1);
          done();
        });
      });
    });
    it('should NOT jump a piece -- being blocked', done => {
      game.generateTestBadJumpPieces(() => {
        game.movePiece(game.player1Pieces[0], 1, 1, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[0].x).to.equal(3);
          expect(game.player1Pieces[0].y).to.equal(3);
          expect(game.player2Pieces).to.have.length(2);
          done();
        });
      });
    });
    it('should NOT jump a piece -- no piece to be jumped', done => {
      game.generateTestBadJumpPieces(() => {
        game.movePiece(game.player1Pieces[0], 5, 1, () => {
          expect(game.turn).to.equal(1);
          expect(game.player1Pieces[0].x).to.equal(3);
          expect(game.player1Pieces[0].y).to.equal(3);
          expect(game.player2Pieces).to.have.length(2);
          done();
        });
      });
    });
    it('should NOT jump a piece -- jumping same team piece', done => {
      game.generateTestBadJumpPieces(() => {
        game.turn = 2;
        game.movePiece(game.player2Pieces[0], 0, 0, () => {
          expect(game.turn).to.equal(2);
          expect(game.player2Pieces[0].x).to.equal(2);
          expect(game.player2Pieces[0].y).to.equal(2);
          expect(game.player1Pieces).to.have.length(1);
          expect(game.player2Pieces).to.have.length(2);
          done();
        });
      });
    });
    it('should win the game after the opposing teams last piece is jumped', done => {
      game.generateTestWinningGamePieces(() => {
        game.movePiece(game.player1Pieces[0], 1, 1, (response) => {
          console.log(response);
          expect(response.message).to.equal('Player 1 has won the game');
          expect(game.player2Pieces).to.have.length(0);
          done();
        });
      });
    });
  });
});
