import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { /* Route, Switch, Redirect, */ withRouter } from 'react-router-dom';

import { checkInternet } from './store/actions/index';

import classes from './App.css';

import PreventSelection from './utils/preventSelection';
// import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
// import NoInternetConnection from './components/NoInternetConnection/NoInternetConnection';
// import Homepage from './containers/Homepage/Homepage';
// import FilesList from './containers/FilesList/FilesList';
// import FileUpload from './containers/FileUpload/FileUpload';
// import Wallet from './containers/Wallet/Wallet';
// import Account from './containers/Account/Account';
// import GhostPad from './containers/GhostPad/GhostPad';
// import Deposit from './containers/Deposit/Deposit';
// import SwapKeys from './containers/SwapKeys/SwapKeys';
// import XFiles from './containers/XFiles/XFiles';
// import Logout from './containers/Homepage/Logout/Logout';
import Ghost from './components/Animations/Ghost/Ghost';

class App extends Component {
  componentWillMount() {
    PreventSelection(document);
    this.props.checkInternet();
  }
  render() {
    // let routes;
    // if (this.props.internetChecking) {
    //   routes = <Spinner />;
    // } else {
    //   // eslint-disable-next-line no-lonely-if
    //   if (this.props.internet) {
    //     routes = (
    //       <Switch>
    //         <Route path="/" component={Homepage} />
    //         <Redirect to="/" />
    //       </Switch>
    //     );
    //     if (this.props.isAuth) {
    //       routes = (
    //         <Switch>
    //           <Route exact path="/account" component={Account} key={Math.random()} />
    //           <Route exact path="/wallet" component={Wallet} key={Math.random()} />
    //           <Route exact path="/upload" component={FileUpload} key={Math.random()} />
    //           <Route exact path="/files" component={FilesList} key={Math.random()} />
    //           <Route exact path="/ghost-pad" component={GhostPad} key={Math.random()} />
    //           <Route exact path="/deposit" component={Deposit} key={Math.random()} />
    //           <Route exact path="/swap-keys" component={SwapKeys} key={Math.random()} />
    //           <Route exact path="/x-files" component={XFiles} key={Math.random()} />
    //           <Route exact path="/logout" component={Logout} key={Math.random()} />
    //           <Redirect to="/files" />
    //         </Switch>
    //       );
    //     }
    //   } else {
    //     routes = <NoInternetConnection />;
    //   }
    // }
    // return (
    //   <div>
    //     <Layout>
    //       {routes}
    //     </Layout>
    //   </div>
    // );
    return (
      <div className={classes.AnimationWrapper}>
        <Ghost />
      </div>
    );
  }
}

App.propTypes = {
  // isAuth: PropTypes.bool.isRequired,
  checkInternet: PropTypes.func.isRequired,
  // internet: PropTypes.bool.isRequired,
  // internetChecking: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.userData.csk !== null,
  internetChecking: state.commonInfo.internetChecking,
  internet: state.commonInfo.internet
});

const mapDispatchToProps = dispatch => ({
  checkInternet: () => dispatch(checkInternet())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
