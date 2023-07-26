
import mongoose from 'mongoose';

const getObjectId = (id = null) => {
  // eslint-disable-next-line new-cap
  const objectId = id ? mongoose.Types.ObjectId(id) : mongoose.Types.ObjectId();
  return objectId;
};

const timeStamp = schema => {
  schema.add({
    createdAt: Date,
    updatedAt: Date
  });

  schema.pre('save', function (next) {
    const now = Date.now();

    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }

    next();
  });
};

const isValidObjectId = _id => {
  return mongoose.Types.ObjectId.isValid(_id);
};

export {
  getObjectId,
  isValidObjectId,
  timeStamp
};
