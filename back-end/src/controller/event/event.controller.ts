import { Controller, Get, Query } from '@nestjs/common';
import { EventService } from 'src/service/event/event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('id')
  getEventsById(@Query('series_id') series_id: string): any[] {
    return this.eventService.getEventsById(series_id);
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */
}
