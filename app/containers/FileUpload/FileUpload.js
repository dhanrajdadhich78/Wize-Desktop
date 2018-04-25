/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import Dropzone from 'react-dropzone';

import classes from './FileUpload.css';
import { uploadIcon } from '../../assets/img/img';
import VertivalLineV from '../../components/UI/VerticalLineV/VerticalLineV';
import InfoPanel from '../../components/InfoPanel/InfoPanel';

class Files extends Component {
  state = {
    loading: false,
    progress: 0,
    rejected: null
  };

  handleOnDrop = (accepted, rejected) => {
    if (this.props.digestInfo.storageNodes.length >= 3) {
      // eslint-disable-next-line prefer-destructuring
      const userData = this.props.userData;
      const digestServers = [];
      for (let i = 0; i < 3; i++) {
        digestServers.push(`${this.props.digestInfo.storageNodes[i]}/buckets`);
      }
      const raftNode = `${this.props.raftNodes[0]}/key`;
      const timestamp = Math.round(+new Date() / 1000);
      const promises = _.map(accepted, file => (new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => resolve({
          name: file.name,
          size: file.size,
          data: event.target.result,
          timestamp
        });
      })));
      Promise.all(promises)
        .then(files => ipcRenderer.send('file:send', {
          userData,
          files,
          digestServers,
          raftNode
        }))
        .catch(error => console.log(error));
      if (rejected.length) {
        this.hanfleFlashReject(rejected[0]);
      }
      // eslint-disable-next-line no-alert
    } else { alert('You don\'t have enough storage nodes'); }
  };
  hanfleFlashReject = file => {
    this.setState({ rejected: file.path.substring(file.path.lastIndexOf('/') + 1) });
    setTimeout(() => this.setState({ rejected: null }), 5000);
  };
  render() {
    let progress = null;
    if (this.state.loading) {
      progress = (
        <div className={classes.ProgressBar}>
          <div className={classes.ProgressLine} style={{ width: `${this.state.progress}%` }} />
          <div className={classes.Percentage}>
            { this.state.progress !== 100 ? `${this.state.progress}%` : 'Sending...' }
          </div>
        </div>
      );
    }
    return (
      <div className={classes.FilesUpload}>
        <div className={classes.DropzoneWrapper}>
          <Dropzone
            onDrop={(accepted, rejected) => this.handleOnDrop(accepted, rejected)}
            maxSize={102400000}
          >
            {
              !this.state.rejected
                ? (
                  <div>
                    <img src={uploadIcon} alt="Drop to upload your files" />
                    <p>UPLOAD FILE</p>
                  </div>
                )
                : (
                  <p style={{ color: 'red', width: '100%', textAlign: 'center' }}>
                    File <br />
                    {this.state.rejected} <br />
                    is rejeted.
                  </p>
                )
            }
          </Dropzone>
          <VertivalLineV count={7} />
          <VertivalLineV count={7} />
        </div>
        <InfoPanel />
        {progress}
      </div>
    );
  }
}

Files.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string.isRequired,
    cpk: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired,
  digestInfo: PropTypes.shape().isRequired,
  raftNodes: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.authKey !== null,
  userData: state.auth.userData,
  digestInfo: state.digest.digestInfo,
  raftNodes: state.digest.digestInfo.raftNodes
});

export default connect(mapStateToProps)(Files);
