import React from 'react';
import PropTypes from 'prop-types';

import css from './NotesContent.css';
import commonCss from '../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const NotesContent = props => {
  const lineBreaksNumber = (
    props.selectedNote && props.selectedNote.text
      ? (props.selectedNote.text.match(/\n/g) || [])
      : []
  ).length;
  return (
    <div
      className={[
        styles.w100,
        styles.NotesContent
      ].join(' ')}
      style={props.selectedNote && props.selectedNote.id
        ? null
        : { pointerEvents: 'none', opacity: 0.6, cursor: 'none' }}
    >
      <textarea
        cols="30"
        rows="10"
        value={props.selectedNote.text ? props.selectedNote.text : ''}
        className={[
          styles.w100,
          styles.h100
        ].join(' ')}
        onChange={e => props.handleEditNote(e.target.value)}
      />
      <button
        className={[
          styles.transparentButton,
          styles.blue,
          styles.SaveButton
        ].join(' ')}
        style={lineBreaksNumber ? { top: `${((+lineBreaksNumber + 1) * 19) + 40}px` } : { top: '59px' }}
        onClick={() => props.saveNotesList()}
        type="button"
      >
        save
      </button>
    </div>
  );
};

NotesContent.propTypes = {
  selectedNote: PropTypes.shape(),
  handleEditNote: PropTypes.func.isRequired,
  saveNotesList: PropTypes.func.isRequired
};

NotesContent.defaultProps = {
  selectedNote: {}
};

export default NotesContent;
