import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MemberOptionsMenu from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  transferOrgOwnership,
  getMyCommunities,
  removeOrganizationMember,
} from '../../../actions/organizations';
import { archiveOrgPermission } from '../../../actions/person';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../actions/organizations.js');
jest.mock('../../../actions/person.js');
jest.mock('../../../actions/navigation.js');

const myId = '1';
const otherId = '2';
const organization = { name: "Roge's org", id: '08747283423' };
const personOrgPermission = { id: '25234234' };

const person = { full_name: 'Roge' };
const mockStore = configureStore([thunk]);

let props;
let store;

const test = () => {
  testSnapshotShallow(<MemberOptionsMenu {...props} />);
};

describe('MemberOptionsMenu', () => {
  describe('for me, as owner', () => {
    beforeEach(() =>
      (props = {
        myId,
        person: {
          ...person,
          id: myId,
        },
        iAmAdmin: false,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      }));

    it('renders correctly', () => test());

    it('shows an alert message if I attempt to leave', () => {
      Alert.alert = jest.fn();
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      screen.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:ownerLeaveCommunityErrorMessage', {
          orgName: organization.name,
        }),
        null,
        { text: i18next.t('ok') },
      );
    });
  });

  it('renders for admin looking at member', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
    };
    test();
  });

  it('renders for admin looking at admin', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: true,
      organization,
    };
    test();
  });

  describe(' looking at member, when I am owner', () => {
    beforeEach(() =>
      (props = {
        myId,
        person: {
          ...person,
          id: otherId,
        },
        iAmAdmin: true,
        iAmOwner: true,
        personIsAdmin: false,
        organization,
      }));

    it('renders correctly', () => test());

    it('transfers ownership', () => {
      transferOrgOwnership.mockReturnValue({ type: 'transferred ownership' });
      const screen = renderShallow(<MemberOptionsMenu {...props} />);

      screen.instance().makeOwner();

      expect(transferOrgOwnership).toHaveBeenCalledWith(
        organization.id,
        otherId,
      );
    });
  });

  it('renders for owner looking at admin', () => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: true,
      personIsAdmin: true,
      organization,
    };
    test();
  });
});

describe('confirm screen', () => {
  Alert.alert = jest.fn();

  beforeEach(() => {
    Alert.alert.mockClear();

    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
    };
  });

  describe('Make Admin', () => {
    it('displays confirm screen', () => {
      const component = renderShallow(<MemberOptionsMenu {...props} />);

      component.props().actions[0].onPress();

      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('groupMemberOptions:makeAdmin:modalTitle', {
          personName: person.full_name,
          communityName: organization.name,
        }),
        i18next.t('groupMemberOptions:makeAdmin:modalDescription'),
        [
          {
            text: i18next.t('cancel'),
            style: 'cancel',
          },
          {
            text: i18next.t('groupMemberOptions:makeAdmin:confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
    });
  });
});

describe('Leave Community', () => {
  const getMyCommunitiesResult = { type: 'got communities' };
  const navigateBackResult = { type: 'navigated back' };

  beforeEach(() => {
    props = {
      myId,
      person: {
        ...person,
        id: myId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
      personOrgPermission,
    };

    store = mockStore();
  });

  it('sends api request to archive my permission', async () => {
    archiveOrgPermission.mockReturnValue(() => Promise.resolve());
    getMyCommunities.mockReturnValue(getMyCommunitiesResult);
    navigateBack.mockReturnValue(navigateBackResult);
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    await screen.instance().leaveCommunity();

    expect(store.getActions()).toEqual([
      getMyCommunitiesResult,
      navigateBackResult,
    ]);
    expect(archiveOrgPermission).toHaveBeenCalledWith(
      myId,
      personOrgPermission.id,
    );
  });
});

describe('Remove from Community', () => {
  const archiveOrgPermissionResult = { type: 'archived permission' };
  const removePersonResult = { type: 'removed person' };

  beforeEach(() => {
    props = {
      myId,
      person: {
        ...person,
        id: otherId,
      },
      iAmAdmin: true,
      iAmOwner: false,
      personIsAdmin: false,
      organization,
      personOrgPermission,
    };

    store = mockStore();
  });

  it("sends api request to archive person's permission", async () => {
    archiveOrgPermission.mockReturnValue(archiveOrgPermissionResult);
    removeOrganizationMember.mockReturnValue(removePersonResult);
    const screen = renderShallow(<MemberOptionsMenu {...props} />, store);

    await screen.instance().removeFromCommunity();

    expect(store.getActions()).toEqual([
      archiveOrgPermissionResult,
      removePersonResult,
    ]);
    expect(archiveOrgPermission).toHaveBeenCalledWith(
      otherId,
      personOrgPermission.id,
    );
    expect(removeOrganizationMember).toHaveBeenCalledWith(
      otherId,
      organization.id,
    );
  });
});
