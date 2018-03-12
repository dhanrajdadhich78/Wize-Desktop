import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
import NavList from '../../components/NavList/NavList';
import BugReport from '../../containers/BugReport/BugReport';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <main>
            <NavList />
            <article>
              { this.props.children }
            </article>
          </main>
          <BugReport />
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;
