import * as mongoose from 'mongoose';

export const TokensSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  ipAddress: {
    type: String,
  },
});
