import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import ContactItem from '..';

const organization = { id: '1', name: 'Test Org' };
const contact = {
  id: '123',
  first_name: 'First',
  last_name: 'Last',
  reverse_contact_assignments: [{ organization }],
};

it('render assigned contact', () => {
  testSnapshotShallow(
    <ContactItem
      onSelect={jest.fn()}
      organization={organization}
      contact={contact}
    />,
  );
});

it('render unassigned contact', () => {
  testSnapshotShallow(
    <ContactItem
      onSelect={jest.fn()}
      organization={organization}
      contact={{ ...contact, reverse_contact_assignments: [] }}
    />,
  );
});

it('render without touchable', () => {
  testSnapshotShallow(
    <ContactItem
      organization={organization}
      contact={{ ...contact, reverse_contact_assignments: [] }}
    />,
  );
});

it('render without last name', () => {
  testSnapshotShallow(
    <ContactItem
      organization={organization}
      contact={{ ...contact, last_name: null }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  renderShallow(
    <ContactItem
      onSelect={onSelect}
      organization={organization}
      contact={contact}
    />,
  )
    .instance()
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
