import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import { ipcRenderer } from 'electron';

import * as actions from '../../../store/actions';

import classes from './Register.css';

import Auth from '../../../components/Auth/Auth';

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
      return new Promise(resolve => {
        if (this.props.encryptedData) {
          resolve();
        }
        setInterval(() => {
          if (this.props.encryptedData) {
            resolve();
          }
        }, 400);
      })
        .then(() => this.handleDownload());
    }
  };
  handleDownload = () => {
    const blob = new Blob([this.props.encryptedData], {
      type: 'text/plain'
    });
    const filesaver = saveAs(blob, 'credentials.bak');
    filesaver.onwriteend = () => {
      ipcRenderer.send('crypto:decrypt-credentials', {
        string: this.props.encryptedData,
        password: this.state.regForm.password
      });
      ipcRenderer.once('crypto:decrypted-credentials', (event, credentials) => {
        const creds = JSON.parse(credentials);
        if (creds.csk && creds.cpk && creds.address) {
          this.props.authSuccess(creds);
        }
      });
    };
    return filesaver;
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
  encryptedData: PropTypes.string.isRequired,
  authSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  encryptedData: state.auth.encryptedData,
});

const mapDispatchToProps = dispatch => ({
  handleRegister: password => dispatch(actions.registration(password)),
  authSuccess: data => dispatch(actions.authSuccess(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
