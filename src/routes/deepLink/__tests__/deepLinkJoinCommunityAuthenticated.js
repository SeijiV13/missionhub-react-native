import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DeepLinkJoinCommunityAuthenticatedScreens } from '../deepLinkJoinCommunityAuthenticated';
import { renderShallow } from '../../../../testUtils';
import callApi from '../../../actions/api';
import { loadHome } from '../../../actions/auth/userData';
import { joinCommunity } from '../../../actions/organizations';
import { GROUP_TAB_SCROLL_ON_MOUNT } from '../../../constants';
import { GROUP_SCREEN } from '../../../containers/Groups/GroupScreen';
import { DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN } from '../../../containers/Groups/DeepLinkConfirmJoinGroupScreen';

jest.mock('../../../actions/api');
jest.mock('../../../actions/auth/userData');
jest.mock('../../../actions/organizations');

const community = { id: '1', community_url: '1234567890123456' };

const store = configureStore([thunk])({
  auth: { person: { id: '1' } },
  onboarding: {
    community,
  },
});

const loadHomeResponse = { type: 'load home' };
const joinCommunityResponse = { type: 'join community' };

beforeEach(() => {
  store.clearActions();
  callApi.mockReturnValue(() => Promise.resolve());
  loadHome.mockReturnValue(loadHomeResponse);
  joinCommunity.mockReturnValue(joinCommunityResponse);
});

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component =
      DeepLinkJoinCommunityAuthenticatedScreens[
        DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN
      ].screen;

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: { params: { communityUrlCode: '1234567890123456' } },
          }}
        />,
        store,
      )
        .instance()
        .props.next({
          community,
        }),
    );

    expect(store.getActions()).toEqual([
      joinCommunityResponse,
      loadHomeResponse,
      {
        type: GROUP_TAB_SCROLL_ON_MOUNT,
        value: '1',
      },
      {
        actions: [
          {
            params: {
              organization: { community_url: '1234567890123456', id: '1' },
            },
            routeName: GROUP_SCREEN,
            type: 'Navigation/NAVIGATE',
          },
        ],
        index: 0,
        key: null,
        type: 'Navigation/RESET',
      },
    ]);
  });
});
