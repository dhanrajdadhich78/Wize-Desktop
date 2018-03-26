import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import checkValidity from '../../utils/validation';
import Heading from '../UI/Heading/Heading';
import ToggleCredFiles from './ToggleCredFiles/ToggleCredFiles';

class Auth extends Component {
  state = {
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
  }
  componentDidMount() {
    if ((!this.state.hasData && this.state.controls.password.value)
      && (!this.props.authError || this.props.authError !== 'There is no credentials file')) {
      this.props.handleAuth(this.state.controls.password.value);
    }
  }
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
    //  eslint-disable-next-line max-len
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
          <ToggleCredFiles
            altCredFilePath={this.props.altCredFilePath}
            handleToggleAltCredFile={() => this.props.handleToggleAltCredFile()}
            credFilePath={this.props.credFilePath}
            handleDropCredFile={file => this.props.handleDropCredFile(file)}
            credFilesArr={this.props.credFilesArr}
            onCredFilesSelectChange={val => this.props.onCredFilesSelectChange(val)}
          />
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

    if (this.props.userData.csk && this.props.userData.cpk && this.props.userData.address) {
      content = <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <Heading fontSize={50} fontWeight={200}>Log<span>in</span> to system</Heading>
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
  authError: PropTypes.string,
  altCredFilePath: PropTypes.bool.isRequired,
  handleToggleAltCredFile: PropTypes.func.isRequired,
  credFilePath: PropTypes.string.isRequired,
  handleDropCredFile: PropTypes.func.isRequired,
  credFilesArr: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCredFilesSelectChange: PropTypes.func.isRequired
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
