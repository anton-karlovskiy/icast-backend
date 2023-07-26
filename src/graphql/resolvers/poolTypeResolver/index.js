
const poolTypeResolver = {
  Query: {
    poolTypes: (_, __, { dataSources }) => {
      return dataSources.poolTypeAPI.readPoolTypes();
    }
  }
};

export default poolTypeResolver;
