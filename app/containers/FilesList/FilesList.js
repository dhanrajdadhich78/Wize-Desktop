/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as FileSaver from 'file-saver';

import classes from './FilesList.css';

import b64toBlob from '../../utils/b64toBlob';
import FilesTable from '../../components/PagesSections/FilesList/FilesTable/FilesTable';

class FilesList extends Component {
  state = {
    files: null,
    // transferTo: null
  };
  componentDidMount() {
    this.handleGetFiles();
  }
  //  request to raft through ipcRenderer, that gets file list
  handleGetFiles = () => {
    const userData = this.props.userData;
    ipcRenderer.send('file:list', userData);
    ipcRenderer.on('file:your-list', (event, filesList) => this.setState({ files: filesList }));
  };
  //  request to raft and fs through ipcRenderer, that handles file download
  handleDownload = filename => {
    const userData = this.props.userData;
    ipcRenderer.send('file:compile', { userData, filename });
    ipcRenderer.on('file:receive', (event, base64File) => {
      const blob = b64toBlob(base64File);
      FileSaver.default(blob, filename);
    });
  };
  //  request to raft and fs through ipcRenderer, that handles file delete
  handleDelete = filename => {
    const userData = this.props.userData;
    ipcRenderer.send('file:remove', { userData, filename });
    ipcRenderer.on('file:removed', () => {
      this.handleGetFiles();
    });
  };
  // handleCloseModal = () => {
  //   this.setState({ modalContent: null, transferTo: null });
  //   this.handleGetFiles();
  // };
  // handleTransfer = filename => {
  //   const userData = this.props.userData;
  //   const to = this.state.transferTo;
  //   ipcRenderer.send('file:transfer', { userData, filename, to });
  // };
  render() {
    return (
      <div className={classes.FilesListWrapper}>
        <FilesTable
          files={this.state.files}
          handleDownload={filename => this.handleDownload(filename)}
          handleDelete={filename => this.handleDelete(filename)}
        />
      </div>
    );
  }
}

FilesList.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string.isRequired,
    cpk: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  userData: state.auth.userData
});

export default connect(mapStateToProps)(FilesList);
