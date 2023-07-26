
import { gql } from 'apollo-server';

import soccerCastingSchema from './soccer';

const castingSchema = gql`
  # TODO: as we have not fully defined them.
  interface Casting {
    _id: ID!
  }

  extend type Query {
    castings: [Casting!]!
  }
`;

export default [
  castingSchema,
  soccerCastingSchema
];
