import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Wallets.css';

import Heading from '../../components/UI/Heading/Heading';
import CreateTransaction from '../../components/CreateTransaction/CreateTransaction';

class Wallet extends Component {
  state = {
    walletsList: [
      {
        cpk: this.props.userData.cpk,
        address: this.props.userData.address,
        ballance: 10
      }
    ]
  };
  render() {
    return (
      <div className={classes.Wallet}>
        <Heading fontWeight={200} fontSize={50}>My <span>wallets</span></Heading>
        <div className={classes.BodyWrapper}>
          <div className={classes.WaleltsInfo}>
            <ul className={classes.WalletsList}>
              {
                this.state.walletsList.map(wallet => (
                  <li key={wallet.address}>
                    <p>Wallet: <span>{wallet.address}</span></p>
                    <p>Public key: <span>{wallet.cpk}</span></p>
                    <p>Ballance: <span>{wallet.ballance} WB</span></p>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className={classes.WalletOperations}>
            <Heading size={2} fontSize={24} fontWeight={200} divider={false}>
              Trans<span>action</span>
            </Heading>
            <CreateTransaction
              walletsList={this.state.walletsList}
            />
          </div>
        </div>
      </div>
    );
  }
}

Wallet.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
};

Wallet.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  }
};

const mapStateToProps = state => ({
  // token: state.auth.authKey,
  isAuth: state.auth.userData.cpk !== null,
  userData: state.auth.userData
});

export default connect(mapStateToProps)(Wallet);
