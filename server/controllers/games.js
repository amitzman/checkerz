/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Game from '../models/game';
import bodyValidator from '../validators/games/body';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  Game.create(res.locals, (err, game) => {
    res.send({ game });
  });
});
