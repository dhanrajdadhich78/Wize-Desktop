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
  ipcRenderer.once('get-notes:complete', (event, notes) => (
    dispatch(getNotesSuccess(notes))
  ));
};

const createNoteStart = (note, userData, raftNode) => {
  ipcRenderer.send('create-note:start', { note, userData, raftNode });
  return { type: actionTypes.CREATE_NOTE_START };
};

const createNoteSuccess = note => ({
  type: actionTypes.CREATE_NOTE_SUCCESS,
  note
});

export const createNote = (note, userData, raftNode) => dispatch => {
  dispatch(createNoteStart(note, userData, raftNode));
  ipcRenderer.once('create-note:complete', () => (
    dispatch(createNoteSuccess(note))
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
