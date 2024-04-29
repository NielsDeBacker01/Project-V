import { BadRequestException, Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents, NearFilter, OrFilter, SequenceFilter } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';
import { GameTitle, eventSelectionCriteria } from 'src/service/event/eventsSelectionCriteria';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  playerAgainstPlayerFilter: Filter = new AndFilter(new FilterActorPlayerEvents, new FilterTargetPlayerEvents);
  itemOrAbilityFilter : Filter = new OrFilter(new FilterItemEvents, new FilterAbilityEvents);
  nearCertainPointFilter : Filter = new NearFilter(2000, -5000, 500); 
  AbilityKillSequenceFilter: Filter = new SequenceFilter(new FilterAbilityEvents, new FilterKillEvents, 0, 0.5)

  @Get(':game')
  getValorantDefaultEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getDefaultEventsBySerieId(series_id, this.stringToGameTitle(game));
  }

  @Get(':game/kills')
  getValorantKillsEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    const filters = new eventSelectionCriteria(this.stringToGameTitle(game), new FilterKillEvents);
    filters.seriesStateAndDeltaExceptions = ["currentSeconds", "position"]
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }
  
  @Get(':game/near-test')
  getValorantEventsNearPointBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.nearCertainPointFilter)
    );
  }

  @Get(':game/sequence-test')
  getValorantAbilityEventsFollowedByKillEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.AbilityKillSequenceFilter)
    );
  }

  //converts a string to a GameTitle
  private stringToGameTitle(game: string): GameTitle {
    const selectedGame = GameTitle[game.toUpperCase() as keyof typeof GameTitle];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    return selectedGame;
  }
}