import Sketch from 'react-p5';
import EventService from '@services/EventService';
import SerieIdService from '@services/SerieIdService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

//a graph that display all kills for the members for a team over all their matches
const teamName = "Seight";
const NearPoint = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const teamId = (await SerieIdService.getTeamIdForTeam(teamName)).find(team => team.name === teamName).id;
        console.log(teamId);
        const teamMatchIds = await SerieIdService.getRecentMatchIdsForTeam(teamName);
        console.log(teamMatchIds);
        const data = await EventService.getGameKillsEventsBySerieId("cs2",teamMatchIds);
        console.log(data);
        const result = filterEventData(data, teamId);
        console.log(result);
        setEventData(result);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
  }, []);

  const filterEventData = (eventData, teamId) => {
    let killsByActor = {};
  
    eventData.forEach((event) => {
      const events = event.events;
      for(const transaction of events){
        const actorTeamId = transaction.actor.state.teamId;
        if(actorTeamId === teamId)
        {
          const actorId = transaction.actor.id;
          const kills = transaction.actor.stateDelta.series.kills;
          if (!killsByActor[actorId]) {
            const actorName = transaction.actor.state.name;
            killsByActor[actorId] = {
              name: actorName,
              kills: 0            
            };
          }   

          killsByActor[actorId].kills += kills;
        }
      }
    })

    // Convert killsByActor object to array
    const result = Object.values(killsByActor);
    result.sort((a, b) => b.kills - a.kills);
    return result;
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 300).parent(canvasParentRef);
    p5.background(255,255,255);
    p5.textSize(16);
  };

  const draw = p5 => {
    
    p5.clear();
    p5.background(255,255,255);
    if (eventData && eventData.length > 0) {
      const highestKills = eventData.reduce((maxPlayer, currentPlayer) => {
        return (currentPlayer.kills > maxPlayer.kills) ? currentPlayer : maxPlayer;
      }).kills;
      const xStart = 125;
      eventData.forEach((record,index) => {
        let teamColor = p5.color(36, 58, 255);

        p5.fill(teamColor);
        p5.text(record.name + ": " + record.kills, 25, 50 + (50 * index));

        p5.stroke(teamColor)
        p5.rect(xStart, 32 + (50 * index), (record.kills / highestKills * (800 - xStart - 25)), 25);

        p5.noStroke();
        p5.noFill();
      });
    }
  };

  return (
    eventData ? (
      <Sketch setup={setup} draw={draw} />
    ) : (
      <div>
        <Spinner/>
      </div>
    )
  );
};

NearPoint.displayName = 'Kills in ' + teamName + ' matches';
export default NearPoint;
