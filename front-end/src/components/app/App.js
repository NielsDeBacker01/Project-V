import './App.css';
import React, { Component } from "react";
import EventService from '../../services/EventService';
import Graph1 from '../graph/Graph1';
import Graph2 from '../graph/Graph2';
import Graph3 from '../graph/Graph3';
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
      case 1:
        return <Graph1 />;
      case 2:
        return <Graph2 />;
      case 3:
        return <Graph3 />;
      default:
        return <div class="react-p5">Select a graph to display</div>;
    }
  }

  componentDidMount() {
    this.fetchEventData();
  }

  async fetchEventData() {
    try {
      //const eventData = await EventService.getDefaultEventsBySerieId("0000000");
      //const eventData = await EventService.getKillsEventsBySerieId("2616320");
      const eventData = await EventService.getEventsNearPointBySerieId("2616320");
      //const eventData = await EventService.getPlayerEventsBySerieId("2616320");
      //const eventData = await EventService.getPlayerAgainstPlayerEventsBySerieId("2616320");
      //const eventData = await EventService.getItemsAndAbilitiesEventsBySerieId("2616320");
      //const eventData = await EventService.getEventsBySerieId("2616320");
      this.setState({ eventData });
      console.log(eventData)
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  render() {
    return (
      <div className="App">
        <Sidebar onGraphSelect={this.handleGraphSelect} />
        <main className="App-main">

          <div className="content">
            {this.getSelectedGraph()}
          </div>

        </main>
      </div>
    )
  }
}

export default App;