import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <Header isAuth={this.props.isAuth} />
          <main className={this.props.isAuth ? null : classes.NoFooter}>
            <article>
              { this.props.children }
            </article>
          </main>
          {/*
          <Footer
            isAuth={this.props.isAuth}
            balance={this.props.balance}
          />
          */}
          {
            this.props.isAuth
              ? <Footer />
              : null
          }
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  balance: PropTypes.number
};

Layout.defaultProps = {
  balance: 0
};

const mapStateToProps = state => ({
  isAuth: state.auth.userData.csk !== null,
  balance: state.blockchain.balance,
  bcNodes: state.digest.digestInfo.bcNodes
});

export default connect(mapStateToProps)(Layout);
