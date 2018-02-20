import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';

import {
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
} from '../../src/constants';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import { setupPushNotifications, registerPushDevice, shouldRunSetUpPushNotifications, disableAskPushNotification, enableAskPushNotification, noNotificationReminder, showReminderScreen } from '../../src/actions/notifications';
import { mockFnWithParams } from '../../testUtils';
import { NOTIFICATION_OFF_SCREEN } from '../../src/containers/NotificationOffScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../src/containers/NotificationPrimerScreen';
import * as navigation from '../../src/actions/navigation';
import * as notifications from '../../src/actions/notifications';

let store;
const token = '123';

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn((params) => {
    params.onRegister({ token: '123' });
    params.onNotification({ foreground: true, userInteraction: false });
  }),
  requestPermissions: jest.fn(() => Promise.resolve()),
}));


beforeEach(() => store = configureStore([ thunk ])());

const mockApi = (result, ...expectedParams) => mockFnWithParams(api, 'default', result, ...expectedParams);

describe('register push token', () => {
  beforeEach(() => store = configureStore([ thunk ])());
  const expectedData = {
    data: {
      type: 'push_notification_device_token',
      attributes: {
        token,
        platform: 'GCM',
      },
    },
  };
  const action = { type: 'registered' };

  beforeEach(() => mockApi(action, REQUESTS.SET_PUSH_TOKEN, {}, expectedData));

  it('should get people list', () => {
    store.dispatch(registerPushDevice(token));

    expect(store.getActions()[0]).toBe(action);
  });
});

describe('set push token', () => {
  const expectedData = {
    data: {
      type: 'push_notification_device_token',
      attributes: {
        token,
        platform: 'GCM',
      },
    },
  };
  const action = { type: 'registered' };

  beforeEach(() => mockApi(action, REQUESTS.SET_PUSH_TOKEN, {}, expectedData));

  beforeEach(() => store = configureStore([ thunk ])({
    notifications: {
      shouldAsk: true,
      token: null,
      isRegistered: false,
    },
  }));

  it('should not call configure', () => {
    store = configureStore([ thunk ])({
      notifications: {
        shouldAsk: false,
        token: null,
        isRegistered: false,
      },
    });
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(0);
  });
  it('should not call configure with isRegistered true and token exists', () => {
    store = configureStore([ thunk ])({
      notifications: {
        token: '123',
        isRegistered: true,
      },
    });
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(0);
  });
  it('should call configure', () => {
    store.dispatch(setupPushNotifications());

    expect(PushNotification.configure).toHaveBeenCalledTimes(1);
  });
  it('should call configure and onRegister', () => {
    store.dispatch(setupPushNotifications());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SET_TOKEN, token: '123' });
    expect(store.getActions()[1]).toBe(action);
  });
  it('should call configure and push notifications asked', () => {
    store.dispatch(setupPushNotifications());

    expect(store.getActions()[2]).toEqual({ type: PUSH_NOTIFICATION_ASKED });
  });
  it('should call request permissions', () => {
    PushNotification.configure = jest.fn();
    store.dispatch(setupPushNotifications());

    expect(PushNotification.requestPermissions).toHaveBeenCalledTimes(4);
  });
});

describe('actions called', () => {
  it('should call disableAskPushNotification', () => {
    store.dispatch(disableAskPushNotification());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SHOULD_ASK, bool: false });
  });
  it('should call enableAskPushNotification', () => {
    store.dispatch(enableAskPushNotification());

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_SHOULD_ASK, bool: true });
  });
  it('should call noNotificationReminder', () => {
    store.dispatch(noNotificationReminder(true));
    store.dispatch(noNotificationReminder(false));

    expect(store.getActions()[0]).toEqual({ type: PUSH_NOTIFICATION_REMINDER, bool: true });
    expect(store.getActions()[1]).toEqual({ type: PUSH_NOTIFICATION_REMINDER, bool: false });
  });
  it('should call showReminderScreen and show notification off screen', () => {
    store = configureStore([ thunk ])({
      notifications: {
        token: null,
        showReminder: true,
        hasAsked: true,
      },
    });
    PushNotification.checkPermissions = jest.fn((cb) => cb(true));
    store.dispatch(showReminderScreen());

    expect(store.getActions()[0].routeName).toEqual(NOTIFICATION_OFF_SCREEN);
  });
  it('should call showReminderScreen and show notification primer screen', () => {
    store = configureStore([ thunk ])({
      notifications: {
        token: null,
        showReminder: true,
        hasAsked: false,
      },
    });
    store.dispatch(showReminderScreen());

    expect(store.getActions()[0].routeName).toEqual(NOTIFICATION_PRIMER_SCREEN);
  });
  it('should call showReminderScreen and show nothing', () => {
    store = configureStore([ thunk ])({
      notifications: {
        showReminder: false,
      },
    });
    store.dispatch(showReminderScreen());

    expect(store.getActions().length).toEqual(0);
  });
  it('should call showReminderScreen and show notification off screen onClose', () => {

    navigation.navigatePush = (screen, params) => () => params.onClose(true);
    notifications.setupPushNotifications = jest.fn();

    store = configureStore([ thunk ])({
      notifications: {
        token: null,
        showReminder: true,
        hasAsked: true,
        shouldAsk: true,
      },
    });
    store.dispatch(showReminderScreen());

    expect(store.getActions()[0].type).toEqual(PUSH_NOTIFICATION_SHOULD_ASK);
    expect(store.getActions()[0].bool).toEqual(true);

    expect(store.getActions()[1].type).toEqual(PUSH_NOTIFICATION_ASKED);
    expect(store.getActions()[2].type).toEqual('Navigation/BACK');
  });
  it('should call showReminderScreen and show notification primer screen onComplete', () => {
    navigation.navigatePush = (screen, params) => () => params.onComplete(true);

    store = configureStore([ thunk ])({
      notifications: {
        token: null,
        showReminder: true,
        hasAsked: false,
      },
    });
    store.dispatch(showReminderScreen());

    expect(store.getActions()[0].type).toEqual('Navigation/BACK');
  });
});

describe('should set up', () => {
  it('shouldRunSetUpPushNotifications', () => {
    store = configureStore([ thunk ])({
      notifications: {
        token: '123',
      },
    });
    PushNotification.checkPermissions = jest.fn((cb) => cb({ alert: false }));
    notifications.setupPushNotifications = jest.fn();
    store.dispatch(shouldRunSetUpPushNotifications());
    expect(notifications.setupPushNotifications).toHaveBeenCalledTimes(0);
  });
});
