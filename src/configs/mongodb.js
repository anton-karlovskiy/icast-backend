
import { NODE_ENV_TYPES } from '~/configs';

const getMongoURI = () => {
  const mongoURI =
    process.env.NODE_ENV === NODE_ENV_TYPES.PRODUCTION ?
      process.env.PROD_MONGO_URI :
      process.env.DEV_MONGO_URI;

  if (!mongoURI) {
    throw new Error(
      `MongoDB URI not found. Please set ${
        process.env.NODE_ENV === NODE_ENV_TYPES.PRODUCTION ? 'PROD_MONGO_URI' : 'DEV_MONGO_URI'
      } environment variable.`
    );
  }

  return mongoURI;
};

export {
  getMongoURI
};
