import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import checkValidity from '../../utils/validation';

class Auth extends Component {
  state = {
    hasData: true,
    filePath: 1,
    controls: {
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password'
        },
        label: 'Password',
        value: this.props.cachePassword ? this.props.cachePassword : '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        errorMessage: 'Password field is empty'
      }
    }
  };
  componentWillMount() {
    Object.keys(this.props.userData).map(key => {
      if (!this.props.userData[key]) {
        this.setState({ hasData: false });
      }
      return true;
    });
    if (this.props.authError && this.props.authError === 'There is no credentials file') {
      this.setState({ filePath: null });
    }
  }
  componentDidMount() {
    if ((!this.state.hasData && this.state.controls.password.value)
      && (!this.props.authError || this.props.authError !== 'There is no credentials file')) {
      this.props.handleAuth(this.state.controls.password.value);
    }
  }
  handleDrop = file => {
    this.setState({ filePath: file.path });
  };
  handleInputChange = (event, controlName) => {
    // eslint-disable-next-line max-len
    const cV = checkValidity(event.target.value, this.state.controls[controlName].validation, controlName);
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: cV.isValid,
        errorMessage: cV.errorMessage,
        touched: true
      }
    };
    this.setState({
      controls: updatedControls
    });
  };
  handleSubmitForm = e => {
    e.preventDefault();
    console.log(this.state.controls.password.value, this.state.filePath);
    this.props.handleAuth(this.state.controls.password.value, this.state.filePath !== 1 ? this.state.filePath : null);
  };
  render() {
    let content = (
      <div>
        {
          this.props.userData.csk
            ?
            (
              <div>
                <p>csk: {this.props.userData.csk}</p>
                <p>cpk: {this.props.userData.cpk}</p>
                <p>address: {this.props.userData.address}</p>
              </div>
            )
            : null
        }
      </div>
    );

    if (!this.state.hasData || (this.props.authError && this.props.authError.message !== 'There is no credentials file')) {
      content = (
        <div>
          {
            !this.state.filePath
              ? (
                <Dropzone
                  onDrop={files => this.handleDrop(files[0])}
                >
                  {/* eslint-disable-next-line max-len  */}
                  <p>Try dropping your file with credentials here, or click to select it to upload</p>
                </Dropzone>
              )
              : null
          }
          <form onSubmit={e => this.handleSubmitForm(e)}>
            <div>
              <Input
                id="password"
                value={this.state.controls.password.value}
                elementType={this.state.controls.password.elementType}
                elementConfig={this.state.controls.password.elementConfig}
                label={this.state.controls.password.label}
                changed={event => this.handleInputChange(event, 'password')}
                errorMessage={this.state.controls.password.errorMessage}
                invalid={!this.state.controls.password.valid}
                shouldValidate={this.state.controls.password.validation.required}
                touched={this.state.controls.password.touched}
              />
            </div>
            <div>
              <Button disabled={!this.state.controls.password.valid}>Login</Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div>
        <h1>Login to system</h1>
        {content}
      </div>
    );
  }
}

Auth.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  cachePassword: PropTypes.string,
  handleAuth: PropTypes.func.isRequired,
  authError: PropTypes.string
};

Auth.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  },
  cachePassword: null,
  authError: null
};

export default Auth;
