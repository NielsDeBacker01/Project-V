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

    // Send the request
    async callGraphQLQuery( query, variables = {}) {
        try {
            const data = await this.graphQlClient.request(query, variables);
            return data;
        } catch (error) {
            return error;
        }
    }

    async getTeamIdByTeamName(team_name: string): Promise<any> {
        try {
            if(team_name === undefined)
            {
                throw new BadRequestException(`Invalid parameter for team_name: ${team_name}. Expected string or string array.`);
            }
            //gets id for a team name
            const teamsIds = (await this.callGraphQLQuery(this.teamIdsForTeamNameQuery, {teamName: team_name})).teams.edges.map((t) => t.node);

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
            const seriesIds = (await this.callGraphQLQuery(this.seriesIdsForTeamsIdQuery, {teamIds: teamsIds.map(d => d.id), after:""})).allSeries.edges.map((t) => t.node.id);

            return seriesIds;
        } catch (error) {
            console.error(`Error getting GRID series data from 'https://api.grid.gg/central-data/graphql': ${error}`);
            throw new NotFoundException(`Series ids for team not found.`);
        }
    }

    teamIdsForTeamNameQuery = `
    query teamIdsForTeamNameQuery($teamName: String!) {
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
    }`
}
