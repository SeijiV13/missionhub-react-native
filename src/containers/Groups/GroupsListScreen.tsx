import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TFunction } from 'i18next';

import Header from '../../components/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { GroupCardHeight } from '../../components/GroupCardItem/styles';
import { CardVerticalMargin } from '../../components/Card/styles';
import { IconButton, Button } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import { navigateToCommunity } from '../../actions/organizations';
import { resetScrollGroups } from '../../actions/swipe';
import { ACTIONS, GROUPS_TAB, GLOBAL_COMMUNITY_ID } from '../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../routes/constants';
import TrackTabChange from '../TrackTabChange';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { SwipeState } from '../../reducers/swipe';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';

import styles from './styles';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';
import {
  GetCommunities,
  GetCommunities_communities_nodes,
} from './__generated__/GetCommunities';

export const GET_COMMUNITIES_QUERY = gql`
  query GetCommunities($communityCursor: String) {
    globalCommunity {
      usersReport {
        usersCount
      }
    }
    communities(
      ministryActivitiesOnly: true
      sortBy: name_ASC
      first: 10
      after: $communityCursor
    ) {
      nodes {
        id
        name
        unreadCommentsCount
        userCreated
        communityPhotoUrl
        owner: people(permissions: [owner]) {
          nodes {
            firstName
            lastName
          }
        }
        report(period: "P1W") {
          contactCount
          memberCount
          unassignedCount
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

interface GroupsListScreenProps {
  dispatch: ThunkDispatch<
    { organizations: OrganizationsState },
    null,
    AnyAction
  >;
  isAnonymousUser: boolean;
  scrollToId: string | null;
}

const createGlobalCommunity = (t: TFunction, usersCount: number) =>
  ({
    __typename: 'Community',
    id: GLOBAL_COMMUNITY_ID,
    name: t('globalCommunity'),
    unreadCommentsCount: 0,
    userCreated: true,
    communityPhotoUrl: null,
    owner: { __typename: 'PersonConnection', nodes: [] },
    report: {
      __typename: 'CommunitiesReport',
      contactCount: 0,
      unassignedCount: 0,
      memberCount: usersCount,
    },
  } as GetCommunities_communities_nodes);

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItemLayout = (_: any, index: number) => {
  const ItemHeight = GroupCardHeight + CardVerticalMargin * 2;
  return { length: ItemHeight, offset: ItemHeight * index, index };
};

const GroupsListScreen = ({
  dispatch,
  isAnonymousUser,
  scrollToId,
}: GroupsListScreenProps) => {
  const { t } = useTranslation('groupsList');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatList = useRef<FlatList<any>>(null);
  const [overflowBottom, setOverflowBottom] = useState(false);
  const [paging, setPaging] = useState(false);
  const [pagingError, setPagingError] = useState(false);

  const {
    data: {
      globalCommunity: { usersReport: { usersCount = 0 } = {} } = {},
      communities: {
        nodes = [],
        pageInfo: { endCursor = null, hasNextPage = true } = {},
      } = {},
    } = {},
    fetchMore,
    refetch,
  } = useQuery<GetCommunities>(GET_COMMUNITIES_QUERY);

  const globalCommunity = createGlobalCommunity(t, usersCount);
  const communities: GetCommunities_communities_nodes[] = [
    globalCommunity,
    ...nodes,
  ];

  const { isRefreshing, refresh } = useRefreshing(refetch);

  const handleNextPage = async () => {
    setPaging(true);
    try {
      await fetchMore({
        variables: { communityCursor: endCursor },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                communities: {
                  ...prev.communities,
                  ...fetchMoreResult.communities,
                  nodes: [
                    ...(prev.communities.nodes || []),
                    ...(fetchMoreResult.communities.nodes || []),
                  ],
                },
              }
            : prev,
      });
    } catch (e) {
      setPagingError(true);
    } finally {
      setPaging(false);
    }
  };

  useEffect(() => {
    function loadGroupsAndScrollToId() {
      // Always load groups when this tab mounts
      if (!scrollToId || !communities || !flatList.current) {
        return;
      }

      const index = communities.findIndex(o => o.id === scrollToId);

      if (index < 0) {
        return;
      }

      try {
        flatList.current.scrollToIndex({
          index,
          viewPosition: index === 0 ? 0 : 0.5,
        });
      } catch (e) {}

      dispatch(resetScrollGroups());
    }

    loadGroupsAndScrollToId();
  }, [communities, scrollToId, flatList]);

  const handlePress = (communityId: string) => {
    dispatch(navigateToCommunity(communityId));
    dispatch(trackActionWithoutData(ACTIONS.SELECT_COMMUNITY));
  };

  const handleOpenMainMenu = () => {
    dispatch(openMainMenu());
  };

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const closeToBottom = isCloseToBottom(nativeEvent);

    if (closeToBottom) {
      if (!overflowBottom && !paging && !pagingError && hasNextPage) {
        handleNextPage();
      }
    } else {
      setPagingError(false);
    }

    setOverflowBottom(closeToBottom);
  };

  const join = () => {
    dispatch(navigatePush(JOIN_BY_CODE_FLOW));
  };

  const create = () => {
    dispatch(
      navigatePush(
        isAnonymousUser
          ? CREATE_COMMUNITY_UNAUTHENTICATED_FLOW
          : CREATE_GROUP_SCREEN,
      ),
    );
  };

  const renderItem = ({ item }: { item: GetCommunities_communities_nodes }) => (
    <GroupCardItem testID="GroupCard" group={item} onPress={handlePress} />
  );

  return (
    <View style={styles.container}>
      <TrackTabChange screen={GROUPS_TAB} />
      <Header
        left={
          <IconButton
            testID="IconButton"
            name="menuIcon"
            type="MissionHub"
            onPress={handleOpenMainMenu}
          />
        }
        title={t('header').toUpperCase()}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button
            testID="joinCommunity"
            type="transparent"
            style={[styles.blockBtn, styles.blockBtnBorderRight]}
            buttonTextStyle={styles.blockBtnText}
            text={t('joinCommunity').toUpperCase()}
            onPress={join}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            testID="createCommunity"
            type="transparent"
            style={styles.blockBtn}
            buttonTextStyle={styles.blockBtnText}
            text={t('createCommunity').toUpperCase()}
            onPress={create}
          />
        </View>
      </View>
      <FlatList
        testID="flatList"
        refreshing={isRefreshing}
        onRefresh={refresh}
        onScroll={handleScroll}
        getItemLayout={getItemLayout}
        style={styles.scrollView}
        ref={flatList}
        data={communities}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
      />
    </View>
  );
};

const mapStateToProps = ({
  auth,
  swipe,
}: {
  auth: AuthState;
  swipe: SwipeState;
}) => ({
  isAnonymousUser: !!auth.upgradeToken,
  scrollToId: swipe.groupScrollToId,
});

export default connect(mapStateToProps)(GroupsListScreen);
