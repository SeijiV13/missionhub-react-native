import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME, LOGIN_WITH_MINISTRIES } from '../constants';
import { navigateReset } from './navigation';
import { getMe } from './people';
import { getStages } from './stages';
import { clearAllScheduledNotifications, setupPushNotifications } from './notifications';
import callApi, { REQUESTS } from './api';

export function keyLogin(username, password) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${username}&password=${password}`;

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data))
      .then((response) => {
        return dispatch(getKeyTicket(response.access_token));
      })
      .catch((error) => {
        LOG('error logging in', error);
      });
  };
}

function getKeyTicket() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}))
      .then((response) => {
        return dispatch(loginWithTicket(response.ticket));
      })
      .catch((error) => {
        LOG('error getting ticket', error);
      });
  };
}

function loginWithTicket(ticket) {
  const data = {
    code: ticket,
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data))
      .catch((error) => {
        LOG('error logging in with ticket', error);
      });
  };
}

export function loginWithMinistries() {
  return (dispatch) => {
    dispatch({ type: LOGIN_WITH_MINISTRIES });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset('Login'));
    dispatch(clearAllScheduledNotifications());
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(setupPushNotifications());
    dispatch(getMe());
    dispatch(getStages());
  };
}

