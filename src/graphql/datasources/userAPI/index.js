/* eslint-disable require-jsdoc */
import { DataSource } from 'apollo-datasource';
import { isValidObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { HASH_SYNC_SALT } from '~/utils/constants/security';
import {
  assertValidUser,
  assertNotRegisteredPhoneNumber,
  assertDuplicatedPhoneNumber,
  assertAdmin,
  assertDuplicatedEmail,
  assertValidEmail,
  assertAuthenticated,
  assertValidCredentials,
  assertDuplicatedUsername
} from '~/graphql/permissions';
import { getPageInfo } from '~/utils/helpers';
import { getObjectId } from '~/utils/helpers/database';
import {
  USER_ROLES,
  COOKIE_ENVS,
  PHONE_VERIFICATION_TYPE,
  PHONE_VERIFICATION_STATUS
} from '~/utils/constants';

// TODO: <
/**
 * TODO:
 * updateUser, updateUserProfile, and updateUserBalance could be combined into one.
 * register and createUser could be combined into one.
 * Should double-check if we need both cookie and local storage and drop if we no longer need either.
 */
// TODO: >

const phoneReg = require('~/lib/phone_verification')(process.env.TWILIO_ACCOUNT_SECURITY_API_KEY);

const cookieOptions = process.env.COOKIE_ENV === COOKIE_ENVS.PRODUCTION ? {
  httpOnly: true,
  expires: 0,
  secure: true,
  sameSite: 'none'
} : {
  httpOnly: true,
  expires: 0
};

class UserAPI extends DataSource {
  constructor() {
    super();
  }

  initialize = config => {
    this.context = config.context;
  };

  readCurrentUser = async () => {
    assertAuthenticated(this.context);

    try {
      const me = this.context.me;
      const user = await this.context.models.userModel.findById({ _id: me._id }).exec();
      return user;
    } catch (error) {
      console.log('[graphql userAPI readCurrentUser] error => ', error);
    }
  };

  register = async ({ username, email, password }) => {
    assertValidEmail(email);
    await assertDuplicatedEmail(email, this.context);
    await assertDuplicatedUsername(username, this.context);

    try {
      const registeredUser = await this.context.models.userModel.findOne({ email, phoneVerified: false }).exec();
      if (registeredUser) {
        return registeredUser;
      }

      const newUser = {
        username,
        email,
        password,
        roles: [USER_ROLES.FREE_USER],
        enabled: true,
        phoneVerified: false
      };
      const user = await this.context.models.userModel.create(newUser);

      return user;
    } catch (error) {
      console.log('[graphql userAPI register] error => ', error);
    }
  };

  // eslint-disable-next-line no-async-promise-executor
  requestPhoneVerification = ({ phoneVerificationInfoInput }) => new Promise(async (resolve, reject) => {
    try {
      const context = this.context;
      switch (phoneVerificationInfoInput.verificationStatus) {
      case PHONE_VERIFICATION_STATUS.SIGNIN:
      case PHONE_VERIFICATION_STATUS.SIGNUP:
      case PHONE_VERIFICATION_STATUS.CHANGE_PHONE_NUMBER:
        await assertDuplicatedPhoneNumber({
          countryCode: phoneVerificationInfoInput.countryCode,
          phoneNumber: phoneVerificationInfoInput.phoneNumber
        }, this.context);
        phoneReg.requestPhoneVerification(
          phoneVerificationInfoInput.phoneNumber,
          phoneVerificationInfoInput.countryCode,
          PHONE_VERIFICATION_TYPE.SMS,
          function (error, response) {
            if (error) {
              console.log('[requestPhoneVerification] error => ', error);
              return resolve({ isSuccess: false, error: error.message });
            }
            console.log('[requestPhoneVerification] Successful register phone API call response => ', response);
            return resolve({ isSuccess: true });
          });
        break;
      case PHONE_VERIFICATION_STATUS.FORGOT_PASSWORD:
        await assertNotRegisteredPhoneNumber({
          countryCode: phoneVerificationInfoInput.countryCode,
          phoneNumber: phoneVerificationInfoInput.phoneNumber
        }, this.context);
        phoneReg.requestPhoneVerification(
          phoneVerificationInfoInput.phoneNumber,
          phoneVerificationInfoInput.countryCode,
          PHONE_VERIFICATION_TYPE.SMS,
          async function (error, response) {
            if (error) {
              console.log('[requestPhoneVerification] error => ', error);
              return resolve({ isSuccess: false, error: error.toString() });
            }
            console.log('[requestPhoneVerification] Successful register phone API call response => ', response);
            const user = await context.models.userModel.findOne({
              countryCode: phoneVerificationInfoInput.countryCode,
              phoneNumber: phoneVerificationInfoInput.phoneNumber
            });
            return resolve({ isSuccess: true, userId: user._id });
          });
        break;
      default:
        break;
      }
    } catch (error) {
      console.log('[requestPhoneVerification] error => ', error);
      return resolve({ isSuccess: false, error: error.toString() });
    }
  });

  verifyPhoneToken = ({ phoneVerificationInfoInput, userId, token }) => new Promise((resolve, reject) => {
    try {
      const context = this.context;
      phoneReg.verifyPhoneToken(
        phoneVerificationInfoInput.phoneNumber,
        phoneVerificationInfoInput.countryCode,
        token,
        async function (error, response) {
          if (error) {
            console.log('[grahpql userAPI verifyPhoneToken] error => ', error);
            return resolve({ isSuccess: false, error: 'Verification code is incorrect!' });
          }
          if (response.success) {
            console.log('[grahpql userAPI verifyPhoneToken] Confirm phone success response => ', response);

            const user = await context.models.userModel.findOneAndUpdate({ _id: getObjectId(userId) }, {
              phoneVerified: true,
              countryCode: phoneVerificationInfoInput.countryCode,
              phoneNumber: phoneVerificationInfoInput.phoneNumber
            }, { new: true });

            if (phoneVerificationInfoInput.verificationStatus === PHONE_VERIFICATION_STATUS.SIGNIN) {
              const token = jwt.sign(
                {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  roles: user.roles
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: '30d' // token will expire in 30days
                }
              );
              context.client.res.cookie(`token-${context.client.req.get('origin')}`, token, cookieOptions);

              return resolve({ user, token, isSuccess: true });
            }
            return resolve({ user, isSuccess: true });
          }
        }
      );
    } catch (error) {
      console.log('[grahpql userAPI verifyPhoneToken catch] error => ', error);
      return resolve({ isSuccess: false, error: error.toString() });
    }
  });

  forgotPassword = async ({ userId, newPassword }) => {
    try {
      const hashedPassword = bcrypt.hashSync(newPassword, HASH_SYNC_SALT);
      await this.context.models.userModel.findOneAndUpdate({ _id: getObjectId(userId) }, { password: hashedPassword });
      return true;
    } catch (error) {
      console.log('[graphql userAPI forgotPassword] error => ', error);
      return false;
    }
  };

  isLoggedIn = async () => {
    return this.context.me ? true : false;
  };

  login = async ({
    email,
    password
  }) => {
    await assertValidCredentials({ email, password }, this.context);

    try {
      const user = await this.context.models.userModel.findOne({ email }).exec();

      if (!user.phoneVerified) {
        // TODO: should use apollo-server error handling e.g. https://www.apollographql.com/docs/apollo-server/data/errors/
        return {
          user,
          isSuccess: false,
          phoneVerificationRequired: true,
          error: 'You are not phone-verified!'
        };
      }

      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        },
        process.env.JWT_SECRET,
        {
          // TODO: hardcoded
          expiresIn: '30d' // token will expire in 30days
        }
      );

      this.context.client.res.cookie(`token-${this.context.client.req.get('origin')}`, token, cookieOptions);

      return {
        user,
        token,
        isSuccess: true
      };
    } catch (error) {
      console.log('[graphql userAPI login] error => ', error);

      // TODO: should use apollo-server error handling e.g. https://www.apollographql.com/docs/apollo-server/data/errors/
      return {
        isSuccess: false,
        error: error.message
      };
    }
  };

  loginAsAdmin = async ({ email, password }) => {
    await assertValidCredentials({ email, password }, this.context);
    await assertAdmin({ email, context: this.context });

    try {
      const user = await this.context.models.userModel.findOne({ email }).exec();

      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '30d' // token will expire in 30days
        }
      );

      this.context.client.res.cookie(`token-${this.context.client.req.get('origin')}`, token, cookieOptions);

      return user;
    } catch (error) {
      console.log('[graphql userAPI loginAsAdmin] error => ', error);
    }
  };

  logout = async () => {
    assertAuthenticated(this.context);

    this.context.client.res.clearCookie(`token-${this.context.client.req.get('origin')}`, cookieOptions);

    return true;
  };

  readUsers = async ({ roles, offset, limit }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const total = await this.context.models.userModel.countDocuments({ roles: { $in: roles } });
      const users = await this.context.models.userModel.find({ roles: { $in: roles } }).skip(offset).limit(limit);
      const pageInfo = getPageInfo({ total, offset, limit });
      return {
        pageInfo,
        users
      };
    } catch (error) {
      console.log('[graphql userAPI readUsers] error => ', error);
    }
  };

  readUser = async ({ _id }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      if (!isValidObjectId(_id)) {
        return {};
      }
      const user = await this.context.models.userModel.findOne({ _id });
      return user || {};
    } catch (error) {
      console.log('[graphql userAPI readUser] error => ', error);
    }
  };

  createUser = async ({ user }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });
    await assertDuplicatedEmail(user.email, this.context);
    await assertDuplicatedUsername(user.username, this.context);

    // MEMO: balance should not be null and it's set as zero at database by default
    if (!user.balance) {
      delete user.balance;
    }

    try {
      const newUser = await this.context.models.userModel.create({ ...user, phoneVerified: true });
      return newUser;
    } catch (error) {
      console.log('[graphql userAPI createUser] error => ', error);
    }
  };

  updateUser = async ({ user }) => {
    assertAuthenticated(this.context);
    assertValidEmail(user.email);
    await assertAdmin({ email: this.context.me.email, context: this.context });
    await assertDuplicatedEmail(user.email, this.context, user._id);
    await assertDuplicatedUsername(user.username, this.context, user._id);

    try {
      if (user.password) {
        user = {
          ...user,
          password: bcrypt.hashSync(user.password, HASH_SYNC_SALT)
        };
      } else {
        delete user.password;
      }

      // MEMO: balance should not be null and it's set as zero at database by default
      if (!user.balance) {
        delete user.balance;
      }

      // MEMO: user._id might be stale in data type for some reason so get rid of it for safety
      delete user._id;

      const newUser = await this.context.models.userModel.findOneAndUpdate({ email: user.email }, user, { new: true });
      return newUser;
    } catch (error) {
      console.log('[graphql userAPI updateUser] error => ', error);
    }
  };

  updateUserProfile = async ({ userId, user }) => {
    assertAuthenticated(this.context);
    await assertValidUser(userId, this.context);
    await assertDuplicatedEmail(user.email, this.context, userId);
    await assertDuplicatedUsername(user.username, this.context, userId);

    try {
      const newUser = await this.context.models.userModel.findOneAndUpdate({
        _id: getObjectId(userId)
      }, {
        email: user.email,
        username: user.username,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber
      }, { new: true });
      const token = jwt.sign({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles
      }, process.env.JWT_SECRET, {
        expiresIn: '30d' // token will expire in 30days
      }
      );

      return {
        user: newUser,
        token,
        isSuccess: true
      };
    } catch (error) {
      console.log('[graphql userAPI updateProfile] error => ', error);
      return { isSuccess: false, error };
    }
  };

  updateUserBalance = async ({ userId, balance }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });

    try {
      const user = await this.context.models.userModel.findOne({ _id: userId });
      const newBalance = user.balance + balance;
      await this.context.models.userModel.findOneAndUpdate({ _id: userId }, { balance: newBalance });
    } catch (error) {
      console.log('[graphql userAPI updateUserBalance] error => ', error);
    }
  };

  deleteUser = async ({ email }) => {
    assertAuthenticated(this.context);
    await assertAdmin({ email: this.context.me.email, context: this.context });
    assertValidEmail(email);

    try {
      const user = await this.context.models.userModel.findOneAndDelete({ email });
      return user;
    } catch (error) {
      console.log('[graphql userAPI deleteUser] error => ', error);
    }
  };
}

export default UserAPI;
