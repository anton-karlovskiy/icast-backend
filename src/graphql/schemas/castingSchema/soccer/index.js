
import { gql } from 'apollo-server';

export default gql`
  type SoccerCasting implements Casting {
    _id: ID!,
    specification: SoccerCastingSpecification
  }

  type SoccerCastingSpecification {
    castingType: SoccerCastingTypeEnums
  }

  input SoccerCastingInput {
    _id: ID,
    specification: SoccerCastingSpecificationInput
  }

  input SoccerCastingSpecificationInput {
    castingType: SoccerCastingTypeEnums
  }

  enum SoccerCastingTypeEnums {
    EXACT_SCORE,
    DRAW,
    WINNER,
    OUTCOME
  }
`;
