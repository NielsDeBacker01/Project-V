import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

//a graph that displays all kills for each player per team in a valorant game for the given series id
//essentially the same as the killsCSGO graph but for a valorant game
const Kills = () => {
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    (async() => {
      try {
        const data = await EventService.getGameKillsEventsBySerieId("valorant","2616320");
        console.log(data);
        const result = filterEventData(data);
        setFilteredData(result);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();    
  }, []);

  //additional transforming of the event data to make it easier to visualize
  const filterEventData = (eventData) => {
    let killsByActor = {};
  
    eventData.forEach((event) => {
      const events = event.events;
      for(const transaction of events){
        const actorId = transaction.actor.id;
        const kills = transaction.actor.stateDelta.series.kills;
    
        if (!killsByActor[actorId]) {
          const actorName = transaction.actor.state.name;
          const actorTeamId = transaction.actor.state.teamId;
          killsByActor[actorId] = {
            name: actorName,
            team: actorTeamId,
            kills: 0            
          };
        }    
        
        killsByActor[actorId].kills += kills;
      }
    });
  
    // Convert killsByActor object to array
    const result = Object.values(killsByActor);

    result.sort((a, b) => b.kills - a.kills);

    return result;
  };  

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 535).parent(canvasParentRef);
    p5.background(255,255,255);
    p5.textSize(16);
  };

  const draw = p5 => {
    
    p5.clear();
    p5.background(255,255,255);
    if (filteredData && filteredData[0].team) {
      let redTeam = filteredData[0].team;
      filteredData.forEach((record,index) => {
        let teamColor = p5.color(255,255,255);
        if(redTeam === record.team)
        {
          teamColor = p5.color(227, 41, 72);
        }
        else 
        {
          teamColor = p5.color(36, 58, 255);
        }

        p5.fill(teamColor);
        p5.text(record.name + ": " + record.kills, 25, 50 + (50 * index));

        p5.stroke(teamColor)
        p5.rect(125, 32 + (50 * index), record.kills * 13, 25);

        p5.noStroke();
        p5.noFill();
      });
    }
  };

  return (
    filteredData ? (
      <Sketch setup={setup} draw={draw} />
    ) : (
      <div>
        <Spinner/>
      </div>
    )
   );
};

Kills.displayName = 'Kills (Valorant)';
export default Kills;
