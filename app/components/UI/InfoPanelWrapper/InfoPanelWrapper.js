import React from 'react';
import PropTypes from 'prop-types';

import css from './InfoPanelWrapper.css';
import arrowCss from '../../../assets/css/arrow.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...arrowCss, ...css };

const InfoPanelWrapper = props => (
  <div
    className={[
      styles.flexColumn,
      styles.wh100
    ].join(' ')}
  >
    <div className={styles.Plank}>
      <button
        className={[
          styles.flexAllCenter,
          styles.h100,
          styles.transparentButton
        ].join(' ')}
        type="button"
        onClick={() => props.action()}
      >
        <i
          className={
            !props.hide
              ? [
                styles.arrow,
                styles.arrowDown,
                styles.Arrow
              ].join(' ')
              : [
                styles.arrow,
                styles.arrowUp,
                styles.Arrow,
                styles.ArrowUp
              ].join(' ')
          }
        />
      </button>
    </div>
    <div className={styles.Info}>
      {props.children}
    </div>
  </div>
);

InfoPanelWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  action: PropTypes.func.isRequired,
  hide: PropTypes.bool
};

InfoPanelWrapper.defaultProps = {
  hide: false
};

export default InfoPanelWrapper;
