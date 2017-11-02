import {combineReducers} from 'redux';

import auth from './auth';
import nav from './nav';
import profile from './profile';
import stages from './stages';
import myStageReducer from './myStage';

export default combineReducers({
  auth,
  nav,
  profile,
  stages,
  myStageReducer,
});
