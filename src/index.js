
require('dotenv').config();
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';

import CastingAPI from '~/graphql/datasources/castingAPI';
import FixtureAPI from '~/graphql/datasources/fixtureAPI';
import IntervalAPI from '~/graphql/datasources/intervalAPI';
import LeagueAPI from '~/graphql/datasources/leagueAPI';
import PoolAPI from '~/graphql/datasources/poolAPI';
import PoolGroupAPI from '~/graphql/datasources/poolGroupAPI';
import PoolTypeAPI from '~/graphql/datasources/poolTypeAPI';
import TeamAPI from '~/graphql/datasources/teamAPI';
import CastAPI from '~/graphql/datasources/castAPI';
import UserAPI from '~/graphql/datasources/userAPI';
import typeDefs from '~/graphql/schemas';
import resolvers from '~/graphql/resolvers';
import models from '~/database/models';
import startCronJobs from '~/engine/crons';
import { getMongoURI } from '~/configs/mongodb';

// TODO: <
/**
 * TODO:
 * Should double-check if we need both cookie and local storage and drop if we no longer need either.
 */
// TODO: >

const app = express();

// TODO: whitelist hardcoded: should be moved to config
const whitelist = [
  'http://192.168.0.154:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4000',
  'https://frontend-icastdev.vercel.app',
  'https://admin-frontend-icastdev.vercel.app',
  undefined, // MEMO: set undefined for playground
  'https://icast-backend.herokuapp.com',
  'https://i-cast.live',
  'https://admin.i-cast.live',
  'https://www.i-cast.live',
  'https://www.admin.i-cast.live'
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      return callback(null, origin);
    }
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptions));
app.use(cookieParser());

const getUser = async req => {
  try {
    const tokenWithBearer = req.headers.authorization;

    let token;
    if (tokenWithBearer) {
      token = tokenWithBearer.split(' ')[1];
    } else {
      // TODO: hardcoded
      token = req.cookies[`token-${req.get('origin')}`];
    }

    if (!token) return null;

    const me = await jwt.verify(token, process.env.JWT_SECRET);

    return me;
  } catch (error) {
    console.log('[getUser] error => ', error);

    return null;
  }
};

const context = async ({ req, res }) => {
  if (!req) return null;

  const me = await getUser(req);

  return {
    me,
    client: { req, res },
    models
  };
};

const dataSources = () => ({
  castingAPI: new CastingAPI(),
  fixtureAPI: new FixtureAPI(),
  intervalAPI: new IntervalAPI(),
  leagueAPI: new LeagueAPI(),
  poolAPI: new PoolAPI(),
  poolGroupAPI: new PoolGroupAPI(),
  poolTypeAPI: new PoolTypeAPI(),
  teamAPI: new TeamAPI(),
  castAPI: new CastAPI(),
  userAPI: new UserAPI()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
  // debug: false, // TODO: enable this on production. RE: https://www.apollographql.com/docs/apollo-server/data/errors/
  // TODO: enable playground and introspection on production
  introspection: true,
  playground: true
});

server.applyMiddleware({
  app,
  path: '/graphql', // TODO: path hardcoded
  cors: false
});

// TODO: checking environment variables so remove on production
app.get('/ping', (_, res) => {
  res.send(`pong port: ${process.env.PORT}`);
});

app.listen(process.env.PORT || 4000, () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose
    .connect(getMongoURI(), {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => {
      console.log('process.env.NODE_ENV => ', process.env.NODE_ENV);
      console.log('process.env.COOKIE_ENV => ', process.env.COOKIE_ENV);
      console.log('DB Connected!');
      console.log(`Ready on http://localhost:${process.env.PORT}`); // TODO: hardcoded
      startCronJobs();
    })
    .catch(error => {
      console.log('DB Connection error.message => ', error.message);
    });
});
