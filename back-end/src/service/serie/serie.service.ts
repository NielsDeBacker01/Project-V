import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class SerieService {
    constructor() {}

    private baseURL = 'https://api.grid.gg/central-data/graphql';
    private graphQlClient = new GraphQLClient(
        this.baseURL, {
        headers: {
            "x-api-key": process.env.API_KEY,
        },
    });

    // Function to handle sending the request
    async callGraphQLQuery( query, variables = {}) {
        try {
            const data = await this.graphQlClient.request(query, variables);
            return data;
        } catch (error) {
            return error;
        }
    }

    // Recursive function to handle multiple request to work with paging
    async callGraphQLQueryRecursively( query, variables, allNodes = [] ) {
        // Call the callGraphQLQuery() function to make the initial request
        const data = await this.callGraphQLQuery(query, variables);
        // Merge the nodes from the current page with the previously collected nodes
        const firstKey = Object.keys(data)[0]
        const currentNodes = data[firstKey].edges.map((edge) => edge.node);
        allNodes = [...allNodes, ...currentNodes];
        
        // Check if there are more pages of results
        if (data[firstKey].pageInfo.hasNextPage) {
            // Update the after variable with the value of the endCursor
            variables.after = data[firstKey].pageInfo.endCursor;
        
            // Call the function recursively with the updated variables and nodes
            return this.callGraphQLQueryRecursively(query, variables, allNodes);
        } else {
            // Return the final array of nodes if there are no more pages of results
            return allNodes;
        }
    }

    //get all teamIds matching a team name
    async getTeamIdByTeamName(team_name: string): Promise<any> {
        try {
            if(team_name === undefined)
            {
                throw new BadRequestException(`Invalid parameter for team_name: ${team_name}. Expected string or string array.`);
            }
            //gets id for a team name
            const teamsIds = await this.callGraphQLQueryRecursively(this.teamIdsForTeamNameQuery, {teamName: team_name});

            return teamsIds;
        } catch (error) {
            console.error(`Error getting GRID series data from 'https://api.grid.gg/central-data/graphql': ${error}`);
            throw new NotFoundException(`Series ids for team not found.`);
        }
    }

    //get all series ids for a team name
    async getSerieIdsByTeamName(team_name: string): Promise<any> {
        try {
            //gets id for a team name
            const teamsIds = await this.getTeamIdByTeamName(team_name);

            //gets series ids for a team id
            const seriesIds = (await this.callGraphQLQueryRecursively(this.seriesIdsForTeamsIdQuery, {teamIds: teamsIds.map(d => d.id), after:""})).map(t => t.id);

            return seriesIds;
        } catch (error) {
            console.error(`Error getting GRID series data from 'https://api.grid.gg/central-data/graphql': ${error}`);
            throw new NotFoundException(`Series ids for team not found.`);
        }
    }


    //below are all graphql queries
    teamIdsForTeamNameQuery = `
    query teamIdsForTeamNameQuery($teamName: String!) {
        teams(filter: { name: { contains: $teamName } }) {
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
            node {
            id
            name
            }
        }
        }
    }`;

    seriesIdsForTeamsIdQuery = `
    query seriesIdsForTeamsIdQuery($teamIds: [ID!], $after: Cursor!) {
        allSeries(
        first: 50
        after: $after
        filter:{
            teamIds: {
                in: $teamIds
            }
        }
        orderBy: StartTimeScheduled
        ) {
        pageInfo{
            hasNextPage
            endCursor
        }
        edges{
            node{
            id
            startTimeScheduled
            }
        }
        }
    }`
}
