/* eslint-disable no-use-before-define, func-names, no-param-reassign, brace-style, consistent-return, max-len */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Piece = require('./piece');

const schema = new Schema({
  turn: { type: Number, default: 1 },
  player1: { type: mongoose.Schema.ObjectId, ref: 'User' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'User' },
  player1Pieces: [Schema.Types.Mixed],
  player2Pieces: [Schema.Types.Mixed],
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.generatePieces = function (cb) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j++) {
      if (((i + j) % 2) === 1) {
        this.player1Pieces.push(new Piece(j, i, 1));
        this.player2Pieces.push(new Piece(7 - j, 7 - i, 2));
      }
    }
  }
  this.save(() => {
    cb();
  });
};

schema.methods.movePiece = function (piece, targetX, targetY, cb) {
  if (piece.player === this.turn) {
    piece.x = targetX;
    piece.y = targetY;
  } else {
    return cb();
  }

  if (this.turn === 1) { this.turn = 2; }
  else { this.turn = 1; }

  this.save(() => {
    cb();
  });
};

module.exports = mongoose.model('Game', schema);
