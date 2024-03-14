import './SidebarButton.css';
import React from 'react';
import PropTypes from 'prop-types';

const SidebarButton = ({ onGraphSelect, label, graphNumber }) => (
  <button onClick={() => onGraphSelect(graphNumber)}>
    <p>O</p>
    <p>{label}</p>
  </button>
);

SidebarButton.propTypes = {
  onGraphSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  graphNumber: PropTypes.number.isRequired
};

export default SidebarButton;