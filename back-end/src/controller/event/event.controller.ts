import { Controller, Get, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  killFilter: Filter = new FilterKillEvents();
  playerActorFilter: Filter = new FilterActorPlayerEvents();
  playerTargetFilter: Filter = new FilterTargetPlayerEvents();
  itemFilter: Filter = new FilterItemEvents;
  abilityFilter: Filter = new FilterAbilityEvents;
  playerAgainstPlayerFilter: Filter = new AndFilter(this.playerActorFilter, this.playerTargetFilter);

  @Get('id')
  getDefaultEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getDefaultEventsBySerieId(series_id);
  }

  @Get('kills')
  getKillsEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.killFilter);
  }

  @Get('players')
  getPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.playerActorFilter);
  }

  @Get('player-player')
  getPlayerAgainstPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.playerAgainstPlayerFilter);
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */
}
