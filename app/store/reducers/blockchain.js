import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  ballance: null,
  success: false,
  error: null,
  loading: false
};

const getBallanceStart = state => (updateObject(state, {
  loading: true
}));

const getBallanceSuccess = (state, action) => (updateObject(state, {
  ballance: action.ballance,
  success: action.success,
  loading: false
}));

const getBallanceFail = (state, action) => (updateObject(state, {
  error: action.error,
  loading: false
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.GET_BALLANCE_START: return getBallanceStart(state, action);
      case actionTypes.GET_BALLANCE_SUCCESS: return getBallanceSuccess(state, action);
      case actionTypes.GET_BALLANCE_FAIL: return getBallanceFail(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
