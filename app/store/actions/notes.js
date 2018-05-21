import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';

const getNotesStart = (userData, raftNode) => {
  ipcRenderer.send('get-notes:start', { userData, raftNode });
  return { type: actionTypes.GET_NOTES_START };
};

const getNotesSuccess = notes => ({
  type: actionTypes.GET_NOTES_SUCCESS,
  notes
});

export const getNotes = (userData, raftNode) => dispatch => {
  dispatch(getNotesStart(userData, raftNode));
  ipcRenderer.once('get-notes:complete', (event, notes) => {
    dispatch(getNotesSuccess(notes));
  });
};

const editNotesListStart = (notes, userData, raftNode) => {
  ipcRenderer.send('edit-notes-list:start', { notes, userData, raftNode });
  return { type: actionTypes.EDIT_NOTE_LIST_START };
};

const editNotesListSuccess = notes => ({
  type: actionTypes.EDIT_NOTE_LIST_SUCCESS,
  notes
});

export const editNotesList = (notes, userData, raftNode) => dispatch => {
  dispatch(editNotesListStart(notes, userData, raftNode));
  ipcRenderer.once('edit-notes-list:complete', () => (
    dispatch(editNotesListSuccess(notes))
  ));
};

const deleteNoteStart = (id, userData, raftNode) => {
  ipcRenderer.send('delete-note:start', { id, userData, raftNode });
  return { type: actionTypes.DELETE_NOTE_START };
};

const deleteNoteSuccess = id => ({
  type: actionTypes.DELETE_NOTE_SUCCESS,
  id
});

export const deleteNote = (id, userData, raftNode) => dispatch => {
  dispatch(deleteNoteStart(id, userData, raftNode));
  ipcRenderer.once('delete-note:complete', () => (
    dispatch(deleteNoteSuccess(id))
  ));
};
