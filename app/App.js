import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

// import { authCheckState } from './store/actions/index';

import Layout from './hoc/Layout/Layout';
import Root from './containers/Root/Root';
import Dashboard from './containers/Dashboard/Dashboard';
import FileUpload from './containers/FileUpload/FileUpload';
import WalletsList from './containers/WalletsList/WalletsList';
import WalletCheck from './containers/WalletCheck/WalletCheck';
import CreateTransaction from './containers/CreateTransaction/CreateTransaction';

class App extends Component {
  render() {
    let routes = (
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
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/upload-files" component={FileUpload} />
            <Route exact path="/wallets-list" component={WalletsList} />
            <Route exact path="/wallet-check" component={WalletCheck} />
            <Route exact path="/transaction-create" component={CreateTransaction} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      );
    }
    return (
      <div>
        {routes}
      </div>
    );
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.userData.cpk !== null
});

// const mapDispatchToProps = dispatch => ({
//   onTryAutoSignup: () => dispatch(authCheckState())
// });

export default withRouter(connect(mapStateToProps)(App));
