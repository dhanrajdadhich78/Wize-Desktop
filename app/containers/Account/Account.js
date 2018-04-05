import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';

import classes from './Account.css';

import Button from '../../components/UI/Button/Button';

class Account extends Component {
  render() {
    return (
      <div className={classes.Account}>
        Account
        <br /><br />
        <Button onClick={() => this.props.onLogout()}>Logout</Button>
      </div>
    );
  }
}

Account.propTypes = {
  onLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onLogout: (password, filePath) => dispatch(actions.logout(password, filePath))
});

export default connect(null, mapDispatchToProps)(Account);
