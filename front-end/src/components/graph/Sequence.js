import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

//a graph that displays all game ability events that proceed a kill event in close succession
const Sequence = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await EventService.getGameAbilityEventsFollowedByKillEventsBySerieId("valorant",["2616320","2628069"]);
        console.log(data);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1000, 600).parent(canvasParentRef);
    p5.fill(255,255,255);
    p5.textSize(12);
  };

  const draw = p5 => {
    
    p5.clear();
    p5.background(123, 38, 36);
    if (eventData) {
      eventData.forEach((event, index) => {
        const x = 25 + (200 * Math.floor(index / 23));
        const y = 30 + (25 * (index % 23));
        if(event.events[0].action === "killed")
        {
          p5.text(event.events[0].actor.state.name + ", killed: " + event.events[0].target.state.name, x, y);
        }
        else{
          p5.text(event.events[0].actor.state.name + ", used: " + event.events[0].target.id, x, y);
        }
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

Sequence.displayName = 'Abilities causing kills';
export default Sequence;
