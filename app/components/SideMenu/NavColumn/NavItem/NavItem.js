import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './NavItem.css';

const navItem = props => (
  <div className={!props.isActive ? classes.NavigationItem : [classes.NavigationItem, classes.Active].join(' ')}>
    {
      props.childItems.length
        ? (
          <button
            type="button"
            className={props.isActive ? classes.ActiveLink : null}
            onClick={() => props.toggleMenu(props.id)}
          >
            {props.children}
          </button>
        )
        : (
          <NavLink
            onClick={() => props.toggleMenu(props.id)}
            activeClassName={classes.ActiveLink}
            exact
            to={props.link}
          >
            {props.children}
          </NavLink>
        )
    }
    {
      props.childItems.length
        ? (
          <ul className={classes.ChildList}>
            {
              props.childItems.map(item => (
                <li key={item.label}>
                  <NavLink
                    activeClassName={classes.ActiveChildLink}
                    exact
                    to={item.link}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))
            }
          </ul>
        )
        : null
    }
  </div>
);

navItem.propTypes = {
  id: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  childItems: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string,
    label: PropTypes.string
  })),
  toggleMenu: PropTypes.func.isRequired
};

navItem.defaultProps = {
  childItems: []
};

export default navItem;
