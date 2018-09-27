/**
 * oauth 2.0 strategy
 * 
 * ref. 
 * https://blog.hyphe.me/token-based-authentication-with-node/
 * https://blog.hyphe.me/using-refresh-tokens-for-permanent-user-sessions-in-node/
 */

import mongoose, { Shcema } from 'mongoose'
import crypto from 'crypto'

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String },
  created: { type : Date, default : Date.now }
});

const Token = mongoose.model('Token', TokenSchema);

export default Token;