import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { getReportedComments } from '../../../actions/celebrateComments';
import { orgPermissionSelector } from '../../../selectors/people';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../../Groups/GroupReport';

import ReportCommentNotification from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/navigation');

getReportedComments.mockReturnValue(() => ({ type: 'getReportedComments' }));
navigatePush.mockReturnValue(() => ({ type: 'navigatePush' }));

const mockStore = configureStore([thunk]);
const comment1 = { id: 'reported1' };
const organization = {
  id: '1',
  reportedComments: [comment1],
};
const me = { id: 'myId' };

const store = mockStore({
  organizations: [],
  auth: {
    person: me,
  },
});

beforeEach(() => {
  organizationSelector.mockReturnValue(organization);
  orgPermissionSelector.mockReturnValue({
    permission_id: ORG_PERMISSIONS.OWNER,
  });
});

function buildScreen() {
  return renderShallow(
    <ReportCommentNotification organization={organization} />,
    store,
  );
}

describe('owner', () => {
  it('renders owner with 1 reported comment', () => {
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders owner with 0 reported comment', () => {
    organizationSelector.mockReturnValue({
      ...organization,
      reportedComments: [],
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
});

describe('not owner', () => {
  it('renders admin', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders user', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders contact', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.CONTACT,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
});

it('componentDidMount', () => {
  const screen = buildScreen();
  screen.instance().componentDidMount();

  expect(getReportedComments).toHaveBeenCalledWith(organization.id);
});

it('navigates to group report screen', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .props()
    .onPress();

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
