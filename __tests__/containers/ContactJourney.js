import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import * as navigation from '../../src/actions/navigation';
import ContactJourney from '../../src/containers/ContactJourney';
import {
  createMockNavState,
  renderShallow,
  testSnapshot,
} from '../../testUtils';
import * as common from '../../src/utils/common';

const personId = '123';
const organizationId = 2;

const mockPerson = {
  id: personId,
  first_name: 'ben',
  organizational_permissions: [{ organization_id: organizationId }],
};

const mockJourneyList = [
  { _type: 'accepted_challenge', id: '84472', date: '2010-01-01 12:12:12' },
];

const mockAddComment = jest.fn(() => Promise.resolve());
const mockEditComment = jest.fn(() => Promise.resolve());
jest.mock('react-native-device-info');
jest.mock('../../src/actions/interactions', () => ({
  addNewInteraction: () => mockAddComment,
  editComment: () => mockEditComment,
}));

let store;
let component;

const createMockStore = (id, personalJourney) => {
  const mockState = {
    auth: {
      person: {
        id,
      },
      isJean: true,
    },
    swipe: {
      journey: false,
    },
    journey: {
      personal: personalJourney,
    },
  };

  return configureStore([thunk])(mockState);
};

const createComponent = () => {
  return renderShallow(
    <ContactJourney person={mockPerson} navigation={createMockNavState()} />,
    store,
  );
};

describe('ContactJourney', () => {
  it('renders loading screen correctly', () => {
    store = createMockStore(null, {});
    component = createComponent();

    expect(component).toMatchSnapshot();
  });

  it('renders null screen correctly', () => {
    store = createMockStore(personId, { [personId]: [] });
    component = createComponent();

    expect(component).toMatchSnapshot();
  });

  it('renders screen with steps correctly', () => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    component = createComponent();

    expect(component).toMatchSnapshot();
  });
});

describe('journey methods', () => {
  let component;
  beforeEach(() => {
    store = createMockStore(personId, { [personId]: mockJourneyList });
    component = createComponent().instance();
  });

  it('renders a step row', () => {
    const snap = component.renderRow({
      item: {
        id: '123',
        note: '123',
        _type: 'accepted_challenge',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders an interaction row', () => {
    const snap = component.renderRow({
      item: {
        id: '123',
        comment: '123',
        _type: 'interaction',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders a survey row', () => {
    const snap = component.renderRow({
      item: {
        id: '124',
        text: '124',
        _type: 'answer_sheet',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('renders a stage change row', () => {
    const snap = component.renderRow({
      item: {
        id: '124',
        _type: 'pathway_progression_audit',
      },
    });
    expect(snap).toMatchSnapshot();
  });

  it('handles edit comment', () => {
    const comment = 'test';
    component.handleEditInteraction({ text: comment });

    component.handleEditComment(comment);

    expect(mockEditComment).toHaveBeenCalledTimes(1);
  });

  it('handles edit interaction', () => {
    navigation.navigatePush = jest.fn(screen => ({ type: screen }));
    component.handleEditInteraction({ id: 1 });

    expect(navigation.navigatePush).toHaveBeenCalledTimes(1);
  });
});

it('renders with an organization correctly', () => {
  testSnapshot(
    <Provider
      store={createMockStore(personId, { [personId]: mockJourneyList })}
    >
      <ContactJourney
        person={mockPerson}
        organization={{ id: 1 }}
        navigation={createMockNavState()}
      />
    </Provider>,
  );
});

it('renders with the keyboard visible', () => {
  component = createComponent();

  const instance = component.instance();
  instance.keyboardShow();
  expect(component).toMatchSnapshot();
});

it('renders with the keyboard visible on android', () => {
  component = createComponent();
  common.isAndroid = true;

  const instance = component.instance();
  instance.keyboardShow();
  expect(instance.state.keyboardVisible).toEqual(true);
});

it('sets the keyboard to not visible', () => {
  component = createComponent();

  const instance = component.instance();
  instance.keyboardShow();
  instance.keyboardHide();
  expect(instance.state.keyboardVisible).toEqual(false);
});

it('mounts and sets the keyboard listeners', () => {
  const mockShowListener = 'show';
  const mockHideListener = 'hide';
  common.keyboardShow = jest.fn(() => mockShowListener);
  common.keyboardHide = jest.fn(() => mockHideListener);
  component = createComponent();

  const instance = component.instance();
  expect(instance.keyboardShowListener).toEqual(mockShowListener);
  expect(instance.keyboardHideListener).toEqual(mockHideListener);
});

it('unmounts and runs the keyboard listeners', () => {
  const mockShowListener = jest.fn();
  const mockHideListener = jest.fn();
  common.keyboardShow = jest.fn(() => ({ remove: mockShowListener }));
  common.keyboardHide = jest.fn(() => ({ remove: mockHideListener }));
  component = createComponent();

  const instance = component.instance();
  instance.componentWillUnmount();
  expect(mockShowListener).toHaveBeenCalled();
  expect(mockHideListener).toHaveBeenCalled();
});
