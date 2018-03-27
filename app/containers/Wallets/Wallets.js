import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../store/actions';

import classes from './Wallets.css';

import Heading from '../../components/UI/Heading/Heading';
import CreateTransaction from '../../components/CreateTransaction/CreateTransaction';

class Wallet extends Component {
  // state = {
  //   walletsList: [
  //     {
  //       cpk: this.props.userData.cpk,
  //       address: this.props.userData.address,
  //       ballance: 10
  //     }
  //   ]
  // };
  handleSubmitTransaction = (to, amount) => {
    ipcRenderer.send('transaction:create', { from: this.props.userData.address, to, amount });
    ipcRenderer.on('transaction:done', () => {
      this.props.getBallance(this.props.userData.address);
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
            <p>Ballance: <span>{ this.props.ballance } WB</span></p>
          </div>
          <div className={classes.WalletOperations}>
            <Heading size={2} fontSize={24} fontWeight={200} divider={false}>
              Trans<span>action</span>
            </Heading>
            <CreateTransaction
              // walletsList={this.state.walletsList}
              handleSubmitTransaction={(to, amount) => this.handleSubmitTransaction(to, amount)}
            />
          </div>
        </div>
      </div>
    );
  }
}

Wallet.propTypes = {
  // isAuth: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  ballance: PropTypes.number.isRequired,
  getBallance: PropTypes.func.isRequired
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
  // isAuth: state.auth.userData.cpk !== null,
  userData: state.auth.userData,
  ballance: state.blockchain.ballance
});

const mapDispatchToProps = dispatch => ({
  getBallance: address => dispatch(actions.getBallance(address))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
