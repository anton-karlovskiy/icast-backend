
const userResolver = {
  Query: {
    currentUser: async (_, __, { dataSources }) => {
      const user = await dataSources.userAPI.readCurrentUser();
      return user;
    },
    users: async (_, { roles, offset, limit }, { dataSources }) => {
      const users = await dataSources.userAPI.readUsers({ roles, offset, limit });
      return users;
    },
    user: async (_, { _id }, { dataSources }) => {
      const user = await dataSources.userAPI.readUser({ _id });
      return user;
    },
    isLoggedIn: async (_, __, { dataSources }) => {
      return dataSources.userAPI.isLoggedIn();
    }
  },
  Mutation: {
    register: async (_, { username, email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.register({ username, email, password });
      return user;
    },
    login: async (_, { email, password }, { dataSources }) => {
      return await dataSources.userAPI.login({ email, password });
    },
    requestPhoneVerification: async (_, { phoneVerificationInfoInput }, { dataSources }) => {
      return await dataSources.userAPI.requestPhoneVerification({ phoneVerificationInfoInput });
    },
    verifyPhoneToken: async (_, { phoneVerificationInfoInput, userId, token }, { dataSources }) => {
      return await dataSources.userAPI.verifyPhoneToken({ phoneVerificationInfoInput, userId, token });
    },
    forgotPassword: async (_, { userId, newPassword }, { dataSources }) => {
      return await dataSources.userAPI.forgotPassword({ userId, newPassword });
    },
    updateUserProfile: async (_, { userId, user }, { dataSources }) => {
      return await dataSources.userAPI.updateUserProfile({ userId, user });
    },
    loginAsAdmin: async (_, { email, password }, { dataSources }) => {
      return await dataSources.userAPI.loginAsAdmin({ email, password });
    },
    logout: async (_, __, { dataSources }) => {
      return await dataSources.userAPI.logout();
    },
    createUser: async (_, { user }, { dataSources }) => {
      const newUser = await dataSources.userAPI.createUser({ user });
      return newUser;
    },
    updateUser: async (_, { user }, { dataSources }) => {
      const newUser = await dataSources.userAPI.updateUser({ user });
      return newUser;
    },
    deleteUser: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.deleteUser({ email });
      return user;
    }
  }
};

export default userResolver;
