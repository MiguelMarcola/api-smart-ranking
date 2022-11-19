import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
