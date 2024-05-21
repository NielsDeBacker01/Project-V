import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';



//this graph shows the events structure for a given series id
//also supports an array of ids as input
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

  //gets the event types and actors/targets with their properties into the state
  const transformData = (data) => {
    const eventTypes = data[0].events[0].target.state.supportedEventTypes
    setEventTypes(eventTypes);

    //recursively gets all the subfields
    const processFields = (actorTarget) => {
      const processNestedFields = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
          if (Array.isArray(obj[key])) {
            return acc;
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            acc[key] = processNestedFields(obj[key]);
          } else {
            acc[key] = {};
          }
          return acc;
        }, {});
      };
      
      const type = actorTarget.type;
      const fieldsObject = processNestedFields(actorTarget.state);

      const index = actorsAndTargets.findIndex(item => Object.keys(item)[0] === type);
      if (index >= 0) {
        actorsAndTargets[index][type] = {...actorsAndTargets[index][type], ...fieldsObject};
      } else {
        const newObj = {};
        newObj[type] = fieldsObject;
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

  //converts the fields into a string array for easier displaying in the draw loop
  const formatFields = (obj, parentKey = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const fullKey = parentKey ? `${parentKey}_${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        //add the current level
        acc.push(fullKey); 
        //add nested levels
        acc.push(...formatFields(obj[key], fullKey));
      } else {
        acc.push(fullKey);
      }
      return acc;
    }, []);
  };

  return (
    //displays a loading animation while data is loading
    data ? (
      //this data visualisation doesn't work with p5js as this doesn't allow for copy pasting from the graph
      <div class="data react-p5">
        <div class="events-list">
          <h2>Types of events:</h2>
          {eventTypes.map((eventType) => (
            <p>{eventType}</p>
          ))}
        </div>
        <div class="objects-list">
          <h2>Actors/targets and their properties:</h2>
          <div>
            {actorsAndTargets.map((actorOrTarget) => {
              const key = Object.keys(actorOrTarget)[0];
              const values = formatFields(actorOrTarget[key]);
              return(<div class="object">
                <p>{key}:</p>
                <p>{values.join(", ")}</p>
              </div>
              )
            })}
          </div>

        </div>     
      </div>
    ) : (
      <div>
        <Spinner/>
      </div>
    )
  );
};

//provides a display name that will automatically be used in the sidebar
Graph.displayName = 'Event structure for ' + id;
export default Graph;