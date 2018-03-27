import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { checkInternet, getCredFilesList } from './store/actions/index';

import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import NoInternetConnection from './components/NoInternetConnection/NoInternetConnection';
import Root from './containers/Root/Root';
import FilesList from './containers/FilesList/FilesList';
import FileUpload from './containers/FileUpload/FileUpload';
import Wallets from './containers/Wallets/Wallets';


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
              <Route exact path="/" component={Root} />
              <Redirect to="/" />
            </Switch>
          </div>
        );
        if (this.props.isAuth) {
          routes = (
            <Layout>
              <Switch>
                <Route exact path="/" component={FileUpload} />
                <Route exact path="/file-list" component={FilesList} />
                <Route exact path="/wallets" component={Wallets} />
                {/* <Route exact path="/wallets-list" component={WalletsList} /> */}
                {/* <Route exact path="/wallet-check" component={WalletCheck} /> */}
                {/* <Route exact path="/transaction-create" component={CreateTransaction} /> */}
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
