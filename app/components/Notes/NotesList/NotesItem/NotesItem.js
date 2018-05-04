import React from 'react';
import PropTypes from 'prop-types';

import { timestamp2date } from '../../../../utils/commonFunctions';

import css from './NotesItem.css';
import commonCss from '../../../../assets/css/common.css';
import vmCss from '../../../../assets/css/verticalMenus.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...vmCss, ...css };

const notesItem = props => (
  <div
    className={[
      styles.flexAllCenter,
      styles.vmListBlock
    ].join(' ')}
  >
    <div>
      {timestamp2date(props.note.date)}
    </div>
    <div>
      {props.note.text}
    </div>
    <div>
      <button
        type="button"
      >
        delete
      </button>
    </div>
  </div>
);

notesItem.propTypes = {
  note: PropTypes.shape().isRequired
};

export default notesItem;
