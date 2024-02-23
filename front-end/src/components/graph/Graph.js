import React, { Component } from "react";
import p5 from 'p5';

class Graph extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isP5Initialized: false
    };
  }

  componentDidUpdate() {
    if (!this.state.isP5Initialized) {
      this.initP5();
      this.setState({ isP5Initialized: true });
    }
  }

  initP5() {
    this.myP5 = new p5(this.sketch, this.myRef.current);
  }
  
  sketch(p) {
    p.setup = () => {
      p.createCanvas(400, 400);
      p.background(220);
    };

    p.draw = () => {
      p.fill(255, 0, 0);
      p.ellipse(200, 200, 50, 50);
    };
  }

  render() {
    return (
      <div ref={this.myRef}></div>
    )
  }
}

export default Graph;