import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import classes from './Access.css';

import Auth from '../../../components/Auth/Auth';

class Access extends Component {
  state = {
    password: '',
    credFilePath: '',
    dropzoneAlert: false
  };
  handleOnPinCode = val => {
    if (`${this.state.password}${val}`.length <= 12) {
      this.setState({ password: this.state.password ? `${this.state.password}${val}` : val });
    }
  };
  handleDropCredFile = file => this.setState({ credFilePath: file.path, dropzoneAlert: false });
  handleSubmitAuthForm = () => {
    if (this.state.password && this.state.password >= 4 && this.state.credFilePath) {
      this.props.handleAuth(this.state.password, this.state.credFilePath);
    } else if (!this.state.credFilePath) {
      this.setState({ dropzoneAlert: true });
      setTimeout(() => this.setState({ dropzoneAlert: false }), 5000);
    }
    console.log(this.state.password, this.state.credFilePath);
  };
  render() {
    return (
      <div className={classes.Access}>
        <Auth
          buttonClick={val => this.handleOnPinCode(val)}
          handleDropCredFile={file => this.handleDropCredFile(file)}
          password={this.state.password}
          handleAuth={() => this.handleSubmitAuthForm()}
          dropzoneAlert={this.state.dropzoneAlert}
        />
      </div>
    );
  }
}

Access.propTypes = {
  handleAuth: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(Access);
