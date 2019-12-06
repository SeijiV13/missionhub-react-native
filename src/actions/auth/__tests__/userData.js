import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';
import MockDate from 'mockdate';
import * as RNOmniture from 'react-native-omniture';

import * as callApi from '../../api';
import { REQUESTS } from '../../../api/routes';
import { updateLocaleAndTimezone, authSuccess, loadHome } from '../userData';
import { NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { showReminderOnLoad } from '../../notifications';
import { getMyPeople } from '../../people';
import { getMyCommunities } from '../../organizations';
import { getMe } from '../../person';
import { getStagesIfNotExists } from '../../stages';
import { rollbar } from '../../../utils/rollbar.config';

const notificationsResult = { type: 'show notification reminder' };
const getMyCommunitiesResult = { type: 'got communities' };
const getMeResult = { type: 'got me successfully' };
const getPeopleResult = { type: 'get my people' };
const getStagesResult = { type: 'got stages' };
const updateUserResult = { type: 'updated locale and TZ' };

jest.mock('react-native-omniture');
jest.mock('../../notifications');
jest.mock('../../onboarding');
jest.mock('../../organizations');
jest.mock('../../person');
jest.mock('../../people');
jest.mock('../../stages');
jest.mock('../../steps');
callApi.default = jest.fn().mockReturnValue({ type: 'test-action' });

const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const mockStore = configureStore([thunk]);

let store;

beforeEach(() => {
  store = mockStore({
    auth: {
      token: 'testtoken',
      refreshToken,
      upgradeToken,
      person: {
        user: {},
      },
    },
  });
});

describe('updateLocaleAndTimezone', () => {
  it('should update timezone ', () => {
    store = mockStore({
      auth: {
        person: {
          user: {
            timezone: '-8',
            language: 'fr-CA',
          },
        },
      },
    });

    MockDate.set('2018-02-06', 300);
    i18next.language = 'en-US';

    const newUserSettings = {
      data: {
        attributes: {
          timezone: '-5',
          mobile_language: 'en-US',
        },
      },
    };

    store.dispatch(updateLocaleAndTimezone());
    expect(callApi.default).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ME_USER,
      {},
      newUserSettings,
    );
  });
});

describe('authSuccess', () => {
  const personId = '593348';
  const global_registry_mdm_id = 'c6e4fdcf-d638-46b7-a02b-8c6c1cc4af23';

  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          id: personId,
        },
      },
    });

    getMe.mockReturnValue(() =>
      Promise.resolve({
        global_registry_mdm_id,
      }),
    );
  });

  it('should set Rollbar user id', async () => {
    await store.dispatch(authSuccess());

    expect(rollbar.setPerson).toHaveBeenCalledWith(`${personId}`);
  });

  it('should track global registry master person id', async () => {
    await store.dispatch(authSuccess());

    expect(RNOmniture.syncIdentifier).toHaveBeenCalledWith(
      global_registry_mdm_id,
    );
  });
});

describe('loadHome', () => {
  const userSettings = {
    data: {
      attributes: {
        timezone: '-5',
        mobile_language: 'en-US',
      },
    },
  };

  it('loads me, organizations, stages, timezone, and notifications', async () => {
    getMe.mockReturnValue(getMeResult);
    getMyPeople.mockReturnValue(getPeopleResult);
    getMyCommunities.mockReturnValue(getMyCommunitiesResult);
    getStagesIfNotExists.mockReturnValue(getStagesResult);
    showReminderOnLoad.mockReturnValue(notificationsResult);
    callApi.default.mockReturnValue(updateUserResult);

    await store.dispatch(loadHome());

    expect(callApi.default).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ME_USER,
      {},
      userSettings,
    );
    expect(showReminderOnLoad).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.LOGIN,
    );

    expect(store.getActions()).toEqual([
      getMeResult,
      getPeopleResult,
      getMyCommunitiesResult,
      getStagesResult,
      updateUserResult,
      notificationsResult,
    ]);
  });

  it('loads nothing because there is no token', async () => {
    store = mockStore({
      auth: {
        token: '',
        refreshToken,
        upgradeToken,
        person: {
          user: {},
        },
      },
    });
    await store.dispatch(loadHome());

    expect(store.getActions()).toEqual([]);
  });
});
