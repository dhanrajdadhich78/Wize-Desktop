import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Auth.css';

import PinCode from './PinCode/PinCode';
import Login from './Login/Login';
import Registration from './Registration/Registration';

class Auth extends Component {
  render() {
    return (
      <div className={classes.Auth}>
        <div className={classes.PinCode}>
          <PinCode
            password={this.props.password}
            buttonClick={val => this.props.buttonClick(val)}
            handleSubmit={() => this.props.handleAuth()}
            handleClearPassword={() => this.props.handleClearPassword()}
          />
        </div>
        <div className={classes.FileSection}>
          {
            this.props.login
              ? (
                <Login
                  handleDropCredFile={file => this.props.handleDropCredFile(file)}
                  password={this.props.password}
                />
              )
              : (
                <Registration
                  regForm={this.props.regForm}
                  handleDownload={() => this.props.handleDownload()}
                />
              )
          }
        </div>
      </div>
    );
  }
}

Auth.propTypes = {
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  handleAuth: PropTypes.func.isRequired,
  login: PropTypes.bool,
  buttonClick: PropTypes.func.isRequired,
  regForm: PropTypes.shape({}),
  handleDropCredFile: PropTypes.func,
  handleDownload: PropTypes.func,
  handleClearPassword: PropTypes.func.isRequired
};

Auth.defaultProps = {
  login: true,
  password: '',
  regForm: {},
  handleDropCredFile: () => null,
  handleDownload: () => null
};

export default Auth;
