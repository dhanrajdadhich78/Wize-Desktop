import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  userData: {
    csk: '90665570941d31da6af6a32ab58a0c81fbd90165be7bbc994d050a7143d9d1a7',
    cpk: '18db234a25b57fd05020bc31444452deec65a425534e2bb2bcf9ce2f01a1b6f97287000eeece78629597d64637851d6e05cd5c2c6fa9d6d1ca410391db967a91',
    address: '14b21WZ21rQcXQfNRdqNcLesjxXcX5PMP4'
  },
  encryptedData: '',
  error: null,
  loading: false
};

const regStart = state => (updateObject(state, {
  loading: true
}));

const regSuccess = (state, action) => (updateObject(state, {
  encryptedData: action.encryptedData,
  loading: false
}));

const regFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const authStart = state => (updateObject(state, {
  loading: true
}));

const authSuccess = (state, action) => (updateObject(state, {
  userData: {
    csk: action.userData.csk,
    cpk: action.userData.cpk,
    address: action.userData.address
  },
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
  loading: false
}));

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
      default: return state;
    }
  }

  return state;
};

export default reducer;
