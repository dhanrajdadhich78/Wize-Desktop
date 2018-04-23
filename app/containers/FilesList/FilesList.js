/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveAs } from 'file-saver';

import classes from './FilesList.css';

import b64toBlob from '../../utils/b64toBlob';
import FilesTableHeading from '../../components/PagesSections/FilesList/FilesTableHeading/FilesTableHeading';
import FilesTable from '../../components/PagesSections/FilesList/FilesTable/FilesTable';
import WithCustomScrolllbar from '../../components/UI/WithCustomScrollbar/WithCustomScrollbar';
import FilesInfoPanel from '../../components/PagesSections/FilesList/FilesInfoPanel/FilesInfoPanel';

class FilesList extends Component {
  state = {
    files: [
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      },
      {
        name: 1,
        size: 100500,
        date: 1550022,
      },
      {
        name: 2,
        size: 100500,
        date: 1550022,
      }
    ]
  };
  componentDidMount() {
    this.handleGetFiles();
  }
  //  request to raft through ipcRenderer, that gets file list
  handleGetFiles = () => {
    const userData = this.props.userData;
    const raftNode = `${this.props.raftNodes[0]}/key`;
    ipcRenderer.send('file:list', { userData, raftNode });
    ipcRenderer.once('file:your-list', (event, filesList) => this.setState({ files: filesList }));
  };
  //  request to raft and fs through ipcRenderer, that handles file download
  handleDownload = filename => {
    const userData = this.props.userData;
    const raftNode = `${this.props.raftNodes[0]}/key`;
    ipcRenderer.send('file:compile', { userData, filename, raftNode });
    ipcRenderer.once('file:receive', (event, base64File) => {
      const blob = b64toBlob(base64File);
      saveAs(blob, filename);
    });
  };
  //  request to raft and fs through ipcRenderer, that handles file delete
  handleDelete = filename => {
    const userData = this.props.userData;
    const raftNode = `${this.props.raftNodes[0]}/key`;
    ipcRenderer.send('file:remove', { userData, filename, raftNode });
    ipcRenderer.once('file:removed', () => {
      this.handleGetFiles();
    });
  };
  render() {
    return (
      <div className={classes.FilesListWrapper}>
        <div className={classes.FilesListMainContent}>
          <FilesTableHeading />
          <WithCustomScrolllbar>
            <FilesTable
              files={this.state.files}
              handleDownload={filename => this.handleDownload(filename)}
              handleDelete={filename => this.handleDelete(filename)}
            />
          </WithCustomScrolllbar>
        </div>
        <FilesInfoPanel />
      </div>
    );
  }
}

FilesList.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string.isRequired,
    cpk: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired,
  raftNodes: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  raftNodes: state.digest.digestInfo.raftNodes
});

export default connect(mapStateToProps)(FilesList);
