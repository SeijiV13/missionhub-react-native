import React from 'react';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';

import GroupsContactList from '..';

const date = '2019-08-25T13:00:00.000';
MockDate.set('2019-08-25 13:00:00', 300);

const person = {
  first_name: 'Test',
  last_name: 'Person',
  full_name: 'Test Person',
};

const organization = {
  id: '900',
  name: "Roge's org",
};

const activity = [
  {
    id: '1',
    created_at: date,
    text: 'Someone had a spiritual conversation',
    comment: 'Some comment',
    type: 'interaction',
    interaction_type_id: '2',
  },
  {
    id: '2',
    created_at: date,
    text: 'Someone else had a spiritual conversation',
    comment: '',
    type: 'interaction',
    interaction_type_id: '2',
  },
  {
    id: '3',
    created_at: date,
    text: 'Someone else had a gospel conversation',
    comment: '',
    type: 'interaction',
    interaction_type_id: '3',
  },
  {
    id: '4',
    created_at: date,
    text: 'Someone else had a spiritual conversation',
  },
  {
    id: '5',
    created_at: date,
    text: 'Someone else had a spiritual conversation',
  },
];

const props = {
  onAssign: jest.fn(),
  activity,
  person,
  organization,
  myId: '1',
};

it('renders activity list', () => {
  renderWithContext(<GroupsContactList {...props} />).snapshot();
});

it('renders empty list', () => {
  renderWithContext(<GroupsContactList {...props} activity={[]} />).snapshot();
});
