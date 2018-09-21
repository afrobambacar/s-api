import mongoose, { Schema } from 'mongoose';

const KittySchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  }
});

const Kitty = mongoose.model('Kitty', KittySchema);

export default Kitty;