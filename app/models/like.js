import mongoose, { Schema } from 'mongoose'

const LikeSchema = new Schema({
  uuid: {
    type: String,
    required: [true, 'uuid is required']
  },
  created: { type: Date, default: Date.now }
});

const Like = mongoose.model('Like', LikeSchema);

export default Like;