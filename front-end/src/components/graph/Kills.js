import Sketch from 'react-p5';
import EventService from '../../services/EventService';
import React, { useEffect, useState } from 'react';

const Kills = () => {
  const [eventData, setEventData] = useState(null);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await EventService.getEventsNearPointBySerieId("2616320");
        console.log(data);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1000, 400).parent(canvasParentRef);
    p5.background(23, 138, 136);
  };

  const draw = p5 => {
    
    p5.clear();
    p5.background(23, 138, 136);
    if (eventData) {
      let i = 0;
      eventData.forEach(event => {
        p5.text(JSON.stringify(event.events[0].actor.state.name), 50, 50 + (25 * i));
        i++;
      });
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default Kills;
