import { GraphQLClient } from 'graphql-request';

const baseURL = 'https://api.grid.gg/central-data/graphql';

const SerieIdService = new GraphQLClient(
  baseURL, {
  headers: {
    "x-api-key": process.env.REACT_APP_API_KEY,
  },
});

const fetchData = async (query, variables = {}) => {
  try {
    console.time('BackendCall Series');
    const data = await SerieIdService.request(query, variables);
    console.timeEnd('BackendCall Series');
    return data;
  } catch (error) {
    //double check
    console.error(`Error fetching series data:`, error);
    return error;
  }
};

SerieIdService.getRecentMatchIdsForTeam = async (team) => {
  //skip this step somehow?
  //gets id for a team name
  const teamsIds = (await fetchData(teamIdsForTeamNameQuery, {teamName: team})).teams.edges.map((t) => t.node);
  console.log(teamsIds);

  //gets series ids for a team id
  const seriesData = await fetchData(seriesIdsForTeamsIdQuery, {teamIds: teamsIds.map(d => d.id)});
  const seriesIds = seriesData.allSeries.edges.map((t) => t.node.id);
  console.log(seriesIds);
};
  
  
export default SerieIdService;

//filter for validity of match?
//ALL CODE BEYOND THIS POINT IS BY GRID
const teamIdsForTeamNameQuery = `
query GetTeams($teamName: String!) {
  teams(filter: { name: { contains: $teamName } }) {
    totalCount
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
      }
    }
  }
}`;

const seriesIdsForTeamsIdQuery = `
  query GetAllSeriesInNext24Hours($teamIds: [ID!]) {
    allSeries(
      filter:{
        teamIds: {
          in: $teamIds
        }
      }
      orderBy: StartTimeScheduled
    ) {
      totalCount,
      pageInfo{
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges{
        cursor
        node{
          id
          startTimeScheduled
        }
      }
    }
  }
`;
