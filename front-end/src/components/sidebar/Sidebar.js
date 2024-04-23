import './Sidebar.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ handleGraphSelect }) => {
  const [availableGraphs, setAvailableGraphs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderVisibility, setFolderVisibility] = useState([]);

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

    const folderVisibilities = Array(uniqueNames.size + 1).fill(false);
    folderVisibilities[uniqueNames.size] = true;
    setFolderVisibility(folderVisibilities);
  }, []);

  const toggleFolderVisibility = (index) => {
    const updatedVisibility = [...folderVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setFolderVisibility(updatedVisibility);
    console.log(folderVisibility);
  };

  return(
    <div className="sidebar" data-testid="sidebar">
      <div className="head">
      </div>

      {availableGraphs && folders && (
        <div className="body">
          {/* Renders the graphs relative to their corresponding folder*/}
          {folders.map((folder, index) => (
            <div className="folder" key={index}>
              <div className="folderLevel" onClick={() => toggleFolderVisibility(index)}>
                <FontAwesomeIcon icon={folderVisibility[index] ? faCaretDown : faCaretRight} className='icon'/>
                <p className="folderTitle" key={index}>{folder}:</p>
              </div>
              {renderGraphsinFolder(folder, index)}
            </div>
          ))}
          {/* Renders the remaining graphs that are not in a folder */}
          {renderGraphsinFolder(".", folders.length)}
        </div>
      )}

    </div>
  );

  function renderGraphsinFolder(folder, index) {
    return (
      <div className={`folderContent ${folderVisibility[index] ? '' : 'hidden'}`} key={index}>
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