import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { checkInternet, getCredFilesList } from './store/actions/index';

import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/NoInternetConnection/NoInternetConnection';
import Homepage from './containers/Homepage/Homepage';
import FilesList from './containers/FilesList/FilesList';
import FileUpload from './containers/FileUpload/FileUpload';
import Wallet from './containers/Wallet/Wallet';
import Account from './containers/Account/Account';
import GhostPad from './containers/GhostPad/GhostPad';
import Miners from './containers/Miners/Miners';

class App extends Component {
  componentWillMount() {
    this.props.checkInternet();
    this.props.getCredFilesList();
  }
  render() {
    let routes;
    if (this.props.internetChecking) {
      routes = <Spinner />;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.props.internet) {
        routes = (
          <div style={{ padding: '0 30px 30px' }}>
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Redirect to="/" />
            </Switch>
          </div>
        );
        if (this.props.isAuth) {
          routes = (
            <Layout>
              <Switch>
                <Route exact path="/" component={Account} key={Math.random()} />
                <Route exact path="/wallet" component={Wallet} key={Math.random()} />
                <Route exact path="/file-upload" component={FileUpload} key={Math.random()} />
                <Route exact path="/files-list" component={FilesList} key={Math.random()} />
                <Route exact path="/ghost-pad" component={GhostPad} key={Math.random()} />
                <Route exact path="/miners" component={Miners} key={Math.random()} />
                <Redirect to="/" />
              </Switch>
            </Layout>
          );
        }
      } else {
        routes = <NoInternetConnection />;
      }
    }
    return (
      <div>
        {routes}
      </div>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  checkInternet: PropTypes.func.isRequired,
  internet: PropTypes.bool.isRequired,
  internetChecking: PropTypes.bool.isRequired,
  getCredFilesList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.userData.cpk !== null,
  internetChecking: state.commonInfo.internetChecking,
  internet: state.commonInfo.internet
});

const mapDispatchToProps = dispatch => ({
  checkInternet: () => dispatch(checkInternet()),
  getCredFilesList: () => dispatch(getCredFilesList())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
