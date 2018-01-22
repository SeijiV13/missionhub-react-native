import { REHYDRATE } from 'redux-persist/constants';
import { LOGOUT, FIRST_NAME_CHANGED, LAST_NAME_CHANGED, SET_VISIBLE_PERSON_INFO, UPDATE_VISIBLE_PERSON_INFO } from '../constants';
import { REQUESTS } from '../actions/api';

const initialProfileState = {
  firstName: '',
  lastName: '',
};

function profileReducer(state = initialProfileState, action) {
  const results = action.results;

  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.profile;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case FIRST_NAME_CHANGED:
      return {
        ...state,
        firstName: action.firstName,
      };
    case LAST_NAME_CHANGED:
      return {
        ...state,
        lastName: action.lastName,
      };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case LOGOUT:
      return initialProfileState;
    case SET_VISIBLE_PERSON_INFO:
      const { type: _, ...visiblePersonInfo } = action;
      return {
        ...state,
        visiblePersonInfo,
      };
    case UPDATE_VISIBLE_PERSON_INFO:
      const { type: _2, ...updatedVisiblePersonInfo } = action;
      return {
        ...state,
        visiblePersonInfo: {
          ...state.visiblePersonInfo,
          ...updatedVisiblePersonInfo,
        },
      };
    default:
      return state;
  }
}

export default profileReducer;
