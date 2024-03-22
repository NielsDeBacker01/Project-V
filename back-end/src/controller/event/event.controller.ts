import { Controller, Get, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents, NearFilter, OrFilter } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';
import { eventSelectionCriteria } from 'src/service/event/eventsFilterCriteria';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  killFilter: Filter = new FilterKillEvents();
  playerActorFilter: Filter = new FilterActorPlayerEvents();
  playerTargetFilter: Filter = new FilterTargetPlayerEvents();
  itemFilter: Filter = new FilterItemEvents;
  abilityFilter: Filter = new FilterAbilityEvents;
  playerAgainstPlayerFilter: Filter = new AndFilter(this.playerActorFilter, this.playerTargetFilter);
  itemOrAbilityFilter : Filter = new OrFilter(this.itemFilter, this.abilityFilter);
  nearCertainPointFilter : Filter = new NearFilter(2000, -5000, 500);

  @Get('id')
  getDefaultEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getDefaultEventsBySerieId(series_id);
  }

  @Get('kills')
  getKillsEventsBySerieId(@Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria;
    filters.criteriaFilterer = this.killFilter;
    filters.seriesStateAndDeltaExceptions = ["currentSeconds", "position"]
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get('players')
  getPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria;
    filters.criteriaFilterer = this.playerActorFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get('player-player')
  getPlayerAgainstPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria;
    filters.criteriaFilterer = this.playerAgainstPlayerFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get('items-and-abilities')
  getItemsAndAbilitiesEventsBySerieId(@Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria;
    filters.criteriaFilterer = this.itemOrAbilityFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get('near-test')
  getEventsNearPointBySerieId(@Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria;
    filters.criteriaFilterer = this.nearCertainPointFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */
}
