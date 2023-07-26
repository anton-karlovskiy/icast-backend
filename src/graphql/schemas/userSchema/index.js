
import { gql } from 'apollo-server';

export default gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    firstName: String,
    lastName: String,
    roles: [UserRoleEnums!]!
    balance: Float!
    countryCode: Int
    phoneNumber: String
    phoneVerified: Boolean!
    enabled: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type UsersResponse {
    pageInfo: PageInfo!
    users: [User!]!
  }

  input UserInput {
    _id: ID
    username: String!
    email: String!
    firstName: String
    lastName: String
    password: String
    roles: [String!]!
    balance: Float
    countryCode: Int
    phoneNumber: String
    enabled: Boolean!
  }

  input PhoneVerificationInfoInput {
    countryCode: Int!
    phoneNumber: String!
    verificationStatus: VerificationStatusEnums!
  }

  input UserProfileInput {
    email: String!
    username: String!
    countryCode: Int!
    phoneNumber: String!
  }

  enum VerificationStatusEnums {
    SIGNIN
    SIGNUP
    FORGOT_PASSWORD
    CHANGE_PHONE_NUMBER
  }

  enum UserRoleEnums {
    SUPER_ADMIN
    ADMIN
    PAID_USER
    FREE_USER
  }

  type LoginResponse {
    token: String
    user: User,
    isSuccess: Boolean!
    phoneVerificationRequired: Boolean
    error: String
  }

  type RequestPhoneVerificationResponse {
    userId: ID
    isSuccess: Boolean
    error: String
  }

  extend type Query {
    currentUser: User!
    isLoggedIn: Boolean!
    users(roles: [UserRoleEnums!]!, offset: Int!, limit: Int!): UsersResponse!
    user(_id: ID!): User!
  }

  extend type Mutation {
    register(username: String!, email: String!, password: String!): User!
    requestPhoneVerification(phoneVerificationInfoInput: PhoneVerificationInfoInput!): RequestPhoneVerificationResponse!
    verifyPhoneToken(phoneVerificationInfoInput: PhoneVerificationInfoInput!, userId: ID!, token: String!): LoginResponse!
    login(email: String!, password: String!): LoginResponse!
    loginAsAdmin(email: String!, password: String!): User
    forgotPassword(userId: ID!, newPassword: String!): Boolean!
    updateUserProfile(userId: ID!, user: UserProfileInput!): LoginResponse!
    logout: Boolean!
    createUser(user: UserInput!): User!
    updateUser(user: UserInput!): User!
    deleteUser(email: String!): User!
  }
`;
