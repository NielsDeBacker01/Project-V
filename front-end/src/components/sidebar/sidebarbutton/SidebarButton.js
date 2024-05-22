import './SidebarButton.css';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

//generates a button for the sidebar based on the given info, usually done from sidebar component
const SidebarButton = ({ handleGraphSelect, graph, label, index }) => {
  let id = label.replace(/ /g, "-");
  id += "-" + index;
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
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default SidebarButton;