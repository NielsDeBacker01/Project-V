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
        return <div>Select a graph to display</div>;
    }
  }

  componentDidMount() {
    this.fetchEventData();
  }

  async fetchEventData() {
    try {
      const priceFilter = (price) => (item) => item.price <= price;
      const nameFilter = (name) => (item) => item.name.toLowerCase().includes(name.toLowerCase());
      const criteria = {priceFilter, nameFilter};

      //const eventData = await EventService.getEventsBySerieId("0000000");
      const eventData = await EventService.getKillsEventsBySerieId("0000000");
      //const eventData = await EventService.getEventsBySerieId("2616320");
      this.setState({ eventData });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  render() {
    const { eventData } = this.state;
    return (
      <div className="App">
        <Sidebar onGraphSelect={this.handleGraphSelect} />
        <main className="App-main">

          <div className="content">
            <h2>Graph</h2>
            {this.getSelectedGraph()}
          </div>

          {eventData && (
            <div>
              <h2>Event Data</h2>
              <pre>{JSON.stringify(eventData, null, 2)}</pre>
            </div>
          )}

        </main>
      </div>
    )
  }
}

export default App;