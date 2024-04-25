import './App.css';
import React, { Component } from "react";
import Sidebar from '../sidebar/Sidebar';
import Spinner from '../spinner/Spinner';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventData: null,
      availableGraphs: [],
      renderGraph: true,
      //default value if no graph is selected
      selectedGraph: () => {return <div className="react-p5">Select a graph to display</div>},
    };
  }

  componentDidMount() {
    //collects all components in the graph folder for use in the sidebar
    const context = require.context('../graph', true, /\.js$/);

    const graphFiles = context.keys().map((file) => {
      return {
        fileName: file.replace(/^.*[\\/]/, ''),
        component: context(file).default
      };
    });

    const graphComponents = graphFiles.map((file) => file.component);
    this.setState({ availableGraphs: graphComponents });
  }

  //handles sidebar graph selection
  handleGraphSelect = (graphComponent) => {
    this.setState({ selectedGraph: graphComponent, renderGraph: false }, () => {
      //renderGraph state has to be reset to update the render
      this.setState({renderGraph: true});
    });
  };

  render() {
    return (
      <div className="App">
        <Sidebar handleGraphSelect={this.handleGraphSelect} />
        <main className="App-main">
          <div className="content">
            {this.state.renderGraph && <this.state.selectedGraph/>}
          </div>
        </main>
      </div>
    )
  }
}

export default App;