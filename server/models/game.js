/* eslint-disable no-use-before-define, func-names */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  turn: { type: Number, default: 0 },
  player1: { type: mongoose.Schema.ObjectId, ref: 'User' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'User' },
  player1Pieces: [Schema.Types.Mixed],
  player2Pieces: [Schema.Types.Mixed],
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.generatePieces = function (cb) {
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(((i + j) % 2) == 1){
        // player1Pieces.push(new Piece(i, j, 1));
        // player2Pieces.push(new Piece (7-i, 7-j, 2));
        console.log('tst');
      }
    }
  }
};

module.exports = mongoose.model('Game', schema);
