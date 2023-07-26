/* eslint-disable require-jsdoc */
class SoccerAPIInterface {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async readLeagues() {}
  async readFixturesByLeague(sportsType, league) {}
  async getLiveFixturesByLeague(sportsType, league) {}
}

export default SoccerAPIInterface;
