import React from 'react';
import PropTypes from 'prop-types';

import NotesItem from './NotesItem/NotesItem';

import css from './NotesList.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const notesList = props => (
  <div
    className={[
      styles.h100,
      styles.w100,
      styles.flexColumn,
      styles.justifyCenter
    ].join(' ')}
  >
    {
      props.notes && props.notes.length
        ? (
          <div
            className={[
              styles.h100,
              styles.w100,
              styles.flexColumn,
              styles.justifyCenter
            ].join(' ')}
          >
            <ul
              className={[
                styles.h100,
                styles.w100,
                styles.flexColumn,
                styles.Ul
              ].join(' ')}
            >
              {
                props.notes.map(note => (
                  <li key={note.id}>
                    <NotesItem note={note} deleteNote={id => props.deleteNote(id)} />
                  </li>
                ))
              }
            </ul>
          </div>
        )
        : (
          <div className={styles.emptyMessage}>
            There is no notes yet.
          </div>
        )
    }
  </div>
);

notesList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()),
  deleteNote: PropTypes.func.isRequired
};

notesList.defaultProps = {
  notes: []
};

export default notesList;
