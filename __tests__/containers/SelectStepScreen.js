import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import SelectStepScreen from '../../src/containers/SelectStepScreen';
import { testSnapshot } from '../../testUtils';

const mockState = {
  steps: {
    suggestedForMe: [],
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SelectStepScreen />
    </Provider>
  );
});