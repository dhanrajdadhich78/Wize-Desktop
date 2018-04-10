/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../store/actions';

import classes from './Wallet.css';

import Heading from '../../components/UI/Heading/Heading';
import CreateTransaction from '../../components/PagesSections/Wallet/CreateTransaction/CreateTransaction';

class Wallet extends Component {
  state = {
    minenow: true
  };
  handleOnMineNowCheck = () => this.setState({ minenow: !this.state.minenow });
  handleSubmitTransaction = (to, amount) => {
    const userData = this.props.userData;
    const minenow = this.state.minenow;
    ipcRenderer.send('transaction:create', {
      userData,
      to,
      amount,
      minenow
    });
    ipcRenderer.on('transaction:done', () => {
      this.props.getBalance(this.props.userData.address);
    });
  };
  render() {
    return (
      <div className={classes.Wallet}>
        <Heading fontWeight={200} fontSize={50}>My <span>wallets</span></Heading>
        <div className={classes.BodyWrapper}>
          <div className={classes.WaleltsInfo}>
            <p>Wallet: <span>{this.props.userData.address}</span></p>
            <p>Public key: <span>{this.props.userData.cpk}</span></p>
            <p>Balance: <span>{ this.props.balance } WB</span></p>
          </div>
          <div className={classes.WalletOperations}>
            <Heading size={2} fontSize={24} fontWeight={200} divider={false}>
              Trans<span>action</span>
            </Heading>
            <CreateTransaction
              minenow={this.state.minenow}
              handleOnMineNowCheck={() => this.handleOnMineNowCheck()}
              handleSubmitTransaction={(to, amount) => this.handleSubmitTransaction(to, amount)}
            />
          </div>
        </div>
      </div>
    );
  }
}

Wallet.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  balance: PropTypes.number.isRequired,
  getBalance: PropTypes.func.isRequired
};

Wallet.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  }
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  balance: state.blockchain.balance
});

const mapDispatchToProps = dispatch => ({
  getBalance: address => dispatch(actions.getBalance(address))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
