import './App.css';
import React, { Component } from "react";
import EventService from '../../services/EventService';
import p5 from 'p5';
import Graph from '../graph/Graph';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventData: null,
    };
  }

  componentDidMount() {
    this.fetchEventData();
  }

  async fetchEventData() {
    try {
      const eventData = await EventService.getEventsBySerieId("0000000");
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
          <Graph/>
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