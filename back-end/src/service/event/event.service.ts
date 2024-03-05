import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class EventService {

  //Available filter sets for use in removeEventTypesFromJson
  //for now these only take in to account the events from Valorant games

  //deletes events with usually unimportant data
  defaultFilters: string[] = [
    "grid-started-feed", "grid-sampled-feed", "grid-sampled-tournament",
    "grid-sampled-series", "grid-invalidated-series", "grid-validated-series",
    "grid-ended-feed", "player-left-series", "player-rejoined-series",
    "tournament-started-series", "tournament-ended-series"]
  //deletes events with data regarding the time/breaks in a match
  timeRelatedFilters: string[] = [
    "round-started-freezetime", "round-ended-freezetime", "freezetime-started-timeout",
    "freezetime-ended-timeout", "game-set-clock", "game-started-clock",
    "game-stopped-clock",]
  //deletes events with data regarding the state of a bomb in a game like Valorant
  bombRelatedFilters: string[] = [
    "player-completed-plantBomb", "team-completed-plantBomb", "team-completed-defuseBomb",
    "player-completed-defuseBomb", "player-completed-beginDefuseBomb", "player-completed-reachDefuseBombCheckpoint",
    "player-completed-stopDefuseBomb", "player-completed-explodeBomb", "team-completed-explodeBomb",]
  //deletes events with data regarding the combat and actions of players and their teams
  combatRelatedFilters: string[] = [
    "player-revived-player", "player-selfrevived-player", "game-killed-player",
    "player-killed-player", "player-selfkilled-player", "player-teamkilled-player",
    "player-pickedUp-item", "player-dropped-item", "player-used-ability"]
  //deletes events with data regarding the state of rounds, games and series
  gameStructureRelatedFilters: string[] = [
    "team-won-series", "team-won-game", "series-started-game",
    "series-ended-game", "team-won-round", "game-started-round",
    "game-ended-round",]


  //get events json with common filters
  getDefaultEventsBySerieId(series_id: string): any {
    const events = this.getRawJsonBySerieId(series_id)
    const newFilters = this.defaultFilters.concat(this.timeRelatedFilters); 
    return this.filterJson(events, newFilters);
  }

  //get the full json event file by id
  private getRawJsonBySerieId(series_id: string): any{
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
  private filterJson(unfilteredJson: any, bannedEventTypes: string[]): any {
    unfilteredJson = this.removeEventTypesFromJson(bannedEventTypes, unfilteredJson);
    return unfilteredJson;
  }

  //deletes a list of events from a json
  private removeEventTypesFromJson(bannedEventTypes: string[], jsonData: any): any {
    for (const item of jsonData) {
      if (item.events) {
        //remove all events that meet the given criteria
        item.events = item.events.filter(event => !bannedEventTypes.includes(event.type));
      }
    }
    //return only the items that still have an event
    return jsonData.filter(item => item.events && item.events.length > 0);
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
