import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './NavItem.css';

const navItem = props => (
  <div className={classes.NavigationItem}>
    <NavLink
      activeClassName={classes.ActiveLink}
      exact
      to={props.link}
    >
      {props.children}
    </NavLink>
  </div>
);

navItem.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default navItem;
