/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import NavLink from '../UI/NavLink/NavLink';

import { logoGhost, logoTitle } from '../../assets/img/img';
import css from './Header.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const Header = props => {
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
    listItems = [
      {
        link: '/files',
        label: 'Files'
      },
      {
        link: '/upload',
        label: 'Upload'
      },
      {
        link: '/x-files',
        label: 'X-Files'
      },
      {
        link: '/ghost-pad',
        label: 'Ghost pad'
      },
      {
        link: '/logout',
        label: 'Logout'
      }
    ];
  }
  return (
    <div className={styles.Header}>
      <div
        className={[
          styles.flexAlignCenter,
          styles.Logo
        ].join(' ')}
      >
        <img src={logoGhost} alt="Ghostdrive" />
        {/* <img src={logoTitle} alt="Ghostdrive" /> */}
        <div
          className={[
            styles.orangeBar,
            styles.Bar
          ].join(' ')}
        />
      </div>
      <nav>
        <ul className={styles.NavList}>
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

Header.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Header;
