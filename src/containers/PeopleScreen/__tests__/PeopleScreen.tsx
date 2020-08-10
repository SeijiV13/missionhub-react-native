import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { getMyPeople } from '../../../actions/people';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../../routes/constants';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';
import { PeopleScreen } from '..';

jest.mock('react-native-device-info');
jest.mock('react-navigation-hooks');
jest.mock('../../../components/PeopleList', () => 'PeopleList');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/people');
jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/people', () => ({
  getMyPeople: jest.fn(),
}));
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/common');

const orgs = [
  {
    id: 'personal',
    type: 'organization',
    people: [
      {
        id: 1,
        type: 'person',
      },
      {
        id: 2,
        type: 'person',
      },
      {
        id: 3,
        type: 'person',
      },
    ],
  },
  {
    id: 10,
    name: 'org 1',
    type: 'organization',
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
  },
  {
    id: 20,
    name: 'org 2',
    type: 'organization',
    people: [
      {
        id: 21,
        type: 'person',
      },
    ],
  },
];

const people = [
  {
    id: 1,
    type: 'person',
  },
  {
    id: 2,
    type: 'person',
  },
  {
    id: 3,
    type: 'person',
  },
];

const props = {
  hasNoContacts: false,
  items: orgs,
  personId: '1234',
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (common.openMainMenu as jest.Mock).mockReturnValue({
    type: 'open main menu',
  });
});

it('renders empty correctly', async () => {
  const { snapshot } = renderWithContext(
    <PeopleScreen
      {...props}
      items={[{ id: 'me person' }]}
      hasNoContacts={true}
    />,
    {
      initialState: { auth: { person: {} }, stages: {} },
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
});

it('renders correctly as Casey', async () => {
  const { snapshot } = renderWithContext(
    <PeopleScreen {...props} items={people} />,
  );
  await flushMicrotasksQueue();
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
});

it('should open main menu', () => {
  const { getByTestId } = renderWithContext(<PeopleScreen {...props} />);
  fireEvent.press(getByTestId('menuButton'));
  expect(common.openMainMenu).toHaveBeenCalled();
});

describe('handleAddContact', () => {
  describe('press header button', () => {
    it('should navigate to add person flow', () => {
      const { getByTestId } = renderWithContext(<PeopleScreen {...props} />);

      fireEvent.press(getByTestId('header').props.right);

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
        {
          organization: undefined,
        },
      );
    });
  });

  describe('press bottom button', () => {
    it('should navigate to add person flow', () => {
      const { getByTestId } = renderWithContext(
        <PeopleScreen {...props} hasNoContacts={true} />,
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
        {
          organization: undefined,
        },
      );
    });
  });
});

describe('handleRefresh', () => {
  beforeEach(() => {
    (getMyPeople as jest.Mock).mockReturnValue({
      type: 'get people',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (common as any).refresh = jest.fn((_, refreshMethod) => refreshMethod());

    const { getByTestId } = renderWithContext(<PeopleScreen {...props} />);
    fireEvent(getByTestId('peopleList'), 'refresh');
  });

  it('should get people', () => {
    expect(getMyPeople).toHaveBeenCalled();
  });
});
