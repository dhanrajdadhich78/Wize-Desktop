import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem/ListItem';

import css from './NotesList.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const NotesList = props => (
  <ul
    className={[
      styles.flexColumn,
      styles.alignCenter,
      styles.w100,
      styles.NotesList
    ].join(' ')}
  >
    {
      props.notes.map(note => (
        <li
          className={[
            styles.w100
          ].join(' ')}
          key={note.id}
        >
          <button
            type="button"
            className={[
              styles.transparentButton,
              styles.w100
            ].join(' ')}
            onClick={() => props.selectNote(note.id)}
          >
            <ListItem note={note} />
          </button>
        </li>
      ))
    }
  </ul>
);

NotesList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default NotesList;
