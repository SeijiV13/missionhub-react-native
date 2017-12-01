import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import IconMessageScreen from '../../src/containers/IconMessageScreen/index';
import { Provider } from 'react-redux';

import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {createMockStore} from '../../testUtils/index';
import {testSnapshot} from '../../testUtils';

const mockNextScreen = 'the next screen';
const mockNavigatePush = 'navigate push';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../src/actions/navigation', () => {
  return {
    navigatePush: (screen) => {
      return screen === mockNextScreen ? mockNavigatePush : null;
    },
  };
});

const renderAndTest = (mainText, buttonText, iconPath) => {
  testSnapshot(
    <Provider store={store}>
      <IconMessageScreen mainText={mainText} buttonText={buttonText} iconPath={iconPath} />
    </Provider>
  );
};

it('renders main text correctly', () => {
  renderAndTest('Hello, world!');
});

it('renders button text correctly', () => {
  renderAndTest(null, 'Click me');
});

it('renders icon correctly', () => {
  renderAndTest(null, null, require('../../assets/images/footprints.png'));
});

it('goes to the next screen', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const described = shallow(
    <IconMessageScreen nextScreen={mockNextScreen} />,
    { context: { store: store } }
  );
  const button = described.dive().childAt(2).childAt(0);

  button.simulate('press');

  expect(store.dispatch).toHaveBeenCalledWith(mockNavigatePush);
});