import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { EventService } from './event.service';
import { NotFoundException } from '@nestjs/common';
import { GameTitle, eventSelectionCriteria } from './eventsFilterCriteria';
import { Filter, FilterNone } from './filter';

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

    it('getRawJsonBySerieId should give an error when there is no file for the given serieId', () => {
      // Arrange
      //prevent error logs
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });
      
      // Act & Assert
      expect(() => {
        service.getDefaultEventsBySerieId(serie_id, gameTitle);
      }).toThrow(new NotFoundException("Event data for series_id 0000000 not found."));
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
  });

  describe('getFilteredEventsBySerieId', () => {
    it('should return a list of events for a certain serieId, simplified with the given filters', () => {
      // Arrange    
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = service.getFilteredEventsBySerieId(serie_id, new eventSelectionCriteria(gameTitle, filter));

      //Assert
      expect(result).toEqual(expected);
    });
  });
});
