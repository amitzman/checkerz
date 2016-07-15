/* eslint-disable no-use-before-define, arrow-body-style, no-else-return, prefer-arrow-callback, func-names, no-param-reassign, brace-style, consistent-return, max-len */

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
  if (isOutOfBounds(targetX, targetY)) { return cb({ error: 'Move Out of Bounds' }); }
  if (isOccupied(targetX, targetY, this)) { return cb({ error: 'Location already occupied' }); }
  const jumpedPiece = isValidJump(piece, targetX, targetY, this);
  if (!jumpedPiece && isInvalidMove(piece, targetX, targetY)) { return cb({ error: 'Invalid Move' }); }
  if (piece.player === 1) {
    this.player1Pieces = updatePiece(this.player1Pieces, piece, targetX, targetY);
    this.turn = 2;
  } else {
    this.player2Pieces = updatePiece(this.player2Pieces, piece, targetX, targetY);
    this.turn = 1;
  }

  if (this.player1Pieces.length === 0) {
    this.save(() => {
      return cb({ message: 'Player 2 has won the game' });
    });
  }
  if (this.player2Pieces.length === 0) {
    this.save(() => {
      return cb({ message: 'Player 1 has won the game' });
    });
  }

  this.save(() => {
    cb(this, jumpedPiece);
  });
};

schema.methods.generateTestKingPieces = function (cb) {
  this.player1Pieces.push(new Piece(4, 6, 1));
  this.player2Pieces.push(new Piece(1, 1, 2));
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player2Pieces.push(new Piece(7, 7, 2));
  this.player1Pieces[1].isKing = true;
  this.save(() => {
    cb();
  });
};

schema.methods.generateTestJumpPieces = function (cb) {
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player2Pieces.push(new Piece(4, 4, 2));
  this.player2Pieces.push(new Piece(2, 4, 2));
  this.player1Pieces.push(new Piece(7, 7, 1));
  this.save(() => {
    cb();
  });
};

schema.methods.generateTestJumpKingPieces = function (cb) {
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player1Pieces.push(new Piece(2, 5, 1));
  this.player2Pieces.push(new Piece(4, 2, 2));
  this.player2Pieces.push(new Piece(2, 2, 2));
  this.player2Pieces.push(new Piece(1, 6, 2));
  this.player1Pieces.forEach(piece => {
    piece.isKing = true;
  });
  this.player2Pieces.forEach(piece => {
    piece.isKing = true;
  });
  this.save(() => {
    cb();
  });
};

schema.methods.generateTestBadJumpPieces = function (cb) {
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player1Pieces[0].isKing = true;
  this.player2Pieces.push(new Piece(2, 2, 2));
  this.player2Pieces.push(new Piece(1, 1, 2));
  this.save(() => {
    cb();
  });
};

schema.methods.generateTestWinningGamePieces = function (cb) {
  this.player1Pieces.push(new Piece(3, 3, 1));
  this.player1Pieces[0].isKing = true;
  this.player2Pieces.push(new Piece(2, 2, 2));
  this.save(() => {
    cb();
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

const isValidJump = function (piece, targetX, targetY, game) {
  if (targetX === piece.x + 2) {
    if (piece.isKing && (targetY === piece.y + 2)) {
      if (piece.player === 1) {
        return getPlayer2JumpedPiece(targetX - 1, targetY - 1, game);
      } else {
        return getPlayer1JumpedPiece(targetX - 1, targetY - 1, game);
      }
    } else if (piece.isKing && (targetY === piece.y - 2)) {
      if (piece.player === 1) {
        return getPlayer2JumpedPiece(targetX - 1, targetY + 1, game);
      } else {
        return getPlayer1JumpedPiece(targetX - 1, targetY + 1, game);
      }
    } else if (piece.player === 1) {
      if (targetY === piece.y + 2) {
        return getPlayer2JumpedPiece(targetX - 1, targetY - 1, game);
      }
    } else {
      if (targetY === piece.y - 2) {
        return getPlayer1JumpedPiece(targetX - 1, targetY + 1, game);
      }
    }
  } else if (targetX === piece.x - 2) {
    if (piece.isKing && (targetY === piece.y + 2)) {
      if (piece.player === 1) {
        return getPlayer2JumpedPiece(targetX + 1, targetY - 1, game);
      } else {
        return getPlayer1JumpedPiece(targetX + 1, targetY - 1, game);
      }
    } else if (piece.isKing && (targetY === piece.y - 2)) {
      if (piece.player === 1) {
        return getPlayer2JumpedPiece(targetX + 1, targetY + 1, game);
      } else {
        return getPlayer1JumpedPiece(targetX + 1, targetY + 1, game);
      }
    } else if (piece.player === 1) {
      if (targetY === piece.y + 2) {
        return getPlayer2JumpedPiece(targetX + 1, targetY - 1, game);
      }
    } else {
      if (targetY === piece.y - 2) {
        return getPlayer1JumpedPiece(targetX + 1, targetY + 1, game);
      }
    }
  }

  return null;
};

const getPlayer2JumpedPiece = function (targetX, targetY, game) {
  const jumpedPieceIndex = isOpposingPieceHere(targetX, targetY, game);
  if (jumpedPieceIndex === -1) {
    return null;
  }
  return (game.player2Pieces.splice(jumpedPieceIndex, 1))[0];
};

const getPlayer1JumpedPiece = function (targetX, targetY, game) {
  const jumpedPieceIndex = isOpposingPieceHere(targetX, targetY, game);
  if (jumpedPieceIndex === -1) {
    return null;
  }
  return (game.player1Pieces.splice(jumpedPieceIndex, 1))[0];
};

const isOpposingPieceHere = function (targetX, targetY, game) {
  let pieceIndex = -1;
  if (game.turn === 1) {
    pieceIndex = game.player2Pieces.indexOf(game.player2Pieces.find(piece => piece.x === targetX && piece.y === targetY));
  } else {
    pieceIndex = game.player1Pieces.indexOf(game.player1Pieces.find(piece => piece.x === targetX && piece.y === targetY));
  }
  return pieceIndex;
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
