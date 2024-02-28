import './App.css';
import React, { Component } from "react";
import EventService from '../../services/EventService';
import Graph1 from '../graph/Graph1';
import Graph2 from '../graph/Graph2';
import Sidebar from '../sidebar/Sidebar';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventData: null,
      selectedGraph: null,
    };

    this.handleGraphSelect = this.handleGraphSelect.bind(this);
  }

  handleGraphSelect(index) {
    this.setState({ selectedGraph: index });
  }

  getSelectedGraph() {
    switch (this.state.selectedGraph) {
      case 0:
        return <Graph1 />;
      case 1:
        return <Graph2 />;
      default:
        return <div>Select a graph to display</div>;
    }
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
      <main className="App">
        <Sidebar onGraphSelect={this.handleGraphSelect} />
        <body className="App-body">

          <div className="content">
            <h2>Graph</h2>
            {this.getSelectedGraph()}
          </div>

          {eventData && (
            <div>
              <h2>Event Data</h2>
              <pre>{JSON.stringify(eventData)}</pre>
            </div>
          )}
        </body>
      </main>
    )
  }
}

export default App;