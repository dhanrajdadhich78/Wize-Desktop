import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  internet: false,
  blockchain: false,
  error: null,
  internetChecking: false
};

const getCredFilesListStart = state => (updateObject(state, {
  // internetChecking: true
}));

const getCredFilesListSuccess = state => (updateObject(state, {
  // internet: true,
  // internetChecking: false
}));

const getCredFilesListFail = state => (updateObject(state, {
  // internet: false,
  // internetChecking: false
}));

const internetCheckStart = state => (updateObject(state, {
  internetChecking: true
}));

const internetCheckSuccess = state => (updateObject(state, {
  internet: true,
  internetChecking: false
}));

const internetCheckFail = state => (updateObject(state, {
  internet: false,
  internetChecking: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.NET_CHECK_START: return internetCheckStart(state, action);
      case actionTypes.NET_CHECK_SUCCESS: return internetCheckSuccess(state, action);
      case actionTypes.NET_CHECK_FAIL: return internetCheckFail(state, action);
      case actionTypes.GET_CRED_FILES_LIST_START: return getCredFilesListStart(state, action);
      case actionTypes.GET_CRED_FILES_LIST_SUCCESS: return getCredFilesListSuccess(state, action);
      case actionTypes.GET_CRED_FILES_LIST_FAIL: return getCredFilesListFail(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
