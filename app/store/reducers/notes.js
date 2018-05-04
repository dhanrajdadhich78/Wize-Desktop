import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  notes: [],
  error: null,
  loading: false
};

const actionStart = state => (updateObject(state, {
  loading: true
}));

const getNotes = (state, action) => (updateObject(state, {
  notes: action.notes,
  loading: false
}));

const createNote = (state, action) => (updateObject(state, {
  notes: [
    action.note,
    ...state.notes
  ],
  loading: false
}));

const deleteNote = (state, action) => (updateObject(state, {
  notes: state.notes.filter(el => el.id !== action.id),
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.GET_NOTES_START: return actionStart(state, action);
      case actionTypes.GET_NOTES_SUCCESS: return getNotes(state, action);
      case actionTypes.CREATE_NOTE_START: return actionStart(state, action);
      case actionTypes.CREATE_NOTE_SUCCESS: return createNote(state, action);
      case actionTypes.DELETE_NOTE_START: return actionStart(state, action);
      case actionTypes.DELETE_NOTE_SUCCESS: return deleteNote(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
