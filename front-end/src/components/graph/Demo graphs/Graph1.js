import React from 'react';
import Sketch from 'react-p5';

const Graph1 = () => {
  let scale = 1;
  let randomY = [];
  let numPts = 25;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400 * scale, 400 * scale).parent(canvasParentRef);
    p5.background(220);
    for (let i = 0; i < numPts; i++) {
      randomY.push(p5.random(100, 300));
    }
  };

  const draw = p5 => {
    p5.scale(scale);
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

Graph1.displayName = 'Fake graph 1';
export default Graph1;
