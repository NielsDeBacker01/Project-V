import * as fs from 'fs';
import { EventService } from './event.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GameTitle, eventSelectionCriteria } from './eventsSelectionCriteria';
import { AndFilter, Filter, FilterActorPlayerEvents, FilterNone, FilterTargetPlayerEvents } from './filter';
import { HttpService } from '@nestjs/axios';

describe('EventService', () => {
  let service: EventService;
  let serie_id: string;
  let gameTitle: GameTitle;
  let filter: Filter;

  beforeEach(() => {
    //setup
    service = new EventService(new HttpService);
    serie_id = "0000000";
    gameTitle = GameTitle.VALORANT;
    filter = new FilterNone;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDefaultEventsBySerieId', () => {
    it('should return a list of events for a serieId, simplified with the default filters', async () => {
      // Arrange
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = await service.getDefaultEventsBySerieId(serie_id, gameTitle);

      //Assert
      expect(result).toEqual(expected);
    });
    
    it('getRawJsonBySerieId should throw error when there is no file for the given serieId', async () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });
      
      // Act & Assert
      try {
        await service.getDefaultEventsBySerieId(serie_id, gameTitle);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('getRawJsonBySerieId should give an error when there is a syntax error in the json for the given serieId', async () => {
      // Arrange
      const expected = [{"events": ["1"]}];
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events" = ["2"]}');
      
      // Act
      const result = await service.getDefaultEventsBySerieId(serie_id, gameTitle);

      //Assert
      expect(result).toEqual(expected);
    });

    it('removeEventsFromJson should throw error when an events field is not an array', async () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": "2"}');
      
      // Act & Assert
      try {
        await service.getDefaultEventsBySerieId(serie_id, gameTitle);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });    
    
    it('removeEventsFromJson should throw error when GRID data is incorrect', async () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      serie_id = "testerror";
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"name": "this value is incorrect and this json object doesnt follow the correct syntax"');
      
      // Act & Assert
      try {
        await service.getDefaultEventsBySerieId(serie_id, gameTitle);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getFilteredEventsBySerieId', () => {
    it('should return a list of events for a serieId that is unfiltered because it passed all filters', async () => {
      // Arrange    
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, new eventSelectionCriteria(gameTitle, filter));

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a serieId with specified event criteria', async () => {
      // Arrange
      filter = new AndFilter(new FilterActorPlayerEvents(), new FilterTargetPlayerEvents());;    
      const expected = [
        { events: [{ type: 'player-act-player', actor: { type: 'player', id: '1', stateDelta: { id: '1' }, state: { id: '1' } }, action: 'act', target: { type: 'player', id: '2', stateDelta: { id: '2' }, state: { id: '2' } } }] },
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{ "type": "player-act-player", "actor": { "type": "player", "id": "1", "stateDelta": { "id": "1" }, "state": { "id": "1" } }, "action": "act", "target": { "type": "player", "id": "2", "stateDelta": {"id": "2" }, "state": { "id": "2" } } }] }\n{ "events": ["2"] }');
      
      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, new eventSelectionCriteria(gameTitle, filter));

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a serieId with specificied events removed', async () => {
      // Arrange
      const filters = new eventSelectionCriteria(gameTitle, filter);
      filters.bannedEventTypes = ["removable"]
      const expected = [
        { events: [{ type: 'unremovable' }] },
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{ "type": "unremovable" }] }\n{ "events": [{ "type": "removable" }] }');
      
      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, filters);

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a serieId with specificied transaction fields removed, empty objects are removed', async () => {
      // Arrange
      const filters = new eventSelectionCriteria(gameTitle, filter);
      filters.transactionFieldsToDelete = ["transactionDelete"];
      const expected = [
        { events: [{ dontDelete: '1'}]}
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"transactionDelete":"delete", "events": [{ "dontDelete": "1"}]}\n{"transactionDelete":"delete", "events": []}');

      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, filters);

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a serieId with specificied event fields removed, empty objects are removed', async () => {
      // Arrange
      const filters = new eventSelectionCriteria(gameTitle, filter);
      filters.eventFieldsToDelete = ["eventDelete"];
      const expected = [
        { events: [{ dontDelete: '1'}]}
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{"dontDelete": "1", "eventDelete":"delete"}]}\n{"events": [{"eventDelete":"delete"}]}');
      
      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, filters);

      //Assert
      expect(result).toEqual(expected);
    });
    
    it('should return a list of filtered events for a serieId with specificied actor/target fields removed, empty objects are removed', async () => {
      // Arrange
      const filters = new eventSelectionCriteria(gameTitle, filter);
      filters.actorTargetFieldsToDelete = {
        ...filters.actorTargetFieldsToDelete,
        test: ["delete"]
      };

      const expected = [
        { events: [{ actor: { type: "test", state: { notDelete: "1"}}}]}
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{"actor": { "type": "test", "state": { "delete": "1", "notDelete": "1"} }}]}');

      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, filters);

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a serieId with seriesState/seriesStateDelta fields removed keeping in mind the exceptions, empty objects get removed', async () => {
      // Arrange
      const filters = new eventSelectionCriteria(gameTitle, filter);
      filters.seriesStateAndDeltaExceptions = ["notDelete"];
      const expected = [
        { events: [{ seriesState: { notDelete: '1' }, seriesStateDelta: { notDelete: '1' }}]}
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{"seriesState": { "delete": "1", "notDelete": "1"}, "seriesStateDelta": { "delete": "1", "notDelete": "1"}}]}')
      
      // Act
      const result = await service.getFilteredEventsBySerieId(serie_id, filters);

      //Assert
      expect(result).toEqual(expected);
    });
  });
});
