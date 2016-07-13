/* eslint-disable no-use-before-define, func-names */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
});


module.exports = mongoose.model('User', schema);
