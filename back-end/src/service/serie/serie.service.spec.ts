import * as fs from 'fs';
import { SerieService } from '../serie/serie.service';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GameTitle } from '../event/eventsSelectionCriteria';
import { AndFilter, Filter, FilterActorPlayerEvents, FilterNone, FilterTargetPlayerEvents } from '../event/filter';

describe('SerieService', () => {
  let service: SerieService;
  let team: string;

  beforeEach(() => {
    //setup
    service = new SerieService();
    team = "team name"
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('SerieService', () => {
    it('getTeamIdByTeamName should return an id for a team name', async () => {
      // Arrange
      const expected = [{ id: 123}];
      jest.spyOn(service, 'callGraphQLQuery').mockReturnValue(Promise.resolve({teams: {edges: [{node: { id: 123}}]}}));
      
      // Act
      const result = await service.getTeamIdByTeamName(team);
      //Assert
      expect(result).toEqual(expected);
    });
    
    it('getTeamIdByTeamName should throw error when there is no id for the given name', async () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(service, 'callGraphQLQuery').mockImplementation(() => {
        throw new Error('File not found');
      });
      
      // Act & Assert
      try {
        await service.getTeamIdByTeamName(team);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    
    it('getTeamIdByTeamName should throw error when the name is wrong', async () => {
      // Arrange
      const team = undefined;
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Act & Assert
      try {
        await service.getTeamIdByTeamName(team);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
