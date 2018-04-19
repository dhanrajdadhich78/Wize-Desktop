/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import NavLink from '../UI/NavLink/NavLink';

import classes from './Header.css';
import { logo } from '../../assets/img/img';

import { RELEASE_VERSION } from '../../utils/const';

const header = props => {
  let listItems = [
    {
      link: '/access',
      label: 'Access'
    },
    {
      link: '/register',
      label: 'Register'
    }
  ];
  if (props.isAuth) {
    listItems = [];
  }
  return (
    <div className={classes.Header}>
      <div className={classes.Logo}>
        <img src={logo} alt="Ghostdrive" />
        <div className={classes.ReleaseVersion}>{ RELEASE_VERSION }</div>
      </div>
      <nav>
        <ul className={classes.NavList}>
          {
            listItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  link={item.link}
                  label={item.label}
                />
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
};

header.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default header;
