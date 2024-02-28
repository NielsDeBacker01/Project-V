import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ onGraphSelect }) => (
  <div className="sidebar">
    <button onClick={() => onGraphSelect(1)}>Graph 1</button>
    <button onClick={() => onGraphSelect(2)}>Graph 2</button>
    <button onClick={() => onGraphSelect(3)}>Graph 3</button>
  </div>
);

Sidebar.propTypes = {
  onGraphSelect: PropTypes.func.isRequired,
};

export default Sidebar;