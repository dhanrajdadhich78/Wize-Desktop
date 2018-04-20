import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import classes from './Login.css';
import { fileImg } from '../../../assets/img/img';

const login = props => (
  <div className={classes.Login}>
    <Dropzone
      onDrop={files => props.handleDropCredFile(files[0])}
      multiple={false}
      accept=".bak"
    >
      <div className={classes.Content}>
        <h1>GHOST DRIVE ACCESS POINT</h1>
        <h2>WIZE AUTHENTICATOR</h2>
        <div className={classes.FileLine}>
          <img src={fileImg} alt="file-img" />
          <div>
            <div>
              <p>private key</p>
            </div>
            <div>
              <h2>UPLOAD YOUR PRIVTE KEY</h2>
            </div>
            <div>
              <p>only access to administrator</p>
            </div>
          </div>
        </div>
      </div>
    </Dropzone>
  </div>
);


login.propTypes = {
  handleDropCredFile: PropTypes.func.isRequired,
};

export default login;
