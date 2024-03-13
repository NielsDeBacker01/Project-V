import { Controller, Get, Query } from '@nestjs/common';
import { Filter, FilterKillEvents, FilterPlayerEvents} from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  killfilter: Filter = new FilterKillEvents();
  playerfilter: Filter = new FilterPlayerEvents();

  @Get('id')
  getDefaultEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getDefaultEventsBySerieId(series_id);
  }

  @Get('kills')
  getKillsEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.killfilter);
  }

  @Get('players')
  getPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.playerfilter);
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */
}
