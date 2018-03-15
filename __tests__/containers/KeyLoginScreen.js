import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { shallow } from 'enzyme/build/index';
import { createMockStore, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';

let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/auth', () => ({
  facebookLoginAction: jest.fn().mockReturnValue({ type: 'test' }),
  keyLogin: jest.fn().mockReturnValue({ type: 'test' }),
}));
jest.mock('../../src/actions/navigation');
jest.mock('react-native-fbsdk', () => ({
  LoginManager: ({
    logInWithReadPermissions: jest.fn().mockReturnValue(Promise.resolve({ isCancelled: true })),
  }),
  AccessToken: ({
    getCurrentAccessToken: jest.fn().mockReturnValue(Promise.resolve({ accessToken: '123' })),
  }),
  GraphRequest: jest.fn((param1, param2, cb) => cb(undefined, {})),
  GraphRequestManager: () => ({ addRequest: () => ({ start: jest.fn() }) }),
}));

beforeEach(() => {
  store = createMockStore();
  Enzyme.configure({ adapter: new Adapter() });
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <KeyLoginScreen />
    </Provider>
  );
});

describe('a login button is clicked', () => {
  let screen;
  const loginResult = { type: 'test' };

  beforeEach(() => {
    screen = shallow(
      <KeyLoginScreen />,
      { context: { store: store } }
    );
  });

  it('facebook login is called', () => {
    screen.dive().dive().dive().find('Button').simulate('press');

    expect(auth.facebookLoginAction).toHaveBeenCalledTimes(0);
  });

  it('key login is called', async() => {
    const credentials = { email: 'klasjflk@lkjasdf.com', password: 'this&is=unsafe' };
    screen = screen.dive().dive().dive();
    screen.setState(credentials);
    auth.keyLogin.mockImplementation((email, password) => {
      return email === credentials.email && password === encodeURIComponent(credentials.password) ? loginResult : undefined;
    });

    await screen.find('Button').simulate('press');

    expect(store.dispatch).toHaveBeenLastCalledWith(loginResult);
  });
});
