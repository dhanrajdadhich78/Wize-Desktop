/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const header = props => {
  const listItems = [
    {
      link: '/access',
      label: 'Access'
    },
    {
      link: '/register',
      label: 'Register'
    }
  ];
  return (
    <div>
      <nav>
        <ul>
          {
            listItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.link}>
                  {item.label}
                </NavLink>
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
