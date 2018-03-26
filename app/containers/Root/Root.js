import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

import classes from './Root.css';

import Auth from '../../components/Auth/Auth';
import Registration from '../../components/Auth/Registration/Registration';

class Root extends Component {
  state = {
    auth: true,
    password: null,
    altCredFilePath: false,
    credFilePath: './.wizeconfig/credentials-0.bak',
    credFilesArr: [
      {
        value: './.wizeconfig/credentials-0.bak',
        displayValue: 0
      },
      {
        value: './.wizeconfig/credentials-1.bak',
        displayValue: 1
      }
    ]
  };
  handleToggleAltCredFile = () => this.setState({ altCredFilePath: !this.state.altCredFilePath });
  onCredFilesSelectChange = val => this.setState({ credFilePath: val });
  handleDropCredFile = file => this.setState({ credFilePath: file.path });
  render() {
    let view = (
      <Auth
        authError={this.props.authError}
        cachePassword={this.state.password}
        userData={this.props.userData}
        handleAuth={(password, filePath) => this.props.handleAuth(password, filePath)}
        altCredFilePath={this.state.altCredFilePath}
        handleToggleAltCredFile={() => this.handleToggleAltCredFile()}
        credFilePath={this.state.credFilePath}
        handleDropCredFile={file => this.handleDropCredFile(file)}
        credFilesArr={this.state.credFilesArr}
        onCredFilesSelectChange={val => this.onCredFilesSelectChange(val)}
      />
    );
    if (!this.state.auth) {
      view = (
        <Registration
          userData={this.props.userData}
          handleRegister={password => this.props.handleRegister(password)}
          cachePassword={password => this.setState({ password })}
        />
      );
    }
    return (
      <div className={classes.Root}>
        <label className={classes.preorderListTrigger} htmlFor="auth-toggle">
          <div>Auth</div>
          <input
            type="checkbox"
            checked={!this.state.auth}
            onChange={() => { this.setState({ auth: !this.state.auth }); }}
            id="auth-toggle"
          />
          <span />
          <div>Register</div>
        </label>
        {view}
      </div>
    );
  }
}

Root.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  handleRegister: PropTypes.func.isRequired,
  handleAuth: PropTypes.func.isRequired,
  authError: PropTypes.string
};

Root.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  },
  authError: null
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  authError: state.auth.error
});

const mapDispatchToProps = dispatch => ({
  handleRegister: password => dispatch(actions.registration(password)),
  handleAuth: (password, filePath) => dispatch(actions.auth(password, filePath))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
