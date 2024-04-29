import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { GameTitle, eventSelectionCriteria } from './eventsSelectionCriteria';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as AdmZip from 'adm-zip';

@Injectable()
export class EventService {
  private testDataIds = ["0000000", "2616320", "2628069", "test"];
  constructor(private httpService: HttpService) {}

  //get transaction json with default filters and no external filters
  async getDefaultEventsBySerieId(series_id: string | string[], gameTitle: GameTitle): Promise<any> {
    const defaultCriteria: eventSelectionCriteria = new eventSelectionCriteria(gameTitle);
    return this.getFilteredEventsBySerieId(series_id, defaultCriteria);
  }

  //get events json with default filters and external filters
  async getFilteredEventsBySerieId(series_id: string | string[], filter: eventSelectionCriteria): Promise<any> {
    try{
      let json = [];
      if(Array.isArray(series_id))
      {
        for (const id of series_id) {
          const result = await this.getRawJsonBySerieId(id);
          const filteredResult = this.filterJson(result, filter);
          json = json.concat(filteredResult);
        }
        return json;
      }
      else if(typeof series_id === 'string')
      {
        json = await this.getRawJsonBySerieId(series_id);
        return this.filterJson(json, filter);
      }
      else
      {
        throw new BadRequestException(`Invalid parameter type for series_id: ${typeof series_id}. Expected string or string array.`);
      }
    } catch (error) {
      console.error(`Error in getFilteredEventsBySerieId for series_id ${series_id}: ${error}`);
      throw error;
    }
  }

  //get the full json event file by id
  private async getRawJsonBySerieId(series_id: string): Promise<any> {
    try {
      let eventData: string;
      //get the correct type of jsonl string
      if(this.testDataIds.includes(series_id))
      {
        eventData = fs.readFileSync(`../data/events_${series_id}_grid.jsonl`, 'utf8');
      }
      else
      {
        eventData = await this.getJsonFromGridApiBySerieId(series_id);
      }
      
      //convert jsonl string to a json
      const lines = eventData.split('\n').filter(line => line.trim() !== '');
      return lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.error(`Error parsing JSON of line "${line}":`, error);
          return { "status": "failed" };
        }
      })
      
    } catch (error) {
      console.error(`Error reading file ../data/events_${series_id}_grid.jsonl: ${error}`);
      throw new NotFoundException(`Event data for series_id ${series_id} not found.`);
    }
  }
  
  //get the full json event file by id from the Grid API
  private async getJsonFromGridApiBySerieId(series_id: string): Promise<string> {
    try {
      const headers = {
        'Accept':'application/zip',
        'x-api-key':process.env.API_KEY
      };

      //call the GRID API
      let jsonlData: string = "";
      const response = await firstValueFrom(this.httpService.get(`https://api.grid.gg/file-download/events/grid/series/${series_id}`, { responseType: 'arraybuffer', headers: headers,  }));
      
      //unzip and find the jsonl file
      const zip = new AdmZip(response.data);
      const zipEntries = zip.getEntries();
      zipEntries.forEach(entry => {
        if (entry.entryName.endsWith('.jsonl')) {
          jsonlData = zip.readAsText(entry);
        }
      });

      return jsonlData;
    } catch (error) {
      console.error(`Error getting GRID series data from https://api.grid.gg/file-download/events/grid/series/${series_id}: ${error}`);
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
      console.error(`Error filtering JSON: ${error}`);
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
          transaction.events = transaction.events.filter(event => {
            // Delete fields for actor and target (if those exist)
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
            
            return Object.keys(event).length !== 0;
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
          delete entity.state?.[field];
          delete entity.stateDelta?.[field];
        });
      }
    } catch (error) {
      console.error(`Error removing fields from entity:`, error);
      throw new InternalServerErrorException('Error removing fields from entity.');
    }
  }

}
