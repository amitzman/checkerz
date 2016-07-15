/* eslint-disable newline-per-chained-call, no-use-before-define, new-cap, prefer-arrow-callback, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len, func-names */

import express from 'express';
import Game from '../models/game';
import bodyValidator from '../validators/games/body';
import moveBodyValidator from '../validators/games/moveBody';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  Game.create(res.locals, (err, game) => {
    game.generatePieces(() => {
      res.send({ game });
    });
  });
});

router.put('/:id/move', moveBodyValidator, (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    game.movePiece(res.locals.piece, res.locals.targetX, res.locals.targetY, (results) => {
      if (results.error) {
        res.status(400).send({ messages: results.error });
      } else {
        res.send({ game: results });
      }
    });
  });
});
