import Sketch from 'react-p5';
import EventService from '@services/EventService';
import React, { useEffect, useState } from 'react';
import Spinner from '@components/spinner/Spinner';

const Graph = () => {
  //default variable to store data in
  const [data, setData] = useState(null);

  //this function is used to get the required data
  useEffect(() => {
    (async () => {
      try {
        //replace with the function you need from event service to get your data
        const data = await EventService.getValorantDefaultEventsBySerieId("0000000");
        //apply an optional extra transformation to the data for easier visualisation
        const result = transformData(data);
        //use the setData function to correctly store data in the state
        setData(result);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    })();
  }, []);

  const transformData = (data) => {
    //optionally data transform logic here
    return data;
  }; 

  //p5js example canvas setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 800).parent(canvasParentRef);
    p5.background(255,255,255);
  };

  //p5js draw loop that automatically gets called every frame
  const draw = p5 => {
    p5.clear();
    p5.background(255,255,255);
    //example to display data
    if (data) {
      //loops over each record in the data with the corresponding index given as a number (usefull for calculations)
      data.forEach((record,index) => {
        //displays the text of each record
        p5.text(record.propertyName, 25, 50 + (50 * index));
      });
    }
  };

  //displays a loading animation while data is loading
  return (
    data ? (
      <Sketch setup={setup} draw={draw} />
    ) : (
      <div>
        <Spinner/>
      </div>
    )
  );
};

//provides a display name that will automatically be used in the sidebar
Graph.displayName = 'ENTER YOUR GRAPH NAME HERE';
export default Graph;