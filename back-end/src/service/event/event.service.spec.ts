import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { EventService } from './event.service';
import { NotFoundException } from '@nestjs/common';
import { GameTitle, eventSelectionCriteria } from './eventsFilterCriteria';
import { FilterNone } from './filter';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    service = new EventService();
  });

  /*
  describe('example', () => {
    it('fail', () => {
      // Arranage
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act & Assert
      expect(() => {
        //service.function('nonexistent');
      }).toThrow(NotFoundException);
    });
  });*/

  describe('getDefaultEventsBySerieId', () => {
    it('should return a list of events for a certain serieId, simplified with the default filters', () => {
      // Arrange
      const expected = [{ events: ['1'] }, { events: ['2'] }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue('{"events": ["1"]}\n{"events": ["2"]}');
      
      // Act
      const result = service.getDefaultEventsBySerieId("0000000", GameTitle.VALORANT);

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
      const result = service.getFilteredEventsBySerieId("0000000", new eventSelectionCriteria(GameTitle.VALORANT, new FilterNone()));

      //Assert
      expect(result).toEqual(expected);
    });
  });

  // Write similar tests for other public methods like getDefaultEventsBySerieId, getFilteredEventsBySerieId, etc.
});
