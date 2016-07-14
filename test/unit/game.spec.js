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
        game.movePiece(game.player1Pieces[10], 5, 5, () => {
          expect(game.save.getCall(1).thisValue.turn).to.equal(2);
          expect(game.save.getCall(1).thisValue.player1Pieces[10].x).to.equal(5);
          expect(game.save.getCall(1).thisValue.player1Pieces[10].y).to.equal(5);
          done();
        });
      });
    }));
  });
});
