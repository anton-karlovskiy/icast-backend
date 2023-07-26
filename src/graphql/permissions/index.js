
import { AuthenticationError, UserInputError } from 'apollo-server';
import bcrypt from 'bcrypt';

import { USER_ROLES } from '~/utils/constants';
import { getObjectId } from '~/utils/helpers/database';

const credentialMismatchMessage = 'Invalid credentials.';

// TODO: <
/**
 * TODO:
 * Should wrap async/await logic with try/catch.
 * Should remove `assertSession` if unnecessary.
 */
// TODO: >

// TODO: unused for now
const assertSession = () => {
  throw new AuthenticationError('Your session expired. Sign in again.');
};

const assertAuthenticated = context => {
  if (!context.me) {
    throw new AuthenticationError('You are not authenticated.');
  }
};

const assertAdmin = async ({ email, context }) => {
  const user = await context.models.userModel.findOne({ email }).exec();
  // TODO: could be a switch statement
  if (!user.roles.includes(USER_ROLES.SUPER_ADMIN) && !user.roles.includes(USER_ROLES.ADMIN)) {
    throw new AuthenticationError('You do not have admin permission.');
  }
};

const assertValidUser = async (userId, context) => {
  const user = await context.models.userModel.findOne({ _id: getObjectId(userId) });
  if (!user) {
    throw new AuthenticationError(credentialMismatchMessage);
  }
};

const assertValidCredentials = async ({ email, password }, context) => {
  const user = await context.models.userModel.findOne({ email, enabled: true }).exec();
  if (!user) {
    throw new AuthenticationError(credentialMismatchMessage);
  }

  const passwordMatched = bcrypt.compareSync(password, user.password);
  if (!passwordMatched) {
    throw new AuthenticationError(credentialMismatchMessage);
  }
};

// TODO: vulnerable
const assertValidEmail = async email => {
  if (!email) {
    throw new UserInputError('Email is invalid!');
  }
};

const assertDuplicatedPhoneNumber = async ({ countryCode, phoneNumber }, context) => {
  const existingUser = await context.models.userModel.findOne({ countryCode, phoneNumber }).exec();
  if (existingUser) {
    throw new UserInputError('This phone number has been already registered!');
  }
};

const assertNotRegisteredPhoneNumber = async ({ countryCode, phoneNumber }, context) => {
  const existingUser = await context.models.userModel.findOne({ countryCode, phoneNumber }).exec();
  if (!existingUser) {
    throw new UserInputError('This phone number has not been registered!');
  }
};

const assertDuplicatedEmail = async (email, context, userId) => {
  let existingUsers;
  if (userId) {
    existingUsers = await context.models.userModel.find({
      email,
      _id: { $ne: userId }
    });
  } else {
    existingUsers = await context.models.userModel.find({ email });
  }

  if (existingUsers?.length > 0) {
    throw new UserInputError('This email has been already registered!');
  }
};

const assertDuplicatedUsername = async (username, context, userId) => {
  let existingUsers;
  if (userId) {
    existingUsers = await context.models.userModel.find({
      username,
      _id: { $ne: userId }
    });
  } else {
    existingUsers = await context.models.userModel.find({ username });
  }

  if (existingUsers?.length > 0) {
    throw new UserInputError('This username has been already registered!');
  }
};

export {
  assertSession,
  assertDuplicatedEmail,
  assertDuplicatedUsername,
  assertValidEmail,
  assertAuthenticated,
  assertValidCredentials,
  assertAdmin,
  assertDuplicatedPhoneNumber,
  assertNotRegisteredPhoneNumber,
  assertValidUser
};
