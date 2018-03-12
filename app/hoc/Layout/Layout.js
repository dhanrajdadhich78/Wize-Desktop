import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
import Header from '../../components/Header/Header';
import SideMenu from '../../components/SideMenu/SideMenu';
import BugReport from '../../containers/BugReport/BugReport';

class Layout extends Component {
  state = {
    menuClosed: true
  };
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <Header
            menuClosed={this.state.menuClosed}
            toggleMenu={() => this.setState({ menuClosed: !this.state.menuClosed })}
          />
          <main>
            <article>
              { this.props.children }
            </article>
            <SideMenu
              menuClosed={this.state.menuClosed}
              toggleMenu={() => this.setState({ menuClosed: !this.state.menuClosed })}
            />
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
