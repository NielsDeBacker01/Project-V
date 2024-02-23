import './App.css';
import React, { Component } from "react";
import EventService from './services/EventService';
import p5 from 'p5';

class App extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      eventData: null,
      isP5Initialized: false
    };
  }

  componentDidMount() {
    this.fetchEventData();
  }

  componentDidUpdate() {
    if (this.state.eventData && !this.state.isP5Initialized) {
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

  async fetchEventData() {
    try {
      const eventData = await EventService.getEventsById("0000000");
      this.setState({ eventData });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  render() {
    const { eventData } = this.state;
    return (
      <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div ref={this.myRef}></div>
        <p>
          {this.props.text}
        </p>
        {eventData && (
          <div>
            <h2>Event Data</h2>
            <pre>{JSON.stringify(eventData)}</pre>
          </div>
        )}
      </header>
    </div>
    )
  }
}

export default App;