import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';
import { bg } from '../../assets/img/img';

import Aux from '../Aux/Aux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

class Layout extends Component {
  // state = {
  //   encryption: false,
  //   twoFA: false,
  //   keyLogin: false,
  //   accessRole: false,
  // };
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <Header isAuth={this.props.isAuth} />
          <main style={{ backgroundImage: `url(${bg})` }}>
            <article>
              { this.props.children }
            </article>
          </main>
          <Footer />
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  // bcNodes: PropTypes.arrayOf(PropTypes.string),
};

// Layout.defaultProps = {
//   bcNodes: []
// };

const mapStateToProps = state => ({
  isAuth: state.auth.userData.csk !== null,
  bcNodes: state.digest.digestInfo.bcNodes
});

export default connect(mapStateToProps)(Layout);
