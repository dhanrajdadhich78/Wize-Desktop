/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import UiNavLink from '../UI/NavLink/NavLink';

import {
  logoGhost,
  loop,
  logout,
  settings,
  wallet
  /* , logoTitle */
} from '../../assets/img/img';
import css from './Header.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Header extends Component {
  state = {
    unAuthorisedMenu: [
      {
        link: '/access',
        label: 'Access'
      },
      {
        link: '/register',
        label: 'Register'
      }
    ],
    authorisedMenu: [
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
        label: 'Ghost Files'
      },
      {
        link: '/ghost-pad',
        label: 'Ghost pad'
      }
    ],
    iconsMenu: [
      {
        link: '/deposit',
        label: loop,
        alt: 'logout'
      },
      {
        link: '/wallet',
        label: wallet,
        alt: 'settings'
      },
      {
        link: '/account',
        label: settings,
        alt: 'settings'
      },
      {
        link: '/logout',
        label: logout,
        alt: 'logout'
      },
    ]
  };
  render() {
    const leftMenu = this.props.isAuth
      ? this.state.authorisedMenu
      : this.state.unAuthorisedMenu;
    const rightMenu = this.props.isAuth
      ? this.state.iconsMenu
      : null;
    return (
      <div
        className={[
          styles.flexBetweenCenter,
          styles.Header
        ].join(' ')}
      >
        <div className={styles.flexAllCenter}>
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
                leftMenu.map((item, index) => (
                  <li key={index}>
                    <UiNavLink
                      link={item.link}
                      label={item.label}
                    />
                  </li>
                ))
              }
            </ul>
          </nav>
        </div>
        {
          rightMenu
            ? (
              <ul
                className={[
                  styles.flexBetweenCenter,
                  styles.IconsMenu
                ].join(' ')}
              >
                {
                  rightMenu.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={item.link}
                      >
                        <img src={item.label} alt={item.alt} height={18} />
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
  }
}

Header.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Header;
