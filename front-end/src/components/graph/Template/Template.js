import Sketch from 'react-p5';
import EventService from '../../services/EventService';
import React, { useEffect, useState } from 'react';

const Graph = () => {
  /*
  THIS PART STILL HAS TO BE REWORKED
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await EventService.getValorantKillsEventsBySerieId("2661465");
        console.log(data);
        const result = filterEventData(data);
        setFilteredData(result);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
    
  }, []);

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
  */

  //p5js canvas setup
  const setup = (p5, canvasParentRef) => {
    //example canvas settings
    p5.createCanvas(800, 800).parent(canvasParentRef);
  };

  //p5js draw loop that automatically gets called every frame
  const draw = p5 => {
    
    //example to display data
    if (data) {
      //loops over each record in the data with the corresponding index given as a number (usefull for calculations)
      data.forEach((record,index) => {
        //displays the text above each other
        p5.text(record.propertyName, 25, 50 + (50 * index));
      });
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

//provides a display name that will automatically be used in the sidebar
Graph.displayName = 'ENTER YOUR GRAPH NAME HERE';
export default Graph;