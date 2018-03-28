import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
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
          <main>
            <SideMenu
              blockChain={this.props.blockchain}
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
  blockchain: PropTypes.bool.isRequired,
  // userData: PropTypes.shape({
  //   csk: PropTypes.string,
  //   cpk: PropTypes.string,
  //   address: PropTypes.string
  // })
};

// Layout.defaultProps = {
//   userData: {
//     csk: null,
//     cpk: null,
//     address: null
//   }
// };

const mapStateToProps = state => ({
  // userData: state.auth.userData,
  blockchain: state.blockchain.ballance !== null,
});

export default connect(mapStateToProps)(Layout);
