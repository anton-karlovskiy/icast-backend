
import userResolver from './userResolver';
import castingResolver from './castingResolver';
import fixtureResolver from './fixtureResolver';
import intervalResolver from './intervalResolver';
import leagueResolver from './leagueResolver';
import poolGroupResolver from './poolGroupResolver';
import poolResolver from './poolResolver';
import poolTypeResolver from './poolTypeResolver';
import teamResolver from './teamResolver';
import castResolver from './castResolver';
import aboutResolver from './aboutResolver';

const resolvers = [
  userResolver,
  castingResolver,
  fixtureResolver,
  intervalResolver,
  leagueResolver,
  poolGroupResolver,
  poolResolver,
  poolTypeResolver,
  teamResolver,
  castResolver,
  aboutResolver
];

export default resolvers;
