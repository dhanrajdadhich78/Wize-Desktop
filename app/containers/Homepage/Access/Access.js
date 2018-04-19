import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import classes from './Access.css';

import Auth from '../../../components/Auth/Auth';

class Access extends Component {
  state = {
    password: null,
    altCredFilePath: false,
    credFilePath: this.props.credentials.length ? this.props.credentials[0] : '',
    credFilesArr: this.props.credentials,
    dropzoneInput: true
  };
  handleOnPinCode = val => {
    if (this.state.password) {
      this.setState({ password: this.state.password ? `${this.state.password}${val}` : val });
    }
  };
  render() {
    return (
      <div className={classes.Access}>
        <Auth
          buttonClick={val => this.handleOnPinCode(val)}
          authError={this.props.authError}
          cachePassword={this.state.password}
          userData={this.props.userData}
          handleAuth={(password, filePath) => (
            this.props.handleAuth(password, filePath)
          )}
          altCredFilePath={this.state.altCredFilePath}
          handleToggleAltCredFile={() => this.handleToggleAltCredFile()}
          credFilePath={this.state.credFilePath}
          handleDropCredFile={file => this.handleDropCredFile(file)}
          credFilesArr={this.state.credFilesArr}
          onCredFilesSelectChange={val => this.onCredFilesSelectChange(val)}
          dropzoneInput={this.state.dropzoneInput}
          handleReturnDropzoneInput={() => this.handleReturnDropzoneInput()}
          lastCredFile={`credentials-${this.props.credentials.length}.bak`}
        />
      </div>
    );
  }
}

Access.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  handleAuth: PropTypes.func.isRequired,
  authError: PropTypes.string,
  credentials: PropTypes.arrayOf(PropTypes.string).isRequired,
  getCredFilesList: PropTypes.func.isRequired
};

Access.defaultProps = {
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
  handleAuth: (password, filePath) => (
    dispatch(actions.auth(password, filePath))
  ),
  getCredFilesList: () => dispatch(actions.getCredFilesList())
});

export default  connect(mapStateToProps, mapDispatchToProps)(Access);
