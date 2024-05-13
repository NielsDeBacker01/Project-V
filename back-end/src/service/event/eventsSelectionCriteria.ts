import { Filter, FilterNone } from "./filter";

export class eventSelectionCriteria {
   bannedEventTypes: string[];
   transactionFieldsToDelete: string[];
   eventFieldsToDelete: string[];
   actorTargetFieldsToDelete: object;
   criteriaFilterer: Filter;
   seriesStateAndDeltaExceptions: string[]
   
   //provides default values that are usually what is needed
   constructor(game: GameTitle, filter: Filter = new FilterNone()) {
      //filters with fields that might be game specific
      switch (game) {
         case GameTitle.VALORANT:
            this.bannedEventTypes = this.eventTypefilterTemplates.defaultFilters.concat(this.eventTypefilterTemplates.timeRelatedFilters);
            //used to filter the fields in the state/statedelta of an actor/target
            //use an "_" to indicate filtering for a subfield of a actor/target field.
            this.actorTargetFieldsToDelete = {
               series: ["id","games","draftActions"],
               series_teams: this.actorTargetFieldfilterTemplates.teamsFilters,
               series_teams_players: this.actorTargetFieldfilterTemplates.teamsPlayersFilters,
               game: ["statePath","structures","nonPlayerCharacters","segments","draftActions"],
               game_teams: this.actorTargetFieldfilterTemplates.teamsFilters,
               game_teams_players: this.actorTargetFieldfilterTemplates.teamsPlayersFilters,
               game_clock: ["id", "type"],           
               round: ["statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               clock: ["id", "type"],
               freezetime: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               timeout: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               team: [],
               team_series: ["id"],
               team_objectives: ["id", "statePath"],
               team_game: ["id"],
               team_game_series: ["id"],
               team_game_series_objectives: ["id", "statePath"],
               team_round: ["id"],
               player: [],
               player_game: ["id","name","money"],
               player_game_inventory_items: ["id", "statePath"],
               player_game_abilities: ["id"],
               player_game_objectives: ["id", "statePath"],
               player_series: ["id", "name", "participationStatus"],
               player_series_objectives: ["id", "statePath"],
               player_round: ["statePath"],
               player_round_objectives: ["id", "statePath"],
               item: ["id","statePath"],
               ability: ["id"],
               plantBomb: ["id", "statePath", "type"],
               defuseBomb: ["id", "statePath", "type"],
               beginDefuseBomb: ["id", "statePath", "type"],
               reachDefuseBombCheckpoint: ["id", "statePath", "type"],
               stopDefuseBomb: ["id", "statePath", "type"],
               explodeBomb: ["id", "statePath", "type"],
            }
            break;
         case GameTitle.CS2:
            this.bannedEventTypes = this.eventTypefilterTemplates.defaultFilters.concat(this.eventTypefilterTemplates.timeRelatedFilters);
            this.actorTargetFieldsToDelete = {
               series: ["id","games","draftActions"],
               game: ["statePath","structures","nonPlayerCharacters","segments","draftActions"],
               round: ["statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               clock: ["id", "type"],
               freezetime: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               timeout: ["id", "statePath", "type", "sequenceNumber", "teams", "segments", "draftActions"],
               team: [],
               player: [],
               plantBomb: ["id","statePath","type"],
               explodeBomb: ["id","statePath","type"],               
               beginDefuseWithoutKit: ["id","statePath","type"],
               beginDefuseWithKit: ["id","statePath","type"],
               map: ["id","statePath","type"],
               tournament: ["id"],               
            }
            break;
      }
      //default filters that are the same for each game title
      this.transactionFieldsToDelete = [
         "id", "correlationId", "seriesId"];
      this.eventFieldsToDelete = [
         "id", "includesFullState", "seriesStateDelta", "seriesState"];
      this.criteriaFilterer = filter;
      this.seriesStateAndDeltaExceptions = [];
   }

   //Available filter sets for use in bannedEventTypes
   //for now these only take in to account the events from Valorant games

   //sets of events usually grouped together in filtering
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
         "game-stopped-clock", "series-paused-game", "series-resumed-game",
      ],
      bombRelatedFilters: [
         "player-completed-plantBomb", "team-completed-plantBomb", "team-completed-defuseBomb",
         "player-completed-defuseBomb", "player-completed-beginDefuseBomb", "player-completed-reachDefuseBombCheckpoint",
         "player-completed-stopDefuseBomb", "player-completed-explodeBomb", "team-completed-explodeBomb", 
         "player-completed-beginDefuseWithKit", "player-completed-beginDefuseWithoutKit"
      ],
      combatRelatedFilters: [
         "player-revived-player", "player-selfrevived-player", "game-killed-player",
         "player-killed-player", "player-selfkilled-player", "player-teamkilled-player",
         "player-pickedUp-item", "player-dropped-item", "player-used-ability",
         "player-damaged-player", "player-selfdamaged-player", "player-teamdamaged-player"
      ],
      gameStructureRelatedFilters: [
         "team-won-series", "team-won-game", "series-started-game",
         "series-ended-game", "team-won-round", "game-started-round",
         "game-ended-round"
      ],
      pregameRelatedFilter: [
         "team-picked-map", "team-banned-map", "series-picked-map"
      ]
   };   
   
   //sets of fields usually grouped together in filtering
   actorTargetFieldfilterTemplates = {
      teamsFilters: [
         "statePath", "kills", "killAssistsReceived", 
         "killAssistsGiven", "killAssistsReceivedFromPlayer", "weaponKills", 
         "teamkills", "teamkillAssistsReceived", "teamkillAssistsGiven", 
         "teamkillAssistsReceivedFromPlayer", "weaponTeamkills", "selfkills", 
         "deaths", "objectives", "headshots", 
         "teamHeadshots"
      ],
      teamsPlayersFilters: [
         "statePath", "segmentType", "kills", 
         "killAssistsReceived", "killAssistsGiven", "killAssistsReceivedFromPlayer", 
         "weaponKills", "teamkills", "teamkillAssistsReceived", 
         "teamkillAssistsGiven", "teamkillAssistsReceivedFromPlayer", "weaponTeamkills", 
         "selfkills", "deaths", "objectives", 
         "alive", "currentArmor", "currentHealth", 
         "headshots" ,"maxHealth", "teamHeadshots"
      ]
   };
}

export enum GameTitle {
   VALORANT = 'VALORANT',
   CS2 = 'CS2'
}