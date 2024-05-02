import React from 'react';
import Sketch from 'react-p5';

const Graph3 = () => {
  let randomY = [];
  let numPts = 100;

  const setup = (p5, canvasParentRef) => {
    //this is slightly too wide causing it to go off screen
    p5.createCanvas(2000, 2000).parent(canvasParentRef);
    p5.background(255,204,0);
    for (let i = 0; i < numPts; i++) {
      randomY.push(p5.random(100, 300));
    }
  };

  const draw = p5 => {
    p5.strokeWeight(10);
    p5.stroke(4, 214, 137);
    p5.line(0, 0, 1600, 400);
  };

  return <Sketch setup={setup} draw={draw} />;
};

Graph3.displayName = 'Graph 3 (Big)';
export default Graph3;
