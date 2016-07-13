/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../dst/models/game');
const players = require('../data/players');

describe('Game', () => {
  describe('constructor', () => {
    it('should create a game', done => {
      const game = new Game({
        player1: players[0]._id.$oid,
        player2: players[1]._id.$oid,
      });
      game.validate(err => {
        expect(err).to.be.undefined;
        expect(game.turn).to.equal(0);
        expect(game.player1.toString()).to.equal('012345678901234567890001');
        expect(game.player2.toString()).to.equal('012345678901234567890002');
        expect(game.player1Pieces).to.have.length(0);
        expect(game.player2Pieces).to.have.length(0);
        done();
      });
    });
  });
  describe('#generatePieces', () => {
    it('should generate pieces and initialize the board', done => {
      const game = new Game({
        player1: players[0]._id.$oid,
        player2: players[1]._id.$oid,
      });
      game.generatePieces();
      console.log('++++++++', game.player1Pieces.length === 12);
      game.validate(err => {
        expect(err).to.be.undefined;
        expect(game.player1Pieces).to.have.length(12);
        expect(game.player2Pieces).to.have.length(12);
        done();
      });
    });
  });
});
