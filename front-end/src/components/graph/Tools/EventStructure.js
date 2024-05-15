import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

const id = "2671505"
const Graph = () => {
  //default variable to store data in
  const [data, setData] = useState(null);
  const [eventTypes, setEventTypes] = useState(null);
  const [actorsAndTargets, setActorsAndTargets] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await EventService.getGameUnfilteredEventsBySerieId(id);
        console.log(data);
        setData(data);
        transformData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const transformData = (data) => {
    const eventTypes = data[0].events[0].target.state.supportedEventTypes
    setEventTypes(eventTypes);

    const processFields = (actorTarget) => {
      const type = actorTarget.type;
      const fields = Object.keys(actorTarget.state);

      const fieldsObject = fields.reduce((acc, field) => {
        acc[field] = {};
        return acc;
      }, {});

      const index = actorsAndTargets.findIndex(item => Object.keys(item)[0] === type);
      if (index >= 0) {
        actorsAndTargets[index][type] = {...actorsAndTargets[index][type], ...fieldsObject};
      } else {
        const newObj = {};
        newObj[type] = fieldsObject;
        console.log(newObj);
        actorsAndTargets.push(newObj);
      }
    };

    let actorsAndTargets = [];
    data.forEach((event) => {
      event.events.forEach((transaction) => {
        processFields(transaction.actor);
        processFields(transaction.target);
      });
    });

    setActorsAndTargets(actorsAndTargets);
    //log for copy pasting
    console.log(actorsAndTargets);
    console.log(eventTypes);
  };

  //p5js example canvas setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1200, 1000).parent(canvasParentRef);
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

    p5.line(240, 0, 240, 1000)

    if (actorsAndTargets) {
      p5.textSize(20);
      p5.textAlign(p5.LEFT);
      p5.text("Actors/targets and their properties:", 250, 25);
      p5.textSize(12);
      actorsAndTargets.forEach((actorOrTarget, index) => {
        const key = Object.keys(actorOrTarget)[0];
        const values = Object.keys(actorOrTarget[key]).join(", ");
        p5.text(`${key}: ${values}`, 250, 50 + (15 * index));
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