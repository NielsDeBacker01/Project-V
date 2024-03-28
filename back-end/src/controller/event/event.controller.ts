import { BadRequestException, Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents, NearFilter, OrFilter } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';
import { GameTitle, eventSelectionCriteria } from 'src/service/event/eventsFilterCriteria';

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

  @Get(':game')
  getValorantDefaultEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    return this.eventService.getDefaultEventsBySerieId(series_id, this.stringToGameTitle(game));
  }

  @Get(':game/kills')
  getValorantKillsEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const filters = new eventSelectionCriteria(this.stringToGameTitle(game), this.killFilter);
    filters.seriesStateAndDeltaExceptions = ["currentSeconds", "position"]
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game/players')
  getValorantPlayerEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.playerActorFilter)
    );
  }

  @Get(':game/player-player')
  getValorantPlayerAgainstPlayerEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.playerAgainstPlayerFilter)
    );
  }

  @Get(':game/items-and-abilities')
  getValorantItemsAndAbilitiesEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.itemOrAbilityFilter)
    );
  }
  
  @Get(':game/near-test')
  getValorantEventsNearPointBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    return this.eventService.getFilteredEventsBySerieId(series_id,
      new eventSelectionCriteria(this.stringToGameTitle(game), this.nearCertainPointFilter)
    );
  }

  /* part of issue 34
  @Get('idlist')
  getEventsByMultipleIds(@Query('series_ids') series_ids: string[]): any[] {
    return this.eventService.getEventsByMultipleIds(series_ids);
  }
  */

  //converts a string to a GameTitle
  private stringToGameTitle(game: string): GameTitle {
    const selectedGame = GameTitle[game.toUpperCase() as keyof typeof GameTitle];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    return selectedGame;
  }
}