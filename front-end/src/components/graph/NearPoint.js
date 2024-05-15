import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

const NearPoint = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await EventService.getGameEventsNearPointBySerieId("valorant","2616320");
        console.log(data);
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(600, 400).parent(canvasParentRef);
    p5.background(23, 138, 136);
    p5.fill(255,255,255);
    p5.textSize(14);
  };

  const draw = p5 => {
    p5.clear();
    p5.background(23, 138, 136);
    if (eventData) {
      eventData.forEach((event,index) => {
        p5.text(event.events[0].actor.state.name + " at: " + event.occurredAt + ", did: " + event.events[0].type, 50, 50 + (25 * index));
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

NearPoint.displayName = 'Log of events near coordinate [2000, -5000]';
export default NearPoint;
