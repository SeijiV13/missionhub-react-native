/* eslint max-lines: 0 */
/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { MockStore } from 'redux-mock-store';

import {
  navigatePush,
  navigateBack,
  navigateReset,
  navigateReplace,
  navigateNestedReset,
  navigateResetTab,
  navigateToMainTabs,
  navigateToCelebrateComments,
} from '../navigation';
import { MAIN_TABS, GROUPS_TAB, GLOBAL_COMMUNITY_ID } from '../../constants';
import { loadHome } from '../auth/userData';
import { createThunkStore } from '../../../testUtils';
import { GROUP_UNREAD_FEED_SCREEN } from '../../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { COMMUNITY_TABS } from '../../containers/Communities/Community/constants';

jest.mock('../auth/userData');

let store: MockStore;

const routeName = 'screenName';
const params = { prop1: 'value1' };

const loadHomeResponse = { type: 'loadHome' };

beforeEach(() => {
  store = createThunkStore();
  (loadHome as any).mockReturnValue(loadHomeResponse);
});

describe('navigatePush', () => {
  it('should push new screen onto the stack', () => {
    store.dispatch<any>(navigatePush(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/PUSH',
        routeName,
        params,
      },
    ]);
  });

  it('should push new screen onto the stack with no props', () => {
    store.dispatch<any>(navigatePush(routeName));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/PUSH',
        routeName,
        params: {},
      },
    ]);
  });
});

describe('navigateBack', () => {
  it('should navigate back once', () => {
    store.dispatch<any>(navigateBack());

    expect(store.getActions()).toEqual([
      { type: 'Navigation/BACK', immediate: undefined, key: undefined },
    ]);
  });
  it('should navigate back multiple times', () => {
    store.dispatch<any>(navigateBack(5));

    expect(store.getActions()).toEqual([
      { type: 'Navigation/POP', n: 5, immediate: true },
    ]);
  });
});

describe('navigateReset', () => {
  it('should reset navigation stack', () => {
    store.dispatch<any>(navigateReset(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName,
            params,
          },
        ],
      },
    ]);
  });
  it('should reset navigation stack with no props', () => {
    store.dispatch<any>(navigateReset(routeName));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName,
            params: {},
          },
        ],
      },
    ]);
  });
});

describe('navigateNestedReset', () => {
  const screen1 = 'roger';
  const params1 = { id: '1' };
  const screen2 = 'the dummy';
  const params2 = { id: '2' };

  it('should reset to a nested navigate stack', () => {
    store.dispatch<any>(
      navigateNestedReset([
        { routeName: screen1, params: params1 },
        { routeName: screen2, params: params2 },
      ]),
    );

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 1,
        key: null,
        actions: [
          { type: 'Navigation/NAVIGATE', routeName: screen1, params: params1 },
          { type: 'Navigation/NAVIGATE', routeName: screen2, params: params2 },
        ],
      },
    ]);
  });
});

describe('navigateResetTab', () => {
  const screen1 = 'Tabs Screen';
  const screen2 = 'Specific Tab';

  it('should reset to a specific tab', () => {
    store.dispatch<any>(navigateResetTab(screen1, screen2));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: screen1,
            action: NavigationActions.navigate({ routeName: screen2 }),
          },
        ],
      },
    ]);
  });
});

describe('navigateReplace', () => {
  it('should replace last route in navigation stack', () => {
    store.dispatch<any>(navigateReplace(routeName, params));

    expect(store.getActions()).toEqual([
      {
        type: 'Navigation/REPLACE',
        routeName,
        params,
      },
    ]);
  });
});

describe('navigateToMainTabs', () => {
  it('should dispatch loadHome and then navigate to main tabs', () => {
    store.dispatch<any>(navigateToMainTabs(GROUPS_TAB));

    expect(loadHome).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      { type: 'loadHome' },
      {
        type: 'Navigation/RESET',
        index: 0,
        key: null,
        actions: [
          {
            type: 'Navigation/NAVIGATE',
            routeName: MAIN_TABS,
            action: NavigationActions.navigate({ routeName: GROUPS_TAB }),
          },
        ],
      },
    ]);
  });
});

