import { Filter, FilterNone } from "./filter";

export class eventSelectionCriteria {
   bannedEventTypes: string[];
   transactionFieldsToDelete: string[];
   eventFieldsToDelete: string[];
   actorTargetFieldsToDelete: object;
   criteriaFilterer: Filter;
   seriesStateAndDeltaExceptions: string[]
   
    //provides default values that are usually what is needed
    constructor() {
      this.bannedEventTypes = this.eventTypefilterTemplates.defaultFilters.concat(this.eventTypefilterTemplates.timeRelatedFilters);
      this.transactionFieldsToDelete = [
         "id", "correlationId", "seriesId"];
      this.eventFieldsToDelete = [
         "id", "includesFullState", "seriesStateDelta", "seriesState"];
      this.actorTargetFieldsToDelete = {
         series: ["id","games","draftActions"],
         game: ["statePath","structures","nonPlayerCharacters","segments","draftActions"],
         round: ["statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
         clock: ["id", "type"],
         freezetime: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
         timeout: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
         team: [],
         player: [],
         item: ["id","statePath"],
         ability: ["id"],
         plantBomb: ["id","statePath","type"],
         defuseBomb: ["id","statePath","type"],
         beginDefuseBomb: ["id","statePath","type"],
         reachDefuseBombCheckpoint: ["id","statePath","type"],
         stopDefuseBomb: ["id","statePath","type"],
         explodeBomb: ["id","statePath","type"],
      }
      this.criteriaFilterer = new FilterNone();
      this.seriesStateAndDeltaExceptions = [];
    }

   //Available filter sets for use in bannedEventTypes
   //for now these only take in to account the events from Valorant games

   //deletes events with usually unimportant data
   eventTypefilterTemplates = {
      defaultFilters: [
         "grid-started-feed", "grid-sampled-feed", "grid-sampled-tournament",
         "grid-sampled-series", "grid-invalidated-series", "grid-validated-series",
         "grid-ended-feed", "player-left-series", "player-rejoined-series",
         "tournament-started-series", "tournament-ended-series"
      ],
      timeRelatedFilters: [
         "round-started-freezetime", "round-ended-freezetime", "freezetime-started-timeout",
         "freezetime-ended-timeout", "game-set-clock", "game-started-clock",
         "game-stopped-clock"
      ],
      bombRelatedFilters: [
         "player-completed-plantBomb", "team-completed-plantBomb", "team-completed-defuseBomb",
         "player-completed-defuseBomb", "player-completed-beginDefuseBomb", "player-completed-reachDefuseBombCheckpoint",
         "player-completed-stopDefuseBomb", "player-completed-explodeBomb", "team-completed-explodeBomb"
      ],
      combatRelatedFilters: [
         "player-revived-player", "player-selfrevived-player", "game-killed-player",
         "player-killed-player", "player-selfkilled-player", "player-teamkilled-player",
         "player-pickedUp-item", "player-dropped-item", "player-used-ability"
      ],
      gameStructureRelatedFilters: [
         "team-won-series", "team-won-game", "series-started-game",
         "series-ended-game", "team-won-round", "game-started-round",
         "game-ended-round"
      ]
   };
}
