import React from 'react';
import PropTypes from 'prop-types';

import NotesList from './NotesList/NotesList';
import NotesContent from './NotesContent/NotesContent';

import css from './NotesPanel.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const NotesPanel = props => (
  <div
    className={[
      styles.flexBetween,
      styles.h100,
      styles.NotesPanel
    ].join(' ')}
  >
    <NotesList
      notes={props.notes}
      selectNote={id => props.selectNote(id)}
    />
    <NotesContent
      selectedNote={props.selectedNote}
      handleEditNote={val => props.handleEditNote(val)}
      saveNotesList={() => props.saveNotesList()}
    />
  </div>
);

NotesPanel.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedNote: PropTypes.shape(),
  selectNote: PropTypes.func.isRequired,
  handleEditNote: PropTypes.func.isRequired,
  saveNotesList: PropTypes.func.isRequired
};

NotesPanel.defaultProps = {
  selectedNote: {}
};

export default NotesPanel;
