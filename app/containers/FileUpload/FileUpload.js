import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
// import axios from 'axios';
import Dropzone from 'react-dropzone';

import classes from './FileUpload.css';

import Heading from '../../components/UI/Heading/Heading';
// import Auth from "../../components/Auth/Auth";
// import { API_URL } from "../../shared/const";

class Files extends Component {
  state = {
    progress: 0,
    loading: false,
    // error: false
  };

  onDropHandler = (accepted, rejected) => {
    // this.setState({ loading: true });
    //
    // const data = new FormData();
    // data.append('file', file);
    //
    // const config = {
    //   onUploadProgress: progressEvent => {
    //     const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
    //     // do whatever you like with the percentage complete
    //     // maybe dispatch an action that will update a progress bar or something
    //     setTimeout(() => this.setState({ progress: percentCompleted }), 400);
    //   },
    //   headers: {
    //     'X-ACCESS-TOKEN': this.props.token,
    //     'Content-Type': 'multipart/form-data'
    //   }
    // };
    //
    // axios.put(`${API_URL}/api/upload-file`, data, config)
    //   .then(res => {
    //     console.log(res.data);
    //     this.setState({
    //       progress: 0,
    //       loading: false,
    //       error: false
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //     this.setState({
    //       progress: 0,
    //       loading: false,
    //       error: err.message
    //     });
    //   });
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
        <Heading fontSize={50} fontWeight={200}>Upload <span>WIZE</span> files</Heading>
        <div className={classes.DropzoneWrapper}>
          <Dropzone
            onDrop={(accepted, rejected) => this.onDropHandler(accepted, rejected)}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        {progress}
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
