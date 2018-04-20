import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';

import * as actions from '../../../store/actions';

import classes from './Register.css';

import Auth from '../../../components/Auth/Auth';
// import b64toBlob from '../../../utils/b64toBlob';

class Register extends Component {
  state = {
    password: '',
    regForm: {
      password: '',
      repeatPassword: ''
    }
  };
  handleOnPinCode = val => {
    if (`${this.state.password}${val}`.length <= 12) {
      this.setState({ password: this.state.password ? `${this.state.password}${val}` : val });
    }
  };
  handleSubmitAuthForm = () => {
    if (!this.state.regForm.password && this.state.password.length >= 4) {
      this.setState({
        regForm: {
          ...this.state.regForm,
          password: this.state.password
        },
        password: ''
      });
    } else if (!this.state.regForm.repeatPassword && this.state.password.length >= 4) {
      if (this.state.regForm.password === this.state.password) {
        this.props.handleRegister(this.state.regForm.password);
      }
      this.setState({
        regForm: {
          ...this.state.regForm,
          repeatPassword: this.state.password
        },
        password: ''
      });
      this.handleDownload();
    }
  };
  handleDownload = () => {
    if (this.props.encryptedData && this.props.encryptedData.length > 0) {
      const blob = new Blob([this.props.encryptedData], {
        type: 'text/plain'
      });
      const filesaver = saveAs(blob, 'credentials.bak');
      filesaver.onwriteend = () => {
        console.log('auth');
      };
    }
  };
  render() {
    return (
      <div className={classes.Register}>
        <Auth
          buttonClick={val => this.handleOnPinCode(val)}
          password={this.state.password}
          handleAuth={() => this.handleSubmitAuthForm()}
          handleDownload={() => this.handleDownload()}
          regForm={this.state.regForm}
          login={false}
        />
      </div>
    );
  }
}

Register.propTypes = {
  handleRegister: PropTypes.func.isRequired,
  encryptedData: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  encryptedData: state.auth.encryptedData,
});

const mapDispatchToProps = dispatch => ({
  handleRegister: password => dispatch(actions.registration(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
