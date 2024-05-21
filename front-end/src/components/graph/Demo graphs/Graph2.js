import React from 'react';
import Sketch from 'react-p5';

//this graph is a fake visualisation for the sake of demonstration/testing
const Graph2 = () => {
  let randomY = [];
  let numPts = 10;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 400).parent(canvasParentRef);
    p5.background(255,0,0);
    for (let i = 0; i < numPts; i++) {
      randomY.push(p5.random(100, 300));
    }
  };

  const draw = p5 => {
    drawLines(p5);
    drawEllipses(p5);
  };

  const drawEllipses = p5 => {
    p5.noStroke();

    for (let i = 0; i < randomY.length; i++) {
      const x = i * (p5.width / (numPts - 1));
      const y = randomY[i];
      p5.ellipse(x, y, 7);
    }
  };

  const drawLines = p5 => {
    p5.stroke(0);

    let px = 0;
    let py = randomY[0];

    for (let i = 0; i < randomY.length; i++) {
      const x = i * (p5.width / (numPts - 1));
      const y = randomY[i];

      p5.line(px, py, x, y);

      px = x;
      py = y;
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

Graph2.displayName = 'Fake graph 2';
export default Graph2;
