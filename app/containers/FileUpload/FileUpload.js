import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import Dropzone from 'react-dropzone';

import classes from './FileUpload.css';

import ToggleControllers from '../../components/ToggleControllers/ToggleControllers';
import NetworkHealthInfo from '../../components/NetworkHealthInfo/NetworkHealthInfo';
import DataSpaceInfo from '../../components/DataSpaceInfo/DataSpaceInfo';

class Files extends Component {
  state = {
    progress: 0,
    loading: false,
    encryption: false,
    sharding: false,
    filePasswording: false,
    networkHealth: {
      suspicious: 3,
      total: 392
    },
    dataSpace: {
      totalNodes: 483,
      dataLeft: 100
    },
    rejected: null
  };

  onDropHandler = (accepted, rejected) => {
    // eslint-disable-next-line prefer-destructuring
    const userData = this.props.userData;
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
      .then(files => ipcRenderer.send('file:send', { userData, files }))
      .catch(error => console.log(error));
    this.hanfleFlashReject(rejected[0]);
  };
  hanfleFlashReject = file => {
    this.setState({ rejected: file.path.substring(file.path.lastIndexOf('/')) });
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
      <div>
        <ToggleControllers
          encryption={this.state.encryption}
          sharding={this.state.sharding}
          filePasswording={this.state.filePasswording}
          toggleEncryption={() => this.setState({ encryption: !this.state.encryption })}
          toggleSharding={() => this.setState({ sharding: !this.state.sharding })}
          toggleFilePass={() => this.setState({ filePasswording: !this.state.filePasswording })}
        />
        <div className={classes.DropzoneWrapper}>
          <Dropzone
            onDrop={(accepted, rejected) => this.onDropHandler(accepted, rejected)}
            maxSize={100}
          >
            <p>Drop to upload your files</p>
            {
              this.state.rejected
                ? (
                  <p style={{ color: 'red', width: '100%', textAlign: 'center' }}>
                    File <br />
                    {this.state.rejected} <br />
                    is rejeted.
                  </p>
                )
                : null
            }
          </Dropzone>
        </div>
        {progress}
        <div className={classes.NetInfo}>
          <div>
            <NetworkHealthInfo networkHealth={this.state.networkHealth} />
          </div>
          <div>
            <DataSpaceInfo dataSpace={this.state.dataSpace} />
          </div>
        </div>
      </div>
    );
  }
}

Files.propTypes = {
  // isAuth: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    csk: PropTypes.string.isRequired,
    cpk: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  // token: state.auth.authKey,
  isAuth: state.auth.authKey !== null,
  userData: state.auth.userData
});

export default connect(mapStateToProps)(Files);
