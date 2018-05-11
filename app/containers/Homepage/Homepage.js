import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import classes from './Homepage.css';

import Access from './Access/Access';
import Register from './Register/Register';

const homepage = () => (
  <div className={classes.Homepage}>
    <Switch>
      <Route path="/access" exact component={Access} key={Math.random()} />
      <Route path="/register" exact component={Register} key={Math.random()} />
      <Redirect to="/access" />
    </Switch>
  </div>
);

export default homepage;

