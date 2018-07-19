import React from 'react';
import MockDate from 'mockdate';

import GroupCelebrate, { mapStateToProps } from '../Celebrate';
import {
  renderShallow,
  testSnapshotShallow,
  createMockStore,
} from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { celebrationSelector } from '../../../selectors/celebration';

jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/celebration');

MockDate.set('2017-06-18');
const celebrate1 = {
  id: '10',
  celebrateable_type: 'interaction',
  changed_attribute_value: '2018-06-11 00:00:00 UTC',
};
const celebrate2 = {
  id: '20',
  celebrateable_type: 'accepted_challenge',
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};
const celebrate3 = {
  id: '30',
  celebrateable_type: 'contact_assignment',
  changed_attribute_value: '2018-06-10 00:00:00 UTC',
};

const org = {
  id: '1',
  celebrateItems: [celebrate1, celebrate2, celebrate3],
};

const celebrateSelectorReturnValue = [
  {
    id: '1',
    date: celebrate1.changed_attribute_value,
    events: [celebrate1],
  },
  {
    id: '2',
    date: celebrate2.changed_attribute_value,
    events: [celebrate2, celebrate3],
  },
];

const celebratePagination = {
  hasNextPage: true,
  page: 1,
};

const store = {
  organizations: {
    all: [org],
    celebratePagination,
  },
};

describe('mapStateToProps', () => {
  it('provides props correctly', () => {
    organizationSelector.mockReturnValue(org);
    celebrationSelector.mockReturnValue(celebrateSelectorReturnValue);

    expect(mapStateToProps(store, { organization: org })).toEqual({
      celebrateItems: celebrateSelectorReturnValue,
      pagination: celebratePagination,
    });
  });
});

it('should render correctly', () => {
  testSnapshotShallow(
    <GroupCelebrate organization={org} store={createMockStore(store)} />,
  );
});

it('should submit correctly', () => {
  const data = { id: 'test' };
  const instance = renderShallow(
    <GroupCelebrate organization={org} store={createMockStore(store)} />,
    store,
  ).instance();
  const result = instance.submit(data);
  expect(result).toBe(data);
});
