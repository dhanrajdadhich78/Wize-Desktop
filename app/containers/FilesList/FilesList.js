import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as FileSaver from 'file-saver';

import classes from './FilesList.css';

import b64toBlob from '../../utils/b64toBlob';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import Heading from '../../components/UI/Heading/Heading';

class FilesList extends Component {
  state = {
    files: [],
    modalContent: null,
    transferTo: null
  };
  componentDidMount() {
    this.handleGetFiles();
  }
  handleGetFiles = () => {
    // eslint-disable-next-line prefer-destructuring
    const userData = this.props.userData;
    ipcRenderer.send('file:list', userData);
    ipcRenderer.on('file:your-list', (event, filesList) => this.setState({ files: filesList }));
  };
  handleDownload = filename => {
    // eslint-disable-next-line prefer-destructuring
    const userData = this.props.userData;
    ipcRenderer.send('file:compile', { userData, filename });
    ipcRenderer.on('file:receive', (event, base64File) => {
      const blob = b64toBlob(base64File);
      FileSaver.default(blob, filename);
    });
  };
  hadleDelete = filename => {
    // eslint-disable-next-line prefer-destructuring
    const userData = this.props.userData;
    ipcRenderer.send('file:remove', { userData, filename });
    ipcRenderer.on('file:removed', () => {
      this.handleGetFiles();
    });
  };
  handleTransferModal = filename => (
    this.setState({
      modalContent: (
        <div>
          {/*<form*/}
            {/*onSubmit={(e) => {*/}
              {/*e.preventDefault();*/}
              {/*this.handleTransfer(filename);*/}
              {/*this.handleCloseModal();*/}
            {/*}}*/}
          {/*>*/}
            {/*<input type="text" onChange={e => this.setState({ transferTo: e.target.value })} />*/}
            {/*<Button type="submit">Transfer</Button>*/}
          {/*</form>*/}
          <Heading fontWeight={200} fontSize={24} size={2}>Coming soon...</Heading>
        </div>
      )
    })
  );
  handleCloseModal = () => {
    this.setState({ modalContent: null, transferTo: null });
    this.handleGetFiles();
  };
  handleTransfer = filename => {
    // eslint-disable-next-line prefer-destructuring
    const userData = this.props.userData;
    const to = this.state.transferTo;
    ipcRenderer.send('file:transfer', { userData, filename, to });
  };
  render() {
    let list = <Spinner />;

    if (Array.isArray(this.state.files)) {
      if (this.state.files.length !== 0) {
        list = (
          <ul className={classes.FilesList}>
            <li>
              <span>Name</span>
              <span>Upload Date</span>
              <span>Size (bytes)</span>
              <span>&nbsp;</span>
              <span>Actions</span>
              <span>&nbsp;</span>
            </li>
            {
              this.state.files.map(({ name, timestamp, size }, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  <span>{name}</span>
                  <span>{new Date(timestamp * 1000).toString()}</span>
                  <span>{size}</span>
                  <span>
                    <Button
                      onClick={() => this.handleDownload(name)}
                    >
                      Download
                    </Button>
                  </span>
                  <span>
                    <Button
                      onClick={() => this.hadleDelete(name)}
                    >
                      Delete
                    </Button>
                  </span>
                  <span>
                    <Button
                      onClick={() => this.handleTransferModal(name)}
                    >
                      Transfer file
                    </Button>
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
        <div>
          <Heading fontWeight={200} fontSize={50}>Your <span>files</span> list</Heading>
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

// FilesList.defaultProps = {
//   userData: {
//     csk: null,
//     cpk: null,
//     address: null
//   }
// };

const mapStateToProps = state => ({
  userData: state.auth.userData,
  // authError: state.auth.error
});

export default connect(mapStateToProps)(FilesList);
