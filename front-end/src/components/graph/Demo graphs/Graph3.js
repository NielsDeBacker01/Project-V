import React from 'react';
import Sketch from 'react-p5';

const Graph3 = () => {
  let randomY = [];
  let numPts = 100;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(1200, 400).parent(canvasParentRef);
    p5.background(255,204,0);
    for (let i = 0; i < numPts; i++) {
      randomY.push(p5.random(100, 300));
    }
  };

  const draw = p5 => {
    p5.strokeWeight(10);
    p5.stroke(4, 214, 137);
    drawLines(p5);

    p5.strokeWeight(5);
    p5.stroke(0, 183, 186);
    drawLines(p5);
  };

  const drawLines = p5 => {
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

Graph3.displayName = 'Fake graph 3';
export default Graph3;
