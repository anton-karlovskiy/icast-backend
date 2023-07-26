
const intervalResolver = {
  Query: {
    intervals: (_, __, { dataSources }) => {
      return dataSources.intervalAPI.readIntervals();
    }
  }
};

export default intervalResolver;
