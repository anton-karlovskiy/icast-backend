
let syncingLeagues = [];

const syncLeague = ({ leagueId }) => {
  const date = new Date();
  syncingLeagues.push({ leagueId, date });
};

const unsyncLeague = ({ leagueId }) => {
  syncingLeagues = syncingLeagues.filter(syncingLeague => syncingLeague.leagueId === leagueId);
};

const getLeagueSyncState = ({ leagueId }) => {
  const existingLeague = syncingLeagues.find(syncingLeague => {
    return String(syncingLeague.leagueId) === String(leagueId);
  });
  return !!existingLeague;
};

const getSyncingLeague = ({ leagueId }) => {
  const existingLeague = syncingLeagues.find(syncingLeague => {
    return String(syncingLeague.leagueId) === String(leagueId);
  });
  return existingLeague;
};

export {
  syncLeague,
  unsyncLeague,
  getLeagueSyncState,
  getSyncingLeague
};
