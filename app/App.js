import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { checkInternet } from './store/actions/index';
import PreventSelection from './utils/preventSelection';
import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/NoInternetConnection/NoInternetConnection';
import Homepage from './containers/Homepage/Homepage';
import FilesList from './containers/FilesList/FilesList';
import FileUpload from './containers/FileUpload/FileUpload';
import Wallet from './containers/Wallet/Wallet';
import Account from './containers/Account/Account';
import GhostPad from './containers/GhostPad/GhostPad';
import Deposit from './containers/Deposit/Deposit';
import XFiles from './containers/XFiles/XFiles';
import Logout from './containers/Homepage/Logout/Logout';
import Ghost from './components/Animations/Ghost/Ghost';

import { bg } from './assets/img/img';

import classes from './App.css';

class App extends Component {
  state = {
    content: false,
  };
  componentWillMount() {
    PreventSelection(document);
    this.props.checkInternet();
    setTimeout(() => this.setState({ content: true }), 1649);
  }
  render() {
    let routes;
    if (this.props.internetChecking) {
      routes = <Spinner />;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.props.internet) {
        routes = (
          <Switch>
            <Route path="/" component={Homepage} key={Math.random()} />
            <Redirect to="/" />
          </Switch>
        );
        if (this.props.isAuth) {
          routes = (
            <Switch>
              <Route exact path="/account" component={Account} key={Math.random()} />
              <Route exact path="/wallet" component={Wallet} key={Math.random()} />
              <Route exact path="/upload" component={FileUpload} key={Math.random()} />
              <Route exact path="/files" component={FilesList} key={Math.random()} />
              <Route exact path="/ghost-pad" component={GhostPad} key={Math.random()} />
              <Route exact path="/deposit" component={Deposit} key={Math.random()} />
              <Route exact path="/x-files" component={XFiles} key={Math.random()} />
              <Route exact path="/logout" component={Logout} key={Math.random()} />
              <Redirect to="/files" />
            </Switch>
          );
        }
      } else {
        routes = <NoInternetConnection />;
      }
    }
    const startAnimation = (
      <div className={classes.AnimationWrapper}>
        <Ghost />
      </div>
    );
    return (
      <div style={{ backgroundImage: `url(${bg})` }}>
        {
          this.state.content
            ? (
              <Layout>
                {routes}
              </Layout>
            )
            : (
              <div>
                {startAnimation}
              </div>
            )
        }
      </div>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  checkInternet: PropTypes.func.isRequired,
  internet: PropTypes.bool.isRequired,
  internetChecking: PropTypes.bool.isRequired
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
