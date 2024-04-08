import Sketch from 'react-p5';
import EventService from '../../services/EventService';
import React, { useEffect, useState } from 'react';

const NearPoint = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await EventService.getValorantAbilityEventsFollowedByKillEventsBySerieId("2616320");
        console.log(data);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(600, 400).parent(canvasParentRef);
    p5.fill(255,255,255);
    p5.textSize(12);
  };

  const draw = p5 => {
    
    p5.clear();
    p5.background(123, 38, 36);
    if (eventData) {
      eventData.forEach((event, index) => {
        const x = 25 + (200 * Math.floor(index / 15));
        const y = 30 + (25 * (index % 15));
        if(event.events[0].action == "killed")
        {
          p5.text(event.events[0].actor.state.name + ", killed: " + event.events[0].target.state.name, x, y);
        }
        else{
          p5.text(event.events[0].actor.state.name + ", used: " + event.events[0].target.id, x, y);
        }
    });
    
    
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

NearPoint.displayName = 'Abilities causing kills';
export default NearPoint;
