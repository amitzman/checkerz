/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import User from '../models/user';
import bodyValidator from '../validators/users/body';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  User.create(res.locals, (err, user) => {
    res.send({ user });
  });
});

router.get('/', (req, res) => {
  User.find((err, users) => {
    res.send({ users });
  });
});
