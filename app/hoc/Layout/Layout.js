import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Aux from '../Aux/Aux';
import classes from './Layout.css';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          { this.props.children }
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;
