import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { RELEASE_VERSION } from '../../utils/const';

import classes from './Footer.css';

const footer = props => {
  const listItems = [
    {
      link: '/account',
      label: 'Account'
    },
    {
      link: '/wallet',
      label: 'Wallet'
    },
    {
      link: '/deposit',
      label: 'Deposit'
    }
  ];
  return (
    <div className={classes.Footer}>
      <div className={classes.InfoLeft}>
        <h3>{ RELEASE_VERSION }</h3>
        <div className={classes.Subtitle}>
          <div>ERC 721</div>
          <div>SHARDING</div>
          <div>WizeBit Blockchain</div>
        </div>
      </div>
      {
        !props.isAuth
          ? null
          : (
            <div className={classes.InfoRight}>
              <nav className={classes.Menu}>
                <ul>
                  {
                    listItems.map((item, index) => (
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
              <div className={classes.Balance}>
                <div>BALANCE</div>
                <div>
                  {
                    props.balance || props.balance === 0
                      ? props.balance
                      : 'LOADING...'
                  }
                </div>
                <div>WALLET</div>
              </div>
            </div>
          )
      }
    </div>
  );
};

footer.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  balance: PropTypes.number
};

footer.defaultProps = {
  balance: 0
};

export default footer;
