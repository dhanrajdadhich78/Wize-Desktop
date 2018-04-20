import React from 'react';
import PropTypes from 'prop-types';

import classes from './Registration.css';
import { fileImg, logo2 } from '../../../assets/img/img';

const registration = props => (
  <div className={classes.Registration}>
    <div className={classes.Content}>
      <h1>GHOST DRIVE ACCESS POINT</h1>
      <h2>WIZE AUTHENTICATOR</h2>
      <div className={classes.Inputs}>
        <input
          type="password"
          tabIndex={-1}
          value={props.regForm.password}
          placeholder="enter password"
        />
        <input
          type="password"
          tabIndex={-1}
          value={props.regForm.repeatPassword}
          placeholder="repeat password"
        />
      </div>
      <button
        className={classes.FileLine}
        onClick={() => props.handleDownload()}
      >
        <img src={fileImg} alt="file-img" />
        <div>
          <div>
            <p>private key</p>
          </div>
          <div>
            <h2>DOWNLOAD YOUR PRIVTE KEY</h2>
          </div>
          <div>
            <p>only access to administrator</p>
          </div>
        </div>
      </button>
      <div className={classes.ImgLine}>
        <img src={logo2} alt="WizeBit" />
      </div>
    </div>
  </div>
);

registration.propTypes = {
  regForm: PropTypes.shape({
    password: PropTypes.string,
    repeatPassword: PropTypes.string
  }).isRequired,
  handleDownload: PropTypes.func.isRequired
};

export default registration;

