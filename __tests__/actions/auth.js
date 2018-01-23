import * as auth from '../../src/actions/auth';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';
import * as constants from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';
import * as people from '../../src/actions/people';
import { ANALYTICS_CONTEXT_CHANGED } from '../../src/constants';
import * as navigation from '../../src/actions/navigation';

const email = 'Roger';
const password = 'secret';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data = `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${email}&password=${password}`;
const mockStore = configureStore([thunk]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
let store;

constants.THE_KEY_CLIENT_ID = mockClientId;

const mockImplementation = (implementation) => {
  return jest.fn().mockImplementation((type) => {
    return (dispatch) => {
      return dispatch(() => implementation(type));
    };
  });
};

beforeEach(() => {
  store = mockStore({});
});

describe('facebook login', () => {
  global.LOG = jest.fn();
  const expectedData = { fb_access_token: fbAccessToken };

  callApi.default = jest.fn();

  it('should log in to Facebook', () => {
    return store.dispatch(auth.facebookLoginAction(fbAccessToken)).then(() => {
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.FACEBOOK_LOGIN, {}, expectedData);
    });
  });
});

describe('key login', () => {
  callApi.default = mockImplementation((type) => {
    if (type === REQUESTS.KEY_GET_TICKET) {
      return Promise.resolve({ ticket: ticket });
    } else {
      return Promise.resolve({});
    }
  });

  const loggedInAction = { type: ANALYTICS_CONTEXT_CHANGED, loggedInStatus: true };
  analytics.updateLoggedInStatus = jest.fn().mockReturnValue(loggedInAction);

  it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then update logged-in status', () => {
    return store.dispatch(auth.keyLogin(email, password))
      .then(() => {
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_LOGIN, {}, data);
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });

        expect(store.getActions()[0]).toBe(loggedInAction);
      });
  });
});

describe('onSuccessfulLogin', () => {
  const user = { pathway_stage_id: null };
  const person = { pathway_stage_id: null };

  const peopleAction = { findAll: () => [ user ] };
  people.getMe = mockImplementation(() => peopleAction);

  const peopleListAction = { findAll: () => [ { reverse_contact_assignments: [ person ] }] };
  people.getPeopleList = mockImplementation(() => peopleListAction);

  navigation.navigatePush = (screen) => ({ type: screen });

  it('should navigate to Get Started', async() => {
    user.pathway_stage_id = null;
    const store = mockStore({});

    await store.dispatch(auth.onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'GetStarted' }]);
  });

  it('should navigate to Add Someone', async() => {
    user.pathway_stage_id = 4;
    const store = mockStore({});

    await store.dispatch(auth.onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'AddSomeone' }]);
  });

  it('should navigate to Main Tabs', async() => {
    user.pathway_stage_id = 5;
    person.pathway_stage_id = 2;
    const store = mockStore({});

    await store.dispatch(auth.onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'MainTabs' }]);
  });
});