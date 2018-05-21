/* eslint-disable prefer-destructuring,max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveAs } from 'file-saver';

import b64toBlob from '../../utils/b64toBlob';
import FilesTableHeading from '../../components/PagesSections/FilesList/FilesTableHeading/FilesTableHeading';
import FilesTable from '../../components/PagesSections/FilesList/FilesTable/FilesTable';
import WithCustomScrollbar from '../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import PageWithInfoPanel from '../PageWithInfoPanel/PageWithInfoPanel';

import css from './FilesList.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class FilesList extends Component {
  state = {
    files: []
  };
  componentWillMount() {
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
  /*
      <div className={styles.FilesListWrapper}>
        <div className={styles.FilesListMainContent}>
          <FilesTableHeading />
          <div className={styles.TheContent}>
            <WithCustomScrollbar>
              <FilesTable
                files={this.state.files}
                handleDownload={filename => this.handleDownload(filename)}
                handleDelete={filename => this.handleDelete(filename)}
              />
            </WithCustomScrollbar>
          </div>
        </div>
        <InfoPanel />
      </div>
      */
  render() {
    return (
      <PageWithInfoPanel>
        <div
          className={[
            styles.wh100,
            styles.flexColumnAllCenter
          ].join(' ')}
        >
          <FilesTableHeading />
          <div className={styles.TheContent}>
            <WithCustomScrollbar>
              <FilesTable
                files={this.state.files}
                handleDownload={filename => this.handleDownload(filename)}
                handleDelete={filename => this.handleDelete(filename)}
              />
            </WithCustomScrollbar>
          </div>
        </div>
      </PageWithInfoPanel>
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
// export default FilesList;
