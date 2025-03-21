import './Sidebar.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SidebarButton from './sidebarbutton/SidebarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ handleGraphSelect }) => {
  const [availableGraphs, setAvailableGraphs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderVisibility, setFolderVisibility] = useState([]);
  const [sidebarVisibility, setSidebarVisibility] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState();

  //initialization logic for sidebar
  useEffect(() => {
    //gets all components in the graph folder for use in the sidebar
    const context = require.context('../graph', true, /\.js$/);
    const graphFiles = context.keys().map((file) => ({
      folderName: file.split('/').reverse()[1],
      component: context(file).default
    }));
    setAvailableGraphs(graphFiles);

    //get list of real folders that will be used in the sidebar
    const filteredList = graphFiles.filter(item => item.folderName !== '.' && item.folderName !== 'Template');
    const uniqueNames = new Set(filteredList.map(item => item.folderName));
    setFolders(Array.from(uniqueNames).sort((a, b) => a.localeCompare(b)));

    //create a list of booleans for toggling of folders
    const folderVisibilities = Array(uniqueNames.size + 1).fill(false);
    folderVisibilities[uniqueNames.size] = true;
    setFolderVisibility(folderVisibilities);
  }, []);

  //gets called every time the selectedGraph changes
  useEffect(() => {
    // Apply style to a selected graph
    if(selectedGraph){
      const newElement = document.getElementById(selectedGraph);
      if (newElement) {
        newElement.style.borderColor = 'white';
      }
    }
  }, [selectedGraph]);

  const toggleFolderVisibility = (index) => {
    const updatedVisibility = [...folderVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setFolderVisibility(updatedVisibility);
  };

  const toggleSidebarVisibility = () => {
    setSidebarVisibility(!sidebarVisibility);
  };

  const handleGraphSelectSidebar = (graphComponent, label) => {
    handleGraphSelect(graphComponent);

    //remove style from old selected graph before updating
    if(selectedGraph)
    {
      const oldElement = document.getElementById(selectedGraph);
      if (oldElement) {
        oldElement.style.borderColor = '';
      }  
    }
    setSelectedGraph(label);
  }

  return(
    sidebarVisibility ? (
      //open sidebar html
      <div className="sidebar" data-testid="sidebar">
        <div className="head">
          <div className="bar-toggle close" onClick={() => toggleSidebarVisibility()}>
            <FontAwesomeIcon icon={faAnglesLeft} className='icon'/>
          </div>
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
    ) : (
      //closed sidebar html
      <div className="bar-toggle open" onClick={() => toggleSidebarVisibility()}>
        <FontAwesomeIcon icon={faAnglesRight} className='icon'/>
      </div>
    )
  );

  //renders graph buttons for a certain folder
  function renderGraphsinFolder(folder, index) {
    return (
      //this div holds the css logic to be hidden when a folder is collapsed
      <div className={`folderContent ${folderVisibility[index] ? '' : 'hidden'}`} key={index}>
        {availableGraphs.map((graph, index) => (
          graph.folderName === folder && (
            <SidebarButton key={index} handleGraphSelect={handleGraphSelectSidebar} label={graph.component.displayName} index={index} graph={graph.component}/> 
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