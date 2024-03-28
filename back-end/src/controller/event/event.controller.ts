import { BadRequestException, Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents, NearFilter, OrFilter } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';
import { GameTitles, eventSelectionCriteria } from 'src/service/event/eventsFilterCriteria';

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

  private getFilteredEvents(series_id: string, gameTitle: GameTitles, criteriaFilterer: Filter): any[] {
    const filters = new eventSelectionCriteria(gameTitle);
    filters.criteriaFilterer = criteriaFilterer;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game')
  getValorantDefaultEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    return this.eventService.getDefaultEventsBySerieId(series_id, selectedGame);
  }

  @Get(':game/kills')
  getValorantKillsEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    const filters = new eventSelectionCriteria(selectedGame);
    filters.criteriaFilterer = this.killFilter;
    filters.seriesStateAndDeltaExceptions = ["currentSeconds", "position"]
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game/players')
  getValorantPlayerEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    const filters = new eventSelectionCriteria(selectedGame);
    filters.criteriaFilterer = this.playerActorFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game/player-player')
  getValorantPlayerAgainstPlayerEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    const filters = new eventSelectionCriteria(selectedGame);
    filters.criteriaFilterer = this.playerAgainstPlayerFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game/items-and-abilities')
  getValorantItemsAndAbilitiesEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    const filters = new eventSelectionCriteria(selectedGame);
    filters.criteriaFilterer = this.itemOrAbilityFilter;
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }
  
  @Get(':game/near-test')
  getValorantEventsNearPointBySerieId(@Param('game') game: string, @Query('series_id') series_id: string): any[] {
    const selectedGame = GameTitles[game.toUpperCase() as keyof typeof GameTitles];
    if (!selectedGame) {
      throw new BadRequestException('Invalid game');
    }
    const filters = new eventSelectionCriteria(selectedGame);
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