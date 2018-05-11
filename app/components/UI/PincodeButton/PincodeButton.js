import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import css from './PincodeButton.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const pincodeButton = props => (
  <button
    key={uuidv4()}
    className={styles.Button}
    onClick={() => props.buttonClick(props.value)}
    style={
      props.timer < 1 || props.timer > props.maxTimerVal
        ? { opacity: 0, transition: `all ${Math.random()}s linear` }
        : { transition: `all ${Math.random()}s linear` }
    }
  >
    <div
      className={styles.ButtonInnerContainer}
      style={
        props.timer < 1 || props.timer > props.maxTimerVal
          ? { pointerEvents: 'none', cursor: 'default' }
          : {}
      }
    >
      <div className={styles.SupTitle}>
        {props.suptitle}&nbsp;
      </div>
      <div className={styles.Title}>
        {props.title}
      </div>
      {
        props.letters
          ? (
            <div className={[styles.flex, styles.SubTitle].join(' ')}>
              {props.letters.map((l, j) => <div key={j}>{l}</div>)}
            </div>
          )
          : null
      }
      <div />
    </div>
    <div className={styles.FocusBlock}>
      <div /><div /><div /><div />
    </div>
  </button>
);

pincodeButton.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  suptitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ]).isRequired,
  letters: PropTypes.arrayOf(PropTypes.string),
  buttonClick: PropTypes.func.isRequired,
  // reRendrer: PropTypes.bool
  timer: PropTypes.number,
  maxTimerVal: PropTypes.number
};

pincodeButton.defaultProps = {
  value: '',
  suptitle: '',
  letters: [],
  // reRendrer: false,
  timer: 1,
  maxTimerVal: 39
};

export default pincodeButton;
