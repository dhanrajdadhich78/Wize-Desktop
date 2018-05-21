import React from 'react';
import PropTypes from 'prop-types';

import classes from './Chat.css';

import WithCustomScrollbar from '../UI/WithCustomScrollbar/WithCustomScrollbar';

const chat = ({ strings }) => (
  <div className={classes.Chat}>
    <WithCustomScrollbar>
      <div className={classes.Heading}>
        <h3>
          Encrypted chat
        </h3>
      </div>
      <div className={classes.ChatBody}>
        <ul>
          {
            strings.map((string, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={i}>
                <span>
                  {i < 9 ? `0${i + 1}` : i + 1}
                </span>
                <span>
                  {string}
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    </WithCustomScrollbar>
  </div>
);

chat.propTypes = {
  strings: PropTypes.arrayOf(PropTypes.string)
};

chat.defaultProps = {
  strings: [
    'there is no messages yet'
  ]
};

export default chat;
