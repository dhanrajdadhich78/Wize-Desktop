import { ipcRenderer } from 'electron';
// import axios from 'axios';

import * as actionTypes from './actionTypes';
// import { API_URL } from '../../utils/const';

export const regStart = password => {
  ipcRenderer.send('registration:start', password);
  return { type: actionTypes.REGISTRATION_START };
};

// export const regSuccess = userData => dispatch => {
//   type: actionTypes.REGISTRATION_SUCCESS,
//   userData
// };

// export const regFail = () => ({
//   type: actionTypes.REGISTRATION_FAIL
// });

export const registration = password => dispatch => {
  dispatch(regStart(password));
  ipcRenderer.on('registration:complete', (event, userData) => {
    dispatch({
      type: actionTypes.REGISTRATION_SUCCESS,
      userData: JSON.parse(userData)
    });
  });
};

export const authStart = () => ({
  type: actionTypes.AUTH_START
});

export const authSuccess = authData => ({
  type: actionTypes.AUTH_SUCCESS,
  authData
});

export const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  error: error.message
});

// export const cleanError = () => ({
//   type: actionTypes.AUTH_CLEAN_ERROR
// });
//
// export const logout = () => {
//   localStorage.removeItem('wise-bit-auth-key');
//   localStorage.removeItem('wise-bit-auth-key-expiration-date');
//
//   return {
//     type: actionTypes.AUTH_LOGOUT
//   };
// };
//
// export const auth = (publicKey, aesKey) => (dispatch => {
//   dispatch(authStart());
//   axios.post(
//     `${API_URL}/auth/sign-in`,
//     { publicKey, aesKey },
//     {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       }
//     }
//   )
//     .then(response => {
//       const expirationDate = new Date(new Date().getTime() + (response.data.expiresIn * 1000));
//       localStorage.setItem('wise-bit-auth-key', response.data.accessToken);
//       localStorage.setItem('wise-bit-auth-key-expiration-date', expirationDate);
//
//       dispatch(checkAuthTimeout(response.data.expiresIn));
//
//       dispatch(authSuccess(response.data));
//     })
//     .catch(error => {
//       dispatch(authFail(error.response.data));
//     });
// });
//
// export const checkAuthTimeout = expirationTime => dispatch => (
//   setTimeout(() => (dispatch(logout())), expirationTime * 1000)
// );
//
// export const authCheckState = () => (
//   dispatch => {
//     const authKey = localStorage.getItem('wise-bit-auth-key');
//
//     if (!authKey) {
//       dispatch(logout());
//     } else {
//       const expirationDate = new Date(localStorage.getItem('wise-bit-auth-key-expiration-date'));
//       if (expirationDate <= new Date()) {
//         dispatch(logout());
//       } else {
//         dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
//         dispatch(authSuccess({accessToken: authKey}));
//       }
//     }
//   }
// );
