/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const Piece = require('../../dst/models/piece');

describe('Piece', () => {
  describe('constructor', () => {
    it('should create a piece', () => {
      const piece = new Piece(0, 2, 1);
      expect(piece.x).to.equal(0);
      expect(piece.y).to.equal(2);
      expect(piece.player).to.equal(1);
      expect(piece.isKing).to.equal(false);
    });
  });
});
