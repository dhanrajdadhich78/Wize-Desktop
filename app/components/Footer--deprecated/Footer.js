import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { RELEASE_VERSION } from '../../utils/const';

import css from './Footer.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

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
    <div className={styles.Footer}>
      <div
        className={[
          styles.flexColumn,
          styles.flexJustifyCenter,
          styles.InfoLeft
        ].join(' ')}
      >
        <h3 className={styles.white}>
          { RELEASE_VERSION }
        </h3>
        <h3 className={styles.blue}>
          Powered by WizeBit
        </h3>
        <div className={styles.flexAlignCenter}>
          <div className={styles.orangeBar} />
          BLOCKCHAIN TECHNOLOGY
        </div>
      </div>
      {
        !props.isAuth
          ? null
          : (
            <div className={styles.InfoRight}>
              <nav className={styles.Menu}>
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
              <div className={styles.Balance}>
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
