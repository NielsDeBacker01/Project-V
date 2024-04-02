import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { GameTitle, eventSelectionCriteria } from './eventsFilterCriteria';
import { Filter } from './filter';

@Injectable()
export class EventService {
  //get transaction json with default filters and no external filters
  getDefaultEventsBySerieId(series_id: string, gameTitle: GameTitle): any {
    const defaultCriteria: eventSelectionCriteria = new eventSelectionCriteria(gameTitle);
    const json = this.getRawJsonBySerieId(series_id);
    return this.filterJson(json, defaultCriteria);
  }

  //get events json with default filters and external filters
  getFilteredEventsBySerieId(series_id: string, filter: eventSelectionCriteria): any {
    const json = this.getRawJsonBySerieId(series_id);
    return this.filterJson(json, filter);
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
  private filterJson(unfilteredJson: any, chosenFilterCriteria: eventSelectionCriteria): any {
    try {
      //remove all events that don't meet the desired filter conditions
      unfilteredJson = chosenFilterCriteria.criteriaFilterer.filterEvents(unfilteredJson);
      //removes unwanted event types
      unfilteredJson = this.removeEventsFromJson(chosenFilterCriteria, unfilteredJson);
      //removes unwanted fields from the transaction/events (not including actor/target fields)
      unfilteredJson = this.removeFieldsFromJson(chosenFilterCriteria, unfilteredJson);

      return unfilteredJson.filter(item => item.events && item.events.length > 0);
    } catch (error) {
      console.error(`Error filtering JSON:`, error);
      throw new InternalServerErrorException('Error filtering JSON.');
    }
  }

  //deletes a list of events from a json
  private removeEventsFromJson(chosenFilterCriteria: eventSelectionCriteria, jsonData: any): any {
    try {
      const bannedEventTypes = chosenFilterCriteria.bannedEventTypes;

      //remove all events that meet the given criteria
      for (const item of jsonData) {
        if (Array.isArray(item.events)) {
          item.events = item.events.filter(event => !bannedEventTypes.includes(event.type));
        }
        else if (item.events) {
          // item.events should always be an array
          throw new Error('item.events is not an array.');
        }
      }

      return jsonData.filter(item => item.events && item.events.length > 0);
    } catch (error) {
      console.error(`Error removing events from JSON:`, error);
      throw new InternalServerErrorException('Error removing events from JSON.');
    }
  }

  //delete unnecessary fields from a filterCriteria
  private removeFieldsFromJson(chosenFilterCriteria: eventSelectionCriteria, unfilteredJson: any): any {
    try {
      const transactionFieldsToDelete = chosenFilterCriteria.transactionFieldsToDelete;
      const eventFieldsToDelete = chosenFilterCriteria.eventFieldsToDelete;
      const actorTargetFieldsToDelete = chosenFilterCriteria.actorTargetFieldsToDelete;
      const seriesStateAndDeltaExceptions = chosenFilterCriteria.seriesStateAndDeltaExceptions;
      
      const filteredJson = unfilteredJson.map(transaction => {
        //fields in transactions
        transactionFieldsToDelete.forEach(field => {
          delete transaction[field];
        });

        //fields included in events
        if (transaction.events && transaction.events.length > 0) {
          transaction.events.forEach(event => {
            // Delete fields for actor and target
            this.removeFieldsFromEntity(event.actor, actorTargetFieldsToDelete);
            this.removeFieldsFromEntity(event.target, actorTargetFieldsToDelete);

            // Delete generic event fields
            eventFieldsToDelete.forEach(field => {
              //apply exceptions for seriesState/seriesStateDelta
              if ((event.seriesStateDelta && field == "seriesStateDelta") || (event.seriesState && field == "seriesState")) {
                event[field] = this.removeFieldsWithExceptions(event[field], seriesStateAndDeltaExceptions);
                if (Object.keys(event[field]).length === 0) {
                  delete event[field];
                }
              }
              else {
                delete event[field];
              }
            });
          });
        }
        return transaction;
      });

      return filteredJson;
    } catch (error) {
      console.error(`Error removing fields from JSON:`, error);
      throw new InternalServerErrorException('Error removing fields from JSON.');
    }
  }

  //removes all fields (and sub fields) from an object except for certain names in parameter: exceptions;
  private removeFieldsWithExceptions(object, exceptions) {
    const filterResult = {};

    //check all fields of current object for actions
    //if object was empty recursion stops at this level
    for (const field in object) {
      if (exceptions.includes(field)) {
        //adds the field and relevant id in the object and then returns it up the recursion
        filterResult["id"] = object["id"];
        filterResult[field] = object[field];
      } else if (typeof object[field] === 'object' && object[field] !== null) {
        //digs a level deeper in the object and appends the result if succesfull back into the current level
        const filteredSubObj = this.removeFieldsWithExceptions(object[field], exceptions);
        if (Object.keys(filteredSubObj).length > 0) {
          filterResult[field] = filteredSubObj;
        }
      }
    }

    return filterResult;
  }

  //remove fields from the state/statedelta for an entity (usually actor/target)
  //also removes the id by default as this is also included in the entity already
  private removeFieldsFromEntity(entity, entityFieldsToDelete) {
    try {
      if (entity && entity.type && entityFieldsToDelete[entity.type]) {
        const fields = entityFieldsToDelete[entity.type];
        fields.forEach(field => {
          delete entity.state[field];
          delete entity.stateDelta[field];
        });
      }
    } catch (error) {
      console.error(`Error removing fields from entity:`, error);
      throw new InternalServerErrorException('Error removing fields from entity.');
    }
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
