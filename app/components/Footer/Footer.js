import React, { Component } from 'react';

import { gbytes2Tbytes } from '../../utils/commonFunctions';

import css from './Footer.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Footer extends Component {
  state = {
    total: 1024,
    used: 800,
    available: 123,
    masternodes: 0
  };
  render() {
    return (
      <div
        className={[
          styles.flex,
          styles.wh100,
          styles.Footer
        ].join(' ')}
      >
        <div
          className={[
            styles.flex3,
            styles.wh100,
            styles.flexAllCenter
          ].join(' ')}
        >
          {gbytes2Tbytes(this.state.total)} TB
        </div>
        <div
          className={[
            styles.flex1,
            styles.wh100,
            styles.flexAllCenter
          ].join(' ')}
        >
          <div
            className={[
              styles.flex,
              styles.DataInfo
            ].join(' ')}
          >
            <div className={styles.flexAllCenter}>
              DATA USED:  <span>{this.state.used} GB</span>
            </div>
            <div className={styles.flexAllCenter}>
              DATA Available:  <span>{this.state.available} GB</span>
            </div>
            <div className={styles.flexAllCenter}>
              MASTERNODES:  <span>{this.state.masternodes} GB</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
