import './SidebarButton.css';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

const SidebarButton = ({ handleGraphSelect, graph, label }) => {
  let id = label.replace(/ /g, "-")
  return(  
    <button id={id} onClick={() => handleGraphSelect(graph,id)}>
      <FontAwesomeIcon icon={faChartColumn} className='icon'/>
      <p>{label}</p>
    </button>
  )
};

SidebarButton.propTypes = {
  handleGraphSelect: PropTypes.func.isRequired,
  graph: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default SidebarButton;