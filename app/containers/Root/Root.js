import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

import classes from './Root.css';

import Auth from '../../components/Auth/Auth';
import Registration from '../../components/Auth/Registration/Registration';

class Root extends Component {
  state = {
    auth: false
  };
  // handleRegister = (e) => {
  //   e.preventDefault();
  //   this.props.onRegister();
  // };
  render() {
    let view = <Auth />;
    if (!this.state.auth) {
      view = (
        <Registration
          userData={this.props.userData}
          handleRegister={password => this.props.handleRegister(password)}
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
  handleRegister: PropTypes.func.isRequired
};

Root.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  }
};

const mapStateToProps = state => ({
  userData: state.auth.userData
});

const mapDispatchToProps = dispatch => ({
  handleRegister: password => dispatch(actions.registration(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
