import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ onGraphSelect }) => (
  <div className="sidebar">
    <button onClick={() => onGraphSelect(0)}>Graph 1</button>
    <button onClick={() => onGraphSelect(1)}>Graph 2</button>
  </div>
);

Sidebar.propTypes = {
  onGraphSelect: PropTypes.func.isRequired,
};

export default Sidebar;