describe('navigateToCelebrateComments', () => {
  const cruOrgId = '123456';
  const cruOrg = { id: cruOrgId, user_created: false };
  const userCreatedOrgId = '654321';
  const userCreatedOrg = { id: userCreatedOrgId, user_created: true };
  const celebrateItemId = '111';
  const globalCommunity = {
    id: GLOBAL_COMMUNITY_ID,
    name: 'MissionHub Community',
  };

  beforeEach(() => {
    store = createThunkStore({
      organizations: {
        all: [globalCommunity, cruOrg, userCreatedOrg],
      },
    });
  });

  describe('no celebrationItemId', () => {
    describe('Cru org | undefined', () => {
      beforeEach(() => {
        store.dispatch<any>(navigateToCelebrateComments(cruOrg, undefined));
      });

      it('navigates to community celebrate feed if celebrationItemId is not present', () => {
        expect(store.getActions()).toEqual([
          {
            type: 'Navigation/PUSH',
            routeName: COMMUNITY_TABS,
            params: {
              communityId: cruOrgId,
            },
          },
        ]);
      });
    });

    describe('Cru org | null', () => {
      beforeEach(() => {
        store.dispatch<any>(navigateToCelebrateComments(cruOrg, null));
      });

      it('navigates to community celebrate feed if celebrationItemId is not present', () => {
        expect(store.getActions()).toEqual([
          {
            type: 'Navigation/PUSH',
            routeName: COMMUNITY_TABS,
            params: {
              communityId: cruOrgId,
            },
          },
        ]);
      });
    });

    describe('user-created Org | undefined', () => {
      beforeEach(() => {
        store.dispatch<any>(
          navigateToCelebrateComments(userCreatedOrg, undefined),
        );
      });
      it('navigates to community celebrate feed if celebrationItemId is not present', () => {
        expect(store.getActions()).toEqual([
          {
            type: 'Navigation/PUSH',
            routeName: COMMUNITY_TABS,
            params: {
              communityId: userCreatedOrgId,
            },
          },
        ]);
      });
    });

    describe('user-created Org | null', () => {
      beforeEach(() => {
        store.dispatch<any>(navigateToCelebrateComments(userCreatedOrg, null));
      });
      it('navigates to community celebrate feed if celebrationItemId is not present', () => {
        expect(store.getActions()).toEqual([
          {
            type: 'Navigation/PUSH',
            routeName: COMMUNITY_TABS,
            params: {
              communityId: userCreatedOrgId,
            },
          },
        ]);
      });
    });
  });

  describe('Cru org', () => {
    beforeEach(() => {
      store.dispatch<any>(navigateToCelebrateComments(cruOrg, celebrateItemId));
    });

    it('navigates to CELEBRATE_DETAIL_SCREEN', () => {
      expect(store.getActions()).toEqual([
        {
          type: 'Navigation/RESET',
          index: 2,
          key: null,
          actions: [
            {
              type: 'Navigation/NAVIGATE',
              routeName: COMMUNITY_TABS,
              params: { communityId: cruOrgId },
            },
            {
              type: 'Navigation/NAVIGATE',
              routeName: GROUP_UNREAD_FEED_SCREEN,
              params: { organization: cruOrg },
            },
            {
              type: 'Navigation/NAVIGATE',
              routeName: CELEBRATE_DETAIL_SCREEN,
              params: { event: { id: celebrateItemId }, orgId: cruOrgId },
            },
          ],
        },
      ]);
    });
  });

  describe('user-created org', () => {
    beforeEach(() => {
      store.dispatch<any>(
        navigateToCelebrateComments(userCreatedOrg, celebrateItemId),
      );
    });

    it('navigates to CELEBRATE_DETAIL_SCREEN', () => {
      expect(store.getActions()).toEqual([
        {
          type: 'Navigation/RESET',
          index: 2,
          key: null,
          actions: [
            {
              type: 'Navigation/NAVIGATE',
              routeName: COMMUNITY_TABS,
              params: { communityId: userCreatedOrgId },
            },
            {
              type: 'Navigation/NAVIGATE',
              routeName: GROUP_UNREAD_FEED_SCREEN,
              params: { organization: userCreatedOrg },
            },
            {
              type: 'Navigation/NAVIGATE',
              routeName: CELEBRATE_DETAIL_SCREEN,
              params: {
                event: { id: celebrateItemId },
                orgId: userCreatedOrgId,
              },
            },
          ],
        },
      ]);
    });
  });
});
