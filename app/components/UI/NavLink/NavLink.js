import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './NavLink.css';

const navLink = ({ link, label }) => (
  <div className={classes.NavLink}>
    <NavLink to={link} activeClassName={classes.Active} >
      {label}
    </NavLink>
  </div>
);

navLink.propTypes = {
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default navLink;
