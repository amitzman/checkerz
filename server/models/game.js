/* eslint-disable no-use-before-define, prefer-arrow-callback, func-names, no-param-reassign, brace-style, consistent-return, max-len */

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

schema.methods.generateTestKingPieces = function (cb) {
  this.player1Pieces.push(new Piece(4, 6, 1));
  this.player2Pieces.push(new Piece(1, 1, 2));
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player1Pieces[1].isKing = true;
  this.save(() => {
    cb();
  });
};

schema.methods.movePiece = function (piece, targetX, targetY, cb) {
  if (isOutOfBounds(targetX, targetY)) { return cb({ error: 'Move Out of Bounds' }); }
  if (isOccupied(targetX, targetY, this)) { return cb({ error: 'Location already occupied' }); }
  if (isInvalidMove(piece, targetX, targetY)) { return cb({ error: 'Invalid Move' }); }
  if (piece.player === 1) {
    this.player1Pieces = updatePiece(this.player1Pieces, piece, targetX, targetY);
    this.turn = 2;
  } else {
    this.player2Pieces = updatePiece(this.player2Pieces, piece, targetX, targetY);
    this.turn = 1;
  }

  this.save(() => {
    cb(this);
  });
};

const updatePiece = function (currentTeamPieces, pieceToBeMoved, targetX, targetY) {
  return currentTeamPieces.map(function (piece) {
    if (piece.x === pieceToBeMoved.x && piece.y === pieceToBeMoved.y) {
      piece.x = targetX;
      piece.y = targetY;
      if (piece.player === 1 && piece.y === 7) {
        piece.isKing = true;
      } else if (piece.player === 2 && piece.y === 0) {
        piece.isKing = true;
      }
    }
    return piece;
  });
};

const isOccupied = function (targetX, targetY, game) {
  const allPieces = game.player1Pieces.concat(game.player2Pieces);
  const piecesAtTargetLocation = allPieces.filter(piece => piece.x === targetX && piece.y === targetY);
  if (piecesAtTargetLocation.length >= 1) {
    return true;
  }
  return false;
};

const isInvalidMove = function (piece, targetX, targetY) {
  if (targetX === piece.x + 1 || targetX === piece.x - 1) {
    if (piece.isKing &&
      ((targetY === piece.y + 1) || (targetY === piece.y - 1))) {
      return false;
    }
    if (piece.player === 1) {
      if (targetY === piece.y + 1) {
        return false;
      }
    } else {
      if (targetY === piece.y - 1) {
        return false;
      }
    }
  }
  return true;
};

const isOutOfBounds = function (targetX, targetY) {
  return (targetX >= 8 || targetX < 0 || targetY >= 8 || targetY < 0);
};

module.exports = mongoose.model('Game', schema);
