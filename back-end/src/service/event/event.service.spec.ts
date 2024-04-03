import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { EventService } from './event.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GameTitle, eventSelectionCriteria } from './eventsFilterCriteria';
import { AndFilter, Filter, FilterActorPlayerEvents, FilterNone, FilterTargetPlayerEvents } from './filter';

describe('EventService', () => {
  let service: EventService;
  let serie_id: string;
  let gameTitle: GameTitle;
  let filter: FilterNone;

  beforeEach(() => {
    //setup
    service = new EventService();
    serie_id = "0000000";
    gameTitle = GameTitle.VALORANT;
    filter = new FilterNone;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDefaultEventsBySerieId', () => {
    it('should return a list of events for a certain serieId, simplified with the default filters', () => {
      // Arrange
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = service.getDefaultEventsBySerieId(serie_id, gameTitle);

      //Assert
      expect(result).toEqual(expected);
    });

    it('getRawJsonBySerieId should throw error when there is no file for the given serieId', () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });
      
      // Act & Assert
      expect(() => {
        service.getDefaultEventsBySerieId(serie_id, gameTitle);
      }).toThrow(NotFoundException);
    });

    it('getRawJsonBySerieId should give an error when there is a syntax error in the json for the given serieId', () => {
      // Arrange
      const expected = [{"events": ["1"]}];
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events" = ["2"]}');
      
      // Act
      const result = service.getDefaultEventsBySerieId(serie_id, gameTitle);

      //Assert
      expect(result).toEqual(expected);
    });

    it('removeEventsFromJson should throw error when an events field is not an array', () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": "2"}');
      
      // Act & Assert
      expect(() => {
        service.getDefaultEventsBySerieId(serie_id, gameTitle);
      }).toThrow(InternalServerErrorException);
    });
  });

  describe('getFilteredEventsBySerieId', () => {
    it('should return a list of filtered events for a certain serieId and eventselectionCriteria', () => {
      // Arrange    
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = service.getFilteredEventsBySerieId(serie_id, new eventSelectionCriteria(gameTitle, filter));

      //Assert
      expect(result).toEqual(expected);
    });

    it('should return a list of filtered events for a certain serieId with a special event criteria filter', () => {
      // Arrange
      filter = new AndFilter(new FilterActorPlayerEvents(), new FilterTargetPlayerEvents());;    
      const expected = [
        { events: [{ type: 'player-act-player', actor: { type: 'player', id: '1', stateDelta: { id: '1' }, state: { id: '1' } }, action: 'act', target: { type: 'player', id: '2', stateDelta: { id: '2' }, state: { id: '2' } } }] },
      ];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": [{ "type": "player-act-player", "actor": { "type": "player", "id": "1", "stateDelta": { "id": "1" }, "state": { "id": "1" } }, "action": "act", "target": { "type": "player", "id": "2", "stateDelta": {"id": "2" }, "state": { "id": "2" } } }] }\n{ "events": ["2"] }');
      
      // Act
      const result = service.getFilteredEventsBySerieId(serie_id, new eventSelectionCriteria(gameTitle, filter));

      //Assert
      expect(result).toEqual(expected);
    });
  });
});
