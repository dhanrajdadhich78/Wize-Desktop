import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import classes from './XFiles.css';

import Chat from '../../components/Chat/Chat';
import InfoPanel from '../../components/InfoPanel/InfoPanel';
import WithCustomScrollbar from '../../components/UI/WithCustomScrollbar/WithCustomScrollbar';
import XFilesList from '../../components/PagesSections/XFiles/List/List';

class XFiles extends Component {
  state = {
    fileList: [
      {
        extension: 'GST',
        encryption: '256',
        options: {
          key: true,
          locked: true
        }
      },
      {
        extension: 'BVG',
        encryption: '64',
        options: {
          key: true,
          locked: false
        }
      },
      {
        extension: 'VIR',
        encryption: 'SYS',
        options: {
          key: false,
          locked: true
        }
      },
      {
        extension: 'GST',
        encryption: '256',
        options: {
          key: true,
          locked: true
        }
      },
      {
        extension: 'BVG',
        encryption: '64',
        options: {
          key: true,
          locked: false
        }
      },
      {
        extension: 'VIR',
        encryption: 'SYS',
        options: {
          key: false,
          locked: true
        }
      },
      {
        extension: 'GST',
        encryption: '256',
        options: {
          key: true,
          locked: true
        }
      },
      {
        extension: 'BVG',
        encryption: '64',
        options: {
          key: true,
          locked: false
        }
      },
      {
        extension: 'VIR',
        encryption: 'SYS',
        options: {
          key: false,
          locked: true
        }
      },
    ],
    indexOfActive: null
  };
  handleFileSelection = indexOfActive => this.setState({ indexOfActive });
  render() {
    return (
      <div className={classes.XFiles}>
        <div className={classes.Left}>
          <div className={classes.ContentWrapper}>
            <WithCustomScrollbar>
              <XFilesList
                files={this.state.fileList}
                activeFile={this.state.indexOfActive}
                onClick={index => this.handleFileSelection(index)}
              />
            </WithCustomScrollbar>
          </div>
          <div className={classes.InfoPanelWrapper}>
            <InfoPanel />
          </div>
        </div>
        <div className={classes.Right}>
          <Chat />
        </div>
      </div>
    );
  }
}

export default XFiles;
