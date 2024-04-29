import { GraphQLClient } from 'graphql-request';

const baseURL = 'https://api.grid.gg/central-data/graphql';

const SerieIdService = new GraphQLClient(
  baseURL, {
  headers: {
    "x-api-key": API_KEY,
  },
});

const fetchData = async (query, variables = {}) => {
  try {
    console.time('BackendCall');
    const data = await SerieIdService.request(query, variables);
    console.timeEnd('BackendCall');
    return data;
  } catch (error) {
    //double check
    console.error(`Error fetching series data:`, error);
    return error;
  }
};

SerieIdService.getRecentMatchesForTeam = async (team) => {
  //?
  const teamsData = await fetchData(teamQuery, {teamName: team}).teams.edges.map((t) => t.node);
  console.log(teamsData);

  //?
  const results = await fetchData(seriesQuery, {teamIds: teamsData.map(d => d.id)});
  console.log(results);
};
  
  
export default SerieIdService;


//ALL CODE BEYOND THIS POINT IS BY GRID
const teamQuery = `
query GetTeams($teamName: String!) {
  teams(filter: { name: { contains: $teamName } }) {
    totalCount
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        id
        name
      }
    }
  }
}`;
const seriesQuery = `
  query GetAllSeriesInNext24Hours($gte: String!, $lte: String!, $teamIds: [ID!]) {
    allSeries(
      filter:{
        startTimeScheduled:{
          gte: $gte
          lte: $lte
        }
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
          title {
            nameShortened
          }
          tournament {
            nameShortened
          }
          startTimeScheduled
          format {
            name
            nameShortened
          }
          teams {
            baseInfo {
              id
              name
            }
          }
        }
      }
    }
  }
`;
