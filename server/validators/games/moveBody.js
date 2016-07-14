/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  piece: joi.object(),
  targetX: joi.number().min(0).max(7),
  targetY: joi.number().min(0).max(7),
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
