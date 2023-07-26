
import { gql } from 'apollo-server';

const distributingSchema = gql`
  type Distributing {
    type: DistributingTypeEnums!,
    # TODO: double check the non-nullable flow
    percentiles: [Percentile!]!,
    prizes: [Prize]!,
    potSize: Float
  }

  type Percentile {
    ranking: Int!,
    threshold: Float!,
    slab: Float!
  }

  type Prize {
    ranking: Int!,
    amount: Float!
  }

  enum DistributingTypeEnums {
    PERCENTILE,
    PRIZE
  }
  
  input DistributingInput {
    type: DistributingTypeEnums!,
    percentiles: [PercentileInput],
    prizes: [PrizeInput],
    potSize: Float
  }

  input PercentileInput {
    ranking: Int!,
    threshold: Float!,
    slab: Float!
  }

  input PrizeInput {
    ranking: Int!,
    amount: Float!
  }
`;

export default distributingSchema;
