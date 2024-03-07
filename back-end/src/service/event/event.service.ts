import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { eventsFilterCriteria } from './eventsFilterCriteria';

@Injectable()
export class EventService {
  //defaultFilters contains all values most often used to filter a json of events
  //to change filter criteria you need to make a new instance of eventsFilterCriteria and edit that one
  defaultFilters: Readonly<eventsFilterCriteria> = new eventsFilterCriteria();

  //get events json with common filters
  getDefaultEventsBySerieId(series_id: string): any {
    const events = this.getRawJsonBySerieId(series_id);
    return this.filterJson(events, this.defaultFilters);
  }

  //get the full json event file by id
  private getRawJsonBySerieId(series_id: string): any {
    try {
      const eventData = fs.readFileSync(`../data/events_${series_id}_grid.jsonl`, 'utf8');
      const lines = eventData.split('\n').filter(line => line.trim() !== '');
      return lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.error(`Error parsing JSON of line "${line}":`, error);
          return { "status": "failed" };
        }
      });
    } catch (error) {
      console.error(`Error reading file ../data/events_${series_id}_grid.jsonl: ${error}`);
      throw new NotFoundException(`Event data for series_id ${series_id} not found.`);
    }
  }

  //applies all necessary filters to a json
  private filterJson(unfilteredJson: any, chosenFilterCriteria: eventsFilterCriteria
  ): any {
    //removes unwanted event types
    unfilteredJson = this.removeEventTypesFromJson(chosenFilterCriteria, unfilteredJson);
    //removes unwanted fields from the transaction/events (not including actor/target fields)
    unfilteredJson = this.removeFieldsFromJson(chosenFilterCriteria, unfilteredJson);

    return unfilteredJson;
  }

  //deletes a list of events from a json
  private removeEventTypesFromJson(chosenFilterCriteria: eventsFilterCriteria, jsonData: any): any {
    const bannedEventTypes = chosenFilterCriteria.bannedEventTypes;

    //remove all events that meet the given criteria
    for (const item of jsonData) {
      if (item.events) {
        item.events = item.events.filter(event => !bannedEventTypes.includes(event.type));
      }
    }
    //return only the transactions that still have an event
    return jsonData.filter(item => item.events && item.events.length > 0);
  }

  //delete unnecessary fields from a filterCriteria
  private removeFieldsFromJson(chosenFilterCriteria: eventsFilterCriteria, unfilteredJson: any): any {
    const transactionFieldsToDelete = chosenFilterCriteria.transactionFieldsToDelete;
    const eventFieldsToDelete = chosenFilterCriteria.eventFieldsToDelete;
    const actorTargetFieldsToDelete = chosenFilterCriteria.actorTargetFieldsToDelete;

    const filteredJson = unfilteredJson.map(transaction => {
      //fields in transactions
      transactionFieldsToDelete.forEach(field => {
        delete transaction[field];
      });

      //fields included in events
      if (transaction.events && transaction.events.length > 0) {
        transaction.events.forEach(event => {
          //delete fields for a certain type of event actor
          if(event.actor && event.actor.type && actorTargetFieldsToDelete[event.actor.type] )
          {
            actorTargetFieldsToDelete[event.actor.type].forEach(field => {
              delete event.actor.stateDelta[field];
            });
          }

          //delete fields for a certain type of event target
          if(event.target && event.target.type && actorTargetFieldsToDelete[event.target.type] )
          {
            actorTargetFieldsToDelete[event.target.type].forEach(field => {
              delete event.target.state[field];
              delete event.target.stateDelta[field];
            });
          }

          //delete generic event fields
          eventFieldsToDelete.forEach(field => {
            delete event[field];
          });
        });
      }
      return transaction;
    });

    return filteredJson;
  }

  /* part of issue 34
  getEventsByMultipleIds(series_ids: string[]): any {
    try {
      if (!Array.isArray(series_ids)) {
        throw new Error(`series_ids must be an array: ${series_ids}`);
      }

      const allEvents = series_ids.map(series_id => this.getEventsById(series_id));
      return [].concat(...allEvents);
    } catch (error) {
      console.error(`Error processing multiple series_id for event data: ${error}`);
      throw new InternalServerErrorException('Error processing multiple event data.');
    }
  }
  */
}
