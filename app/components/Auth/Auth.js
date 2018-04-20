import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Auth.css';

import PinCode from './PinCode/PinCode';
import Login from './Login/Login';
import Registration from './Registration/Registration';

class Auth extends Component {
  // componentWillMount() {
  //   Object.keys(this.props.userData).map(key => {
  //     if (!this.props.userData[key]) {
  //       this.setState({ hasData: false });
  //     }
  //     return true;
  //   });
  // }
  // componentDidMount() {
  //   if ((!this.state.hasData && this.state.controls.password.value)
  //     && (!this.props.authError || this.props.authError !== 'There is no credentials file')) {
  //     this.props.handleAuth(this.state.controls.password.value, this.props.lastCredFile);
  //   }
  // }
  // handleInputChange = (event, controlName) => {
  //   // eslint-disable-next-line max-len
  //   const cV = checkValidity(event.target.value, this.state.controls[controlName].validation, controlName);
  //   const updatedControls = {
  //     ...this.state.controls,
  //     [controlName]: {
  //       ...this.state.controls[controlName],
  //       value: event.target.value,
  //       valid: cV.isValid,
  //       errorMessage: cV.errorMessage,
  //       touched: true
  //     }
  //   };
  //   this.setState({
  //     controls: updatedControls
  //   });
  // };
  // handleSubmitForm = e => {
  //   e.preventDefault();
  //   //  eslint-disable-next-line max-len
  //   this.props.handleAuth(this.state.controls.password.value, this.props.credFilePath);
  // };
  // render() {
  //   let content = (
  //     <div>
  //       {
  //         this.props.userData.csk
  //           ?
  //           (
  //             <div>
  //               <p>csk: {this.props.userData.csk}</p>
  //               <p>cpk: {this.props.userData.cpk}</p>
  //               <p>address: {this.props.userData.address}</p>
  //             </div>
  //           )
  //           : null
  //       }
  //     </div>
  //   );
  //
  //   if (!this.state.hasData || (this.props.authError && this.props.authError.message !== 'There is no credentials file')) {
  //     content = (
  //       <div>
  //         <ToggleCredFiles
  //           altCredFilePath={this.props.altCredFilePath}
  //           handleToggleAltCredFile={() => this.props.handleToggleAltCredFile()}
  //           credFilePath={this.props.credFilePath}
  //           handleDropCredFile={file => this.props.handleDropCredFile(file)}
  //           credFilesArr={this.props.credFilesArr}
  //           onCredFilesSelectChange={val => this.props.onCredFilesSelectChange(val)}
  //           dropzoneInput={this.props.dropzoneInput}
  //           handleReturnDropzoneInput={() => this.props.handleReturnDropzoneInput()}
  //         />
  //         <form onSubmit={e => this.handleSubmitForm(e)}>
  //           <div>
  //             <Input
  //               id="password"
  //               value={this.state.controls.password.value}
  //               elementType={this.state.controls.password.elementType}
  //               elementConfig={this.state.controls.password.elementConfig}
  //               label={this.state.controls.password.label}
  //               changed={event => this.handleInputChange(event, 'password')}
  //               errorMessage={this.state.controls.password.errorMessage}
  //               invalid={!this.state.controls.password.valid}
  //               shouldValidate={this.state.controls.password.validation.required}
  //               touched={this.state.controls.password.touched}
  //             />
  //           </div>
  //           <div>
  //             <Button
  //               disabled={!this.state.controls.password.valid || !this.props.credFilePath}
  //             >
  //               Login
  //             </Button>
  //           </div>
  //         </form>
  //       </div>
  //     );
  //   }
  //
  //   if (this.props.userData.csk && this.props.userData.cpk && this.props.userData.address) {
  //     content = <Redirect to="/dashboard" />;
  //   }
  //
  //   return (
  //     <div className={classes.Auth}>
  //       <div className={classes.PinCode}>
  //         pincode
  //       </div>
  //       <div className={classes.FileSection}>
  //         {content}
  //       </div>
  //     </div>
  //   );
  // }
  render() {
    return (
      <div className={classes.Auth}>
        <div className={classes.PinCode}>
          <PinCode
            password={this.props.password}
            buttonClick={val => this.props.buttonClick(val)}
            handleSubmit={() => this.props.handleAuth()}
          />
        </div>
        <div className={classes.FileSection}>
          {
            this.props.login
              ? (
                <Login
                  handleDropCredFile={file => this.props.handleDropCredFile(file)}
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
  handleDownload: PropTypes.func
};

Auth.defaultProps = {
  login: true,
  password: '',
  regForm: {},
  handleDropCredFile: () => null,
  handleDownload: () => null
};

export default Auth;
