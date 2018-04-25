import React from 'react';
import PropTypes from 'prop-types';

import classes from './Item.css';
import {
  xFileRed,
  xFileBlue,
  key,
  lock
} from '../../../../../assets/img/img';

const item = props => (
  <div>
    <button
      className={!props.isActive ? classes.Item : [classes.Item, classes.Active].join(' ')}
      style={props.isActive ? { backgroundImage: `url(${xFileRed})` } : { backgroundImage: `url(${xFileBlue})` }}
      onClick={() => props.onClick(props.index)}
    >
      <div className={classes.InnerWrapper}>
        <div className={classes.Extension}>
          {props.info.extension}
        </div>
        <div className={classes.Encryption}>
          {props.info.encryption}
        </div>
        {
          props.info.options && props.info.options.key
            ? (
              <div className={classes.OptionsKey}>
                <img src={key} alt="key" />
              </div>
            )
            : null
        }
        {
          props.info.options && props.info.options.locked
            ? (
              <div className={classes.OptionsLocked}>
                <img src={lock} alt="key" />
              </div>
            )
            : null
        }
        <div className={classes.Button}>
          <button onClick={() => console.log('delete')}>delete</button>
        </div>
      </div>
      <div className={classes.Corners}><div /><div /><div /><div /></div>
    </button>
  </div>
);

item.propTypes = {
  info: PropTypes.shape({
    extension: PropTypes.string.isRequired,
    encryption: PropTypes.string.isRequired,
    options: PropTypes.shape()
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

item.defaultProps = {
  isActive: false
};

export default item;
