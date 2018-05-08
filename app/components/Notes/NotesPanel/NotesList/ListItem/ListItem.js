import React from 'react';
import PropTypes from 'prop-types';

import { timestamp2date } from '../../../../../utils/commonFunctions';

import css from './ListItem.css';
import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const NotesContent = ({ note }) => (
  <div
    className={[
      styles.flexBetweenCenter,
      styles.ListItem
    ].join(' ')}
  >
    <div>{timestamp2date(note.date)}</div>
    <div className={styles.threeDotsAtTheEnd}>{note.title || note.text}</div>
  </div>
);

NotesContent.propTypes = {
  note: PropTypes.shape().isRequired
};

export default NotesContent;
