import './App.css';
import React, { Component } from "react";
import Graph1 from '../graph/Graph1';
import Graph2 from '../graph/Graph2';
import Graph3 from '../graph/Graph3';
import Sidebar from '../sidebar/Sidebar';
import Kills from '../graph/Kills';
import NearPoint from '../graph/NearPoint';

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
      case 4:
        return <Kills />;
      case 5:
        return <NearPoint />;
      default:
        return <div className="react-p5">Select a graph to display</div>;
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