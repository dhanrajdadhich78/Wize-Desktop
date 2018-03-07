import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

// import { authCheckState } from './store/actions/index';

import Layout from './hoc/Layout/Layout';
import Root from './containers/Root/Root';

class App extends Component {
  render() {
    const routes = (
      <Switch>
        <Route exact path="/" component={Root} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

export default App;
