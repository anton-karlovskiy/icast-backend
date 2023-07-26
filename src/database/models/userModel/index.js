
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { USER_ROLES } from '~/utils/constants';
import { timeStamp } from '~/utils/helpers/database';
import { HASH_SYNC_SALT } from '~/utils/constants/security';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    required: true,
    enum: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.PAID_USER, USER_ROLES.FREE_USER],
    default: [USER_ROLES.FREE_USER]
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  phoneVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  countryCode: {
    type: Number
  },
  phoneNumber: {
    type: Number
  }
});

userSchema.plugin(timeStamp);

userSchema.pre('save', function () {
  const hashedPassword = bcrypt.hashSync(this.password, HASH_SYNC_SALT);
  this.password = hashedPassword;
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
