import './Sidebar.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ handleGraphSelect }) => {
  const [availableGraphs, setAvailableGraphs] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    //gets all components in the graph folder for use in the sidebar
    const context = require.context('../graph', true, /\.js$/);
    const graphFiles = context.keys().map((file) => ({
      folderName: file.split('/').reverse()[1],
      component: context(file).default
    }));
    setAvailableGraphs(graphFiles);

    //get list of real folders
    const filteredList = graphFiles.filter(item => item.folderName !== '.' && item.folderName !== 'Template');
    const uniqueNames = new Set(filteredList.map(item => item.folderName));
    setFolders(Array.from(uniqueNames).sort((a, b) => a.localeCompare(b)));
  }, []);

  return(
    <div className="sidebar" data-testid="sidebar">
      <div className="head">
      </div>

      {availableGraphs && folders && (
        <div className="body">
          {/* Renders the graphs relative to their corresponding folder*/}
          {folders.map((folder, index) => (
            <div className="folder" key={index}>
              <div className="folderLevel">
                <FontAwesomeIcon icon={faCaretDown} className='icon'/>
                <p className="folderTitle" key={index}>{folder}:</p>
              </div>
              {renderGraphsinFolder(folder)}
            </div>
          ))}
          {/* Renders the remaining graphs that are not in a folder */}
          {renderGraphsinFolder(".")}
        </div>
      )}

    </div>
  );

  function renderGraphsinFolder(folder) {
    return (
      <div className="folderContent" key={folder}>
        {availableGraphs.map((graph, index) => (
          graph.folderName === folder && (
            <SidebarButton key={index} handleGraphSelect={handleGraphSelect} label={graph.component.displayName} graph={graph.component}/> 
          )
        ))}
      </div>
    );
  }
};

Sidebar.propTypes = {
  handleGraphSelect: PropTypes.func.isRequired
};

export default Sidebar;