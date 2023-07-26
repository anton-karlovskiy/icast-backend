
import mongoose from 'mongoose';

const intervalSchema = new mongoose.Schema({
  // TODO: could be better like seconds
  value: Number
});

const intervalModel = mongoose.model('interval', intervalSchema);

export default intervalModel;
