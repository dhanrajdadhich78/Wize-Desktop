import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import Chat from '../../components/Chat/Chat';
import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';
import WithCustomScrollbar from '../../components/UI/WithCustomScrollbar/WithCustomScrollbar';
import XFilesList from '../../components/PagesSections/XFiles/List/List';

import css from './XFiles.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

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
    { /*
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
            <InfoPanel
              leftColumn={[
                'NewBlock',
                'NavMenu'
              ]}
              rightColumn={[
                'SecurityLayer'
              ]}
            />
          </div>
        </div>
        <div className={classes.Right}>
          <Chat />
        </div>
      </div>
    */ }
    return (
      <PageWithInfoPanel
        leftColumn={[
          'NewBlock',
          'NavMenu'
        ]}
        rightColumn={[
          'SecurityLayer'
        ]}
      >
        <div
          className={[
            styles.wh100,
            styles.flex
          ].join(' ')}
        >
          <div
            className={[
              styles.flexColumn,
              styles.justifyCenter,
              styles.h100,
              styles.flex3
            ].join(' ')}
          >
            <WithCustomScrollbar>
              <XFilesList
                files={this.state.fileList}
                activeFile={this.state.indexOfActive}
                onClick={index => this.handleFileSelection(index)}
              />
            </WithCustomScrollbar>
          </div>
          <div
            className={[
              styles.flexColumn,
              styles.justifyCenter,
              styles.h100,
              styles.flex1
            ].join(' ')}
          >
            <Chat />
          </div>
        </div>
      </PageWithInfoPanel>
    );
  }
}

export default XFiles;
