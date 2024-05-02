import axios from 'axios';

const baseURL = 'http://localhost:3200/serie';

const SerieIdService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchData = async (path, teamName) => {
  try {
    console.time('BackendCall Series');
    const response = await SerieIdService.get(path, {
      params: {
        team_name: teamName,
      },
    });
    console.timeEnd('BackendCall Series');
    return response.data;
  } catch (error) {
    console.error(`Error fetching event data from ${path} by series_id:`, error);
    throw error;
  }
};

SerieIdService.getRecentMatchIdsForTeam = async (teamName) => {
  return fetchData('/series-ids', teamName);
};

//returns a list of all ids containing the teamName, because multiple can exist, filtering is required afterwards.
SerieIdService.getTeamIdForTeam = async (teamName) => {
  return fetchData('/team-id', teamName);
};
  
export default SerieIdService;