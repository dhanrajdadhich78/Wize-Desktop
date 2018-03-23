import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

// import { authCheckState } from './store/actions/index';

import Spinner from './components/UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import Root from './containers/Root/Root';
import FilesList from './containers/FilesList/FilesList';
import FileUpload from './containers/FileUpload/FileUpload';
import Wallets from './containers/Wallets/Wallets';
// import WalletsList from './containers/WalletsList/WalletsList';
// import WalletCheck from './containers/WalletCheck/WalletCheck';
// import CreateTransaction from './containers/CreateTransaction/CreateTransaction';

class App extends Component {
  state = {
    internetIsOn: false
  };
  componentWillMount() {
    setTimeout(() => this.setState({ internetIsOn: navigator.onLine }), 1000);
  }
  render() {
    let routes = <Spinner />;
    if (this.state.internetIsOn) {
      routes = (
        <div style={{ padding: '0 30px 30px' }} >
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
