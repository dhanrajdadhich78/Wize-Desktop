/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import classes from './List.css';

import Item from './Item/Item';

const list = props => (
  <div className={classes.List}>
    {props.files.map((file, i) => (
      <Item
        key={i}
        info={file}
        index={i}
        isActive={props.activeFile === i}
        onClick={index => props.onClick(index)}
      />
    ))}
  </div>
);

list.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeFile: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

list.defaultProps = {
  activeFile: null
};

export default list;
