import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as actions from '../../../store/actions';

class Logout extends Component {
  componentWillMount() {
    ipcRenderer.send('fs:unmount');
    this.props.onLogout();
  }
  render() {
    return (
      <div>
        You will be redirected in few moments.
      </div>
    );
  }
}

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onLogout: (password, filePath) => dispatch(actions.logout(password, filePath))
});

export default connect(null, mapDispatchToProps)(Logout);
