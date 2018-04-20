import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SecondaryTabBar from '../../src/components/SecondaryTabBar/index';
import { testSnapshot } from '../../testUtils/index';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    person: {
      id: '123',
    },
  },
  profile: {
    visiblePersonInfo: {
      contactAssignmentId: '333',
    },
  },
};

const store = createMockStore(mockState);

const tabArray = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: 'My Steps',
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: 'Our Journey',
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: 'My Notes',
  },
];

jest.mock('NativeAnimatedHelper');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SecondaryTabBar person={{ first_name: 'ben', id: 1 }} tabs={tabArray} />
    </Provider>
  );
});
