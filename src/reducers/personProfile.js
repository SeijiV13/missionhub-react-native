import { REHYDRATE } from 'redux-persist/constants';
import {PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED} from '../constants';
import {REQUESTS} from '../actions/api';

const initialPersonProfileState = {
  personFirstName: '',
  personLastName: '',
};

function personProfileReducer(state = initialPersonProfileState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.personProfile;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case PERSON_FIRST_NAME_CHANGED:
      return { ...state, personFirstName: action.personFirstName };
    case PERSON_LAST_NAME_CHANGED:
      return { ...state, personLastName: action.personLastName };
    case REQUESTS.CREATE_PERSON.SUCCESS:
      const result = action.results.findAll('person')[0];
      return { ...state, personFirstName: result.first_name, personLastName: result.last_name };
    default:
      return state;
  }
}

export default personProfileReducer;