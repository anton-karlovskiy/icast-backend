
import { gql } from 'apollo-server';

const sportsTypeSchema = gql`
  type SportsType {
    _id: String,
    name: SportsTypeEnums!
  }

  input SportsTypeInput {
    _id: String!,
    name: SportsTypeEnums!
  }

  enum SportsTypeEnums {
    SOCCER,
    HORSE_RACING,
    CRICKET
  }
`;

export default [sportsTypeSchema];
