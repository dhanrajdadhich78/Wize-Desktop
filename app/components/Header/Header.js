import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './Header.css';

const header = props => {
  const items = [
    {
      link: '/',
      label: 'Files List'
    },
    {
      link: '/upload-files',
      label: 'Upload Files'
    },
    {
      link: '/wallet',
      label: 'My wallet'
    }
  ];

  return (
    <header>
      <div className={classes.Logo}>
        <NavLink to="/">
          <img src="../internals/img/wizebit_logo.svg" alt="logo" />
        </NavLink>
      </div>
      <nav>
        <ul>
          {
            items.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                <NavLink to={item.link}>
                  {item.label}
                </NavLink>
              </li>
            ))
          }
        </ul>
      </nav>
      <div className={classes.MenuButtonWrapper}>
        <button onClick={() => props.toggleMenu()}>
          <i className={`fa ${props.menuClosed ? 'fa-bars' : 'fa-times'}`} />
        </button>
      </div>
    </header>
  );
};

header.propTypes = {
  menuClosed: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

export default header;
