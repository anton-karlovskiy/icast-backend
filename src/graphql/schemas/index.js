
import { gql } from 'apollo-server';

import userSchema from './userSchema';
import castingSchema from './castingSchema';
import castSchema from './castSchema';
import distributingSchema from './distributingSchema';
import fixtureSchema from './fixtureSchema';
import intervalSchema from './intervalSchema';
import leagueSchema from './leagueSchema';
import poolGroupSchema from './poolGroupSchema';
import poolSchema from './poolSchema';
import poolTypeSchema from './poolTypeSchema';
import sportsTypeSchema from './sportsTypeSchema';
import teamSchema from './teamSchema';
import pageInfoSchema from './pageInfoSchema';
import aboutSchema from './aboutSchema';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

const typeDefs = [
  linkSchema,
  pageInfoSchema,
  userSchema,
  distributingSchema,
  ...castingSchema,
  ...castSchema,
  ...fixtureSchema,
  ...intervalSchema,
  ...leagueSchema,
  ...poolGroupSchema,
  ...poolSchema,
  ...poolTypeSchema,
  ...sportsTypeSchema,
  ...teamSchema,
  ...aboutSchema
];

export default typeDefs;
