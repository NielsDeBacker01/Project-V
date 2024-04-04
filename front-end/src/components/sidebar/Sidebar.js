import './Sidebar.css';
import React from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';

const Sidebar = ({ handleGraphSelect, availableGraphs }) => (
  <div className="sidebar">
    <div className="head">

    </div>

    <div className="body">
      {availableGraphs.map((graph, index) => (
        <SidebarButton key={index} handleGraphSelect={handleGraphSelect} label={graph.displayName} graph={graph}></SidebarButton>
      ))}
    </div>
  </div>
);

Sidebar.propTypes = {
  handleGraphSelect: PropTypes.func.isRequired,
  availableGraphs: PropTypes.array.isRequired
};

export default Sidebar;