import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  },
  error: null,
  loading: false
};

const regStart = state => (updateObject(state, {
  error: null,
  loading: true
}));

const regSuccess = (state, action) => (updateObject(state, {
  userData: {
    csk: action.userData.csk,
    cpk: action.userData.cpk,
    address: action.userData.address
  },
  error: null,
  loading: false
}));

const regFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const authStart = state => (updateObject(state, {
  error: null,
  loading: true
}));

const authSuccess = (state, action) => (updateObject(state, {
  userData: {
    csk: action.userData.csk,
    cpk: action.userData.cpk,
    address: action.userData.address
  },
  error: null,
  loading: false
}));

const authFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const authLogout = state => (updateObject(state, {
  userData: {
    csk: null,
    cpk: null,
    address: null
  },
  error: null,
  loading: false
}));
//
// const authCleanError = state => (updateObject(state, {
//   error: null
// }));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.REGISTRATION_START: return regStart(state, action);
      case actionTypes.REGISTRATION_SUCCESS: return regSuccess(state, action);
      case actionTypes.REGISTRATION_FAIL: return regFail(state, action);
      case actionTypes.AUTH_START: return authStart(state, action);
      case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
      case actionTypes.AUTH_FAIL: return authFail(state, action);
      case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
      // case actionTypes.AUTH_CLEAN_ERROR: return authCleanError(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
