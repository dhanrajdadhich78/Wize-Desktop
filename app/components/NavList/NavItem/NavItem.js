import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './NavItem.css';

const navItem = (props) => (
  <NavLink
    className={classes.NavigationItem}
    activeClassName={[classes.NavigationItem, classes.Active].join(' ')}
    exact
    to={props.link}
  >
    {props.children}
  </NavLink>
);

navItem.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default navItem;
