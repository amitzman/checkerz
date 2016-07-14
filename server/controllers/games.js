/* eslint-disable newline-per-chained-call, no-use-before-define, new-cap, prefer-arrow-callback, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len, func-names */

import express from 'express';
import Game from '../models/game';
import bodyValidator from '../validators/games/body';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  Game.create(res.locals, (err, game) => {
    game.generatePieces(() => {
      res.send({ game });
    });
  });
});

router.put('/:id/move', (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    if (req.body.piece.player === 1) {
      game.player1Pieces = updatePiece(game.player1Pieces, req.body.piece, req.body.targetX, req.body.targetY);
      game.turn = 2;
    } else {
      game.player2Pieces = updatePiece(game.player2Pieces, req.body.piece, req.body.targetX, req.body.targetY);
      game.turn = 1;
    }
    game.save(() => {
      res.send({ game });
    });
  });
});

const updatePiece = function (piecesArray, pieceToBeMoved, targetX, targetY) {
  return piecesArray.map(function (piece) {
    if (piece.x === pieceToBeMoved.x && piece.y === pieceToBeMoved.y) {
      piece.x = targetX;
      piece.y = targetY;
    }
    return piece;
  });
};
