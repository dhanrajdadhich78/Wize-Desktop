/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as FileSaver from 'file-saver';

import classes from './FilesList.css';

import b64toBlob from '../../utils/b64toBlob';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';

class FilesList extends Component {
  state = {
    files: null,
    modalContent: null,
    transferTo: null
  };
  componentDidMount() {
    this.handleGetFiles();
  }
  handleGetFiles = () => {
    const userData = this.props.userData;
    ipcRenderer.send('file:list', userData);
    ipcRenderer.on('file:your-list', (event, filesList) => this.setState({ files: filesList }));
  };
  handleDownload = filename => {
    const userData = this.props.userData;
    ipcRenderer.send('file:compile', { userData, filename });
    ipcRenderer.on('file:receive', (event, base64File) => {
      const blob = b64toBlob(base64File);
      FileSaver.default(blob, filename);
    });
  };
  hadleDelete = filename => {
    const userData = this.props.userData;
    ipcRenderer.send('file:remove', { userData, filename });
    ipcRenderer.on('file:removed', () => {
      this.handleGetFiles();
    });
  };
  handleCloseModal = () => {
    this.setState({ modalContent: null, transferTo: null });
    this.handleGetFiles();
  };
  handleTransfer = filename => {
    const userData = this.props.userData;
    const to = this.state.transferTo;
    ipcRenderer.send('file:transfer', { userData, filename, to });
  };
  render() {
    let list = <Spinner />;

    if (Array.isArray(this.state.files)) {
      if (this.state.files.length > 0) {
        list = (
          <ul className={classes.FilesList}>
            <li>
              <span>Ghost files</span>
              <span>Decryption</span>
              <span>Access</span>
              <span>Merge data</span>
              <span>Delete</span>
            </li>
            {
              this.state.files.map(({ name }, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  <span>{name}</span>
                  <span>0 %</span>
                  <span>ok</span>
                  <span>
                    <button
                      onClick={() => this.handleDownload(name)}
                    >
                      download
                    </button>
                  </span>
                  <span>
                    <button
                      onClick={() => this.hadleDelete(name)}
                    >
                      delete
                    </button>
                  </span>
                </li>
              ))
            }
          </ul>
        );
      } else {
        list = (
          <div>
            <h2>You don&apos;t have any files yet.</h2>
          </div>
        );
      }
    }

    return (
      <Aux>
        <Modal
          show={this.state.modalContent}
          modalClosed={() => this.handleCloseModal()}
        >
          { this.state.modalContent }
        </Modal>
        <div className={classes.FilesListWrapper}>
          {list}
        </div>
      </Aux>
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
