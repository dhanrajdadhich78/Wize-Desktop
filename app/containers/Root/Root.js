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
    credFilePath: this.props.credentials.length ? this.props.credentials[0] : '',
    // credFilePath: this.props.credentials.length ? `./.wizeconfig/${this.props.credentials[0]}` : '',
    credFilesArr: this.props.credentials,
    dropzoneInput: true
  };
  handleToggleAltCredFile = () => {
    if (!this.state.altCredFilePath === true) {
      // this.setState({ credFilePath: `./.wizeconfig/${this.props.credentials[0]}` });
      this.setState({ credFilePath: this.props.credentials[0] });
    }
    this.setState({ altCredFilePath: !this.state.altCredFilePath });
  };
  onCredFilesSelectChange = val => this.setState({ credFilePath: val });
  handleDropCredFile = file => this.setState({ credFilePath: file.path, dropzoneInput: false });
  handleReturnDropzoneInput = () => this.setState({
    // credFilePath: `./.wizeconfig/${this.props.credentials[0]}`,
    credFilePath: this.props.credentials[0],
    dropzoneInput: true
  });
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
        dropzoneInput={this.state.dropzoneInput}
        handleReturnDropzoneInput={() => this.handleReturnDropzoneInput()}
      />
    );
    if (!this.state.auth) {
      view = (
        <Registration
          userData={this.props.userData}
          handleRegister={(password, filePath) => this.props.handleRegister(password, filePath)}
          cachePassword={password => this.setState({ password })}
          lastCredFile={`credentials-${this.props.credentials.length}.bak`}
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
  authError: PropTypes.string,
  credentials: PropTypes.arrayOf(PropTypes.string).isRequired
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
  authError: state.auth.error,
  credentials: state.commonInfo.credentials
});

const mapDispatchToProps = dispatch => ({
  handleRegister: (password, filePath) => dispatch(actions.registration(password, filePath)),
  handleAuth: (password, filePath) => dispatch(actions.auth(password, filePath))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
