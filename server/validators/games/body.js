/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  player1: joi.string().required().regex(/^[0-9a-f]{24}$/),
  player2: joi.string().required().regex(/^[0-9a-f]{24}$/),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
