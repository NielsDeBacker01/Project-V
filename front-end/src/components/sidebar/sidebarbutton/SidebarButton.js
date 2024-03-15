import './SidebarButton.css';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

const SidebarButton = ({ onGraphSelect, label, graphNumber }) => (
  <button onClick={() => onGraphSelect(graphNumber)}>
    <FontAwesomeIcon icon={faChartColumn} className='icon'/>
    <p>{label}</p>
  </button>
);

SidebarButton.propTypes = {
  onGraphSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  graphNumber: PropTypes.number.isRequired
};

export default SidebarButton;