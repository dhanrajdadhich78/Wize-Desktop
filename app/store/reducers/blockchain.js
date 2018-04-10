import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  balance: null,
  success: false,
  error: null,
  loading: false
};

const getBalanceStart = state => (updateObject(state, {
  loading: true
}));

const getBalanceSuccess = (state, action) => (updateObject(state, {
  balance: action.balance,
  success: action.success,
  loading: false
}));

const getBalanceFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.GET_BALANCE_START: return getBalanceStart(state, action);
      case actionTypes.GET_BALANCE_SUCCESS: return getBalanceSuccess(state, action);
      case actionTypes.GET_BALANCE_FAIL: return getBalanceFail(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
