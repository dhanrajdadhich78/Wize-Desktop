import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
// import Header from '../../components/Header/Header';
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
          {/*<Header*/}
            {/*menuClosed={this.state.menuClosed}*/}
            {/*toggleMenu={() => this.setState({ menuClosed: !this.state.menuClosed })}*/}
          {/*/>*/}
          <main>
            <SideMenu
              blockChain={this.props.blockChain}
              menuClosed={this.state.menuClosed}
              toggleMenu={() => this.setState({ menuClosed: !this.state.menuClosed })}
            />
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
  children: PropTypes.element.isRequired,
  blockChain: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  blockChain: state.auth.blockChain,
});

export default connect(mapStateToProps)(Layout);
