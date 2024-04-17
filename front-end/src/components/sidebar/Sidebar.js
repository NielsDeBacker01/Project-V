import './Sidebar.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';

const Sidebar = ({ handleGraphSelect }) => {
  const [availableGraphs, setAvailableGraphs] = useState([]);
  useEffect(() => {
    // Collects all components in the graph folder for use in the sidebar
    const context = require.context('../graph', true, /\.js$/);

    const graphFiles = context.keys().map((file) => ({
      fileName: file.replace(/^.*[\\/]/, ''),
      component: context(file).default
    }));

    const graphComponents = graphFiles.map((file) => file.component);
    setAvailableGraphs(graphComponents);
  }, []);

  return(
    <div className="sidebar" data-testid="sidebar">
      <div className="head">

      </div>
      {availableGraphs && (
        <div className="body">
        {availableGraphs.map((graph, index) => (
          <SidebarButton key={index} handleGraphSelect={handleGraphSelect} label={graph.displayName} graph={graph}></SidebarButton>
        ))}
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  handleGraphSelect: PropTypes.func.isRequired
};

export default Sidebar;