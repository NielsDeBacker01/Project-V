import { Controller, Get, Query } from '@nestjs/common';
import { Criteria, CriteriaTemp } from 'src/service/event/criteria';
import { EventService } from 'src/service/event/event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  fakecriteria: Criteria = new CriteriaTemp();

  @Get('id')
  getDefaultEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getDefaultEventsBySerieId(series_id);
  }

  @Get('kills')
  getKillsEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.fakecriteria);
  }

  @Get('players')
  getPlayerEventsBySerieId(@Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id, this.fakecriteria);
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */
}
