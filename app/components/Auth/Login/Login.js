import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import { fileImg } from '../../../assets/img/img';
import css from './Login.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const login = props => (
  <div className={styles.Login}>
    <Dropzone
      onDrop={files => props.handleDropCredFile(files[0])}
      multiple={false}
      accept=".bak"
    >
      <div className={styles.Content}>
        <h1>GHOST ACCESS</h1>
        <h2>WIZE BLOCKCHAIN AUTHENTICATOR</h2>
        <div
          className={styles.InnerTextWrapper}
        >
          <div className={styles.flexBetweenCenter}>
            <div className={styles.FileLine}>
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
        </div>
      </div>
    </Dropzone>
    <div
      className={[
        styles.PassWrapper,
        styles.inputWithLine
      ].join(' ')}
    >
      <input
        tabIndex={-1}
        type="text"
        className={[
          styles.w100,
          styles.dontTouchMe
          ].join(' ')}
        value={props.password}
        placeholder="enter password"
      />
    </div>
    {/*
        <input
          type="text"
          className={styles.w100}
        />
        */}
  </div>
);


login.propTypes = {
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  handleDropCredFile: PropTypes.func.isRequired,
};

export default login;
