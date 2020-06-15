import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import CommunityFeed from '../GroupCelebrate';
import { renderWithContext } from '../../../../testUtils';
import { refreshCommunity } from '../../../actions/organizations';
import { organizationSelector } from '../../../selectors/organizations';
import { orgPermissionSelector } from '../../../selectors/people';
import {
  ORG_PERMISSIONS,
  GLOBAL_COMMUNITY_ID,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../constants';
import { Organization } from '../../../reducers/organizations';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { CommunitiesCollapsibleHeaderContext } from '../../Communities/Community/CommunityHeader/CommunityHeader';

jest.mock('../../../actions/organizations');
jest.mock('../../../actions/celebration');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/people');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../CommunityFeed', () => ({
  CommunityFeed: 'CommunityFeed',
}));

MockDate.set('2017-06-18');

const myId = '123';
const orgId = '1';
const org: Organization = {
  id: orgId,
  user_created: false,
};

const initialState = {
  organizations: { all: [org] },
  auth: { person: { id: myId } },
};

beforeEach(() => {
  (refreshCommunity as jest.Mock).mockReturnValue({
    type: 'refreshed community',
  });
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(org);
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.USER,
  });
});

it('should render correctly', () => {
  renderWithContext(
    <CommunityFeed
      collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
    />,
    {
      initialState,
      navParams: {
        communityId: orgId,
      },
    },
  ).snapshot();
});

describe('refresh', () => {
  describe('owner', () => {
    beforeEach(() => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
        permission_id: ORG_PERMISSIONS.OWNER,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: true,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });

    describe('cru community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: false,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });

    describe('global community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          id: GLOBAL_COMMUNITY_ID,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: GLOBAL_COMMUNITY_ID,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
      });
    });
  });

  describe('admin', () => {
    beforeEach(() => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
        permission_id: ORG_PERMISSIONS.ADMIN,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: true,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'admin' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });

    describe('cru community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: false,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'admin' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });

    describe('global community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          id: GLOBAL_COMMUNITY_ID,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: GLOBAL_COMMUNITY_ID,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'admin' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
      });
    });
  });

  describe('member', () => {
    beforeEach(() => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
        permission_id: ORG_PERMISSIONS.USER,
      });
    });

    describe('user created community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: true,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });

    describe('cru community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          user_created: false,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: orgId,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(org.id);
      });
    });
    describe('global community', () => {
      it('should refresh correctly', () => {
        ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
          ...org,
          id: GLOBAL_COMMUNITY_ID,
        });

        const { getByTestId } = renderWithContext(
          <CommunityFeed
            collapsibleHeaderContext={CommunitiesCollapsibleHeaderContext}
          />,
          {
            initialState,
            navParams: {
              communityId: GLOBAL_COMMUNITY_ID,
            },
          },
        );

        fireEvent(getByTestId('CelebrateFeed'), 'onRefetch');

        expect(useAnalytics).toHaveBeenCalledWith(['community', 'celebrate'], {
          screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
        });
        expect(refreshCommunity).toHaveBeenCalledWith(GLOBAL_COMMUNITY_ID);
      });
    });
  });
});
