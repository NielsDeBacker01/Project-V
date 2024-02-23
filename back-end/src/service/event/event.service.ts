import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class EventService {
  getEventsBySerieId(series_id: string): any {
    try {
        const eventData = fs.readFileSync(`../data/events_${series_id}_grid.jsonl`, 'utf8');
        const lines = eventData.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
          try {
            return JSON.parse(line);
          } catch (error) {
            console.error(`Error parsing JSON of line "${line}":`, error);
            return {"status":"failed"};
          }
        });
      } catch (error) {
        console.error(`Error reading file ../data/events_${series_id}_grid.jsonl: ${error}`);
        throw new NotFoundException(`Event data for series_id ${series_id} not found.`);
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
