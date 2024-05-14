import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

const id = "2671505"
const Graph = () => {
  //default variable to store data in
  const [data, setData] = useState(null);
  const [eventTypes, setEventTypes] = useState(null);

  //this function is used to get the required data
  useEffect(() => {
    (async () => {
      try {
        const data = await EventService.getGameUnfilteredEventsBySerieId(id);
        transformData(data);
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
  }, []);

  const transformData = (data) => {
    setEventTypes(data[0].events[0].target.state.supportedEventTypes);
  }; 

  //p5js example canvas setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1000, 1000).parent(canvasParentRef);
    p5.background(255,255,255);
    p5.fill(0,0,0);
  };

  //p5js draw loop that automatically gets called every frame
  const draw = p5 => {
    p5.clear();
    p5.background(255,255,255);
    if (eventTypes) {
      p5.textSize(20);
      p5.textAlign(p5.CENTER);
      p5.text("Types of events: " + eventTypes.length, 120, 25);
      p5.textSize(12);
      eventTypes.forEach((eventType, index) => {
        p5.text(eventType, 120, 50 + (15 * index));
      });
    }
  };

  //displays a loading animation while data is loading
  return (
    data ? (
      <Sketch setup={setup} draw={draw} />
    ) : (
      <div className='react-p5'>
        <Spinner/>
      </div>
    )
  );
};

//provides a display name that will automatically be used in the sidebar
Graph.displayName = 'Event structure for ' + id;
export default Graph;