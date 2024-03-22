import './Sidebar.css';
import React from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';

const Sidebar = ({ onGraphSelect }) => (
  <div className="sidebar">
    <div className="head">

    </div>

    <div className="body">
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 1"} graphNumber={1}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 2"} graphNumber={2}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 3"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph with longer name"} graphNumber={1}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Kills"} graphNumber={4}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"W"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Another graph with a name that is too long"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 1"} graphNumber={1}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"W"} graphNumber={2}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 3"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 3"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 3"} graphNumber={3}></SidebarButton>
      <SidebarButton onGraphSelect={onGraphSelect} label={"Graph 3"} graphNumber={3}></SidebarButton>
    </div>
  </div>
);

Sidebar.propTypes = {
  onGraphSelect: PropTypes.func.isRequired,
};

export default Sidebar;