import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { AndFilter, Filter, FilterAbilityEvents, FilterActorPlayerEvents, FilterItemEvents, FilterKillEvents, FilterTargetPlayerEvents, NearFilter, OrFilter, SequenceFilter } from 'src/service/event/filter';
import { EventService } from 'src/service/event/event.service';
import { GameTitle, eventSelectionCriteria } from 'src/service/event/eventsSelectionCriteria';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  //Examples for non-standard filters that require additional parameters
  nearCertainPointFilter : Filter = new NearFilter(2000, -5000, 500); 
  AbilityKillSequenceFilter: Filter = new SequenceFilter(new FilterAbilityEvents, new FilterKillEvents, 0, 0.5)
  playerAgainstPlayerFilter: Filter = new AndFilter(new FilterActorPlayerEvents, new FilterTargetPlayerEvents);
  itemOrAbilityFilter : Filter = new OrFilter(new FilterItemEvents, new FilterAbilityEvents);

  @Get()
  getUnfilteredEventsBySerieId(@Query('series_id') series_id: string | string[]): Promise<any> {
    const filters = new eventSelectionCriteria();
    filters.bannedEventTypes = [];
    filters.transactionFieldsToDelete = [];
    filters.eventFieldsToDelete = [];
    filters.actorTargetFieldsToDelete = {};
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game')
  getDefaultEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getDefaultEventsBySerieId(series_id, this.stringToGameTitle(game));
  }

  @Get(':game/kills')
  getKillsEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getFilteredEventsBySerieId(series_id, 
      new eventSelectionCriteria(this.stringToGameTitle(game), new FilterKillEvents)
    );
  }

  @Get(':game/abilities')
  getAbilitiesEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    return this.eventService.getFilteredEventsBySerieId(series_id, 
      new eventSelectionCriteria(this.stringToGameTitle(game), new FilterAbilityEvents)
    );
  }
  
  @Get(':game/near-test')
  getEventsNearPointBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
    const filters = new eventSelectionCriteria(this.stringToGameTitle(game), this.nearCertainPointFilter);
    filters.seriesStateAndDeltaExceptions = ["currentSeconds", "position"];
    filters.bannedEventTypes = [
      ...filters.eventTypefilterTemplates.defaultFilters,
      ...filters.eventTypefilterTemplates.timeRelatedFilters,
      ...filters.eventTypefilterTemplates.pregameRelatedFilter,
      ...filters.eventTypefilterTemplates.gameStructureRelatedFilters
    ];
    return this.eventService.getFilteredEventsBySerieId(series_id, filters);
  }

  @Get(':game/sequence-test')
  getAbilityEventsFollowedByKillEventsBySerieId(@Param('game') game: string, @Query('series_id') series_id: string | string[]): Promise<any> {
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