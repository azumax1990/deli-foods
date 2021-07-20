import { REQUEST_STATE } from '../constants';

export const initialState = {
  fetchState: REQUEST_STATE.INITIAL,
  foodsList: [],
};

export const foodsTypes = {
  FETCHING: 'FETCHING',
  FETCH_SUCCESS: 'FETCH_SUCCESS'
};

export const foodsReducer = (state, action) => {
  switch (action.type) {
    case foodsTypes.FETCHING:
    return {...state, fetchState: REQUEST_STATE.LOADING};

    case  foodsTypes.FETCH_SUCCESS:
    return {...state, fetchState: REQUEST_STATE.OK, foodsList: action.foodsList};

    default:
      throw new Error();
  }
}