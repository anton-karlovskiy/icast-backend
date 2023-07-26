
import { NODE_ENV_TYPES } from '~/configs';

const PROD_MONGO_URI =
  'mongodb+srv://anton-karlovskiy:ninjaassasin2018@icast-cluster-nzuom.mongodb.net/icast';
const DEV_MONGO_URI =
  'mongodb+srv://anton-karlovskiy:khrYSTLDimgAWven@icast-dev.tekon.mongodb.net/icast-dev?retryWrites=true&w=majority';

const getMongoURI = () => {
  const mongoURI =
    process.env.NODE_ENV === NODE_ENV_TYPES.PRODUCTION ?
      PROD_MONGO_URI :
      DEV_MONGO_URI;

  return mongoURI;
};

export {
  PROD_MONGO_URI,
  DEV_MONGO_URI,
  getMongoURI
};
