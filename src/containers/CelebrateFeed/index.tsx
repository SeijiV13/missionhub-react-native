/* eslint-disable max-lines */
import React, { useCallback } from 'react';
import { Animated, View, SectionListData, Text } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { CommunityFeedItem } from '../../components/CommunityFeedItem';
import { keyExtractorId, orgIsGlobal } from '../../utils/common';
import { CreatePostButton } from '../Groups/CreatePostButton';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { CollapsibleScrollViewProps } from '../../components/CollapsibleView/CollapsibleView';
import { CommunityFeedItem as FeedItemFragment } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { momentUtc, isLastTwentyFourHours } from '../../utils/date';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CelebrateFeedPostCards } from '../CelebrateFeedPostCards';

import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from './queries';
import {
  GetCommunityFeed,
  GetCommunityFeedVariables,
  GetCommunityFeed_community_feedItems_nodes,
} from './__generated__/GetCommunityFeed';
import {
  GetGlobalCommunityFeed,
  GetGlobalCommunityFeedVariables,
} from './__generated__/GetGlobalCommunityFeed';
import styles from './styles';

export interface CelebrateFeedProps {
  communityId: string;
  personId?: string;
  itemNamePressable: boolean;
  noHeader?: boolean;
  showUnreadOnly?: boolean;
  onRefetch?: () => void;
  onFetchMore?: () => void;
  onClearNotification?: (post: FeedItemFragment) => void;
  testID?: string;
  filteredFeedType?: FeedItemSubjectTypeEnum;
  collapsibleScrollViewProps?: CollapsibleScrollViewProps;
}

export interface CommunityFeedSection {
  id: number;
  title: string;
  data: FeedItemFragment[];
}

const groupCommunityFeed = (
  items: GetCommunityFeed_community_feedItems_nodes[],
) => {
  const dateSections: CommunityFeedSection[] = [
    { id: 0, title: 'dates.new', data: [] },
    { id: 1, title: 'dates.today', data: [] },
    { id: 2, title: 'dates.earlier', data: [] },
  ];
  items.forEach(item => {
    const itemMoment = momentUtc(item.createdAt);
    if (isLastTwentyFourHours(itemMoment) && !item.read) {
      dateSections[0].data.push(item);
      return;
    }
    if (isLastTwentyFourHours(itemMoment)) {
      dateSections[1].data.push(item);
    } else {
      dateSections[2].data.push(item);
    }
  });
  // Filter out any sections with no data
  const filteredSections = dateSections.filter(
    section => section.data.length > 0,
  );

  return filteredSections;
};

export const CelebrateFeed = ({
  communityId,
  personId,
  itemNamePressable,
  noHeader,
  showUnreadOnly,
  onRefetch,
  onFetchMore,
  onClearNotification,
  filteredFeedType,
  collapsibleScrollViewProps,
}: CelebrateFeedProps) => {
  const { t } = useTranslation('celebrateFeed');
  const isGlobal = orgIsGlobal({ id: communityId });
  const queryVariables = {
    communityId,
    personIds: personId,
    hasUnreadComments: showUnreadOnly,
    subjectType: filteredFeedType,
  };

  const {
    data: {
      community: {
        feedItems: {
          nodes = [],
          pageInfo: { endCursor = null, hasNextPage = false } = {},
        } = {},
      } = {},
      currentUser: { person = undefined } = {},
    } = {},
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<GetCommunityFeed, GetCommunityFeedVariables>(
    GET_COMMUNITY_FEED,
    {
      variables: queryVariables,
      skip: isGlobal,
    },
  );

  const {
    data: {
      globalCommunity: {
        feedItems: {
          nodes: globalNodes = [],
          pageInfo: {
            endCursor: globalEndCursor = null,
            hasNextPage: globalHasNextPage = false,
          } = {},
        } = {},
      } = {},
      currentUser: { person: globalPerson = undefined } = {},
    } = {},
    loading: globalLoading,
    error: globalError,
    fetchMore: globalFetchMore,
    refetch: globalRefetch,
  } = useQuery<GetGlobalCommunityFeed, GetGlobalCommunityFeedVariables>(
    GET_GLOBAL_COMMUNITY_FEED,
    {
      skip: !isGlobal,
    },
  );

  const items = groupCommunityFeed(isGlobal ? globalNodes : nodes);

  const handleRefreshing = () => {
    if (loading || globalLoading) {
      return;
    }

    isGlobal ? globalRefetch() : refetch();
    onRefetch && onRefetch();
  };

  const handleOnEndReached = () => {
    if (loading || error || !hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        feedItemsCursor: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              community: {
                ...prev.community,
                ...fetchMoreResult.community,
                feedItems: {
                  ...prev.community.feedItems,
                  ...fetchMoreResult.community.feedItems,
                  nodes: [
                    ...(prev.community.feedItems.nodes || []),
                    ...(fetchMoreResult.community.feedItems.nodes || []),
                  ],
                },
              },
            }
          : prev,
    });
    onFetchMore && onFetchMore();
  };

  const handleOnEndReachedGlobal = () => {
    if (globalLoading || globalError || !globalHasNextPage) {
      return;
    }

    globalFetchMore({
      variables: {
        feedItemsCursor: globalEndCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              globalCommunity: {
                ...prev.globalCommunity,
                ...fetchMoreResult.globalCommunity,
                feedItems: {
                  ...prev.globalCommunity.feedItems,
                  ...fetchMoreResult.globalCommunity.feedItems,
                  nodes: [
                    ...(prev.globalCommunity.feedItems.nodes || []),
                    ...(fetchMoreResult.globalCommunity.feedItems.nodes || []),
                  ],
                },
              },
            }
          : prev,
    });
    onFetchMore && onFetchMore();
  };

  const renderSectionHeader = useCallback(
    ({
      section: { title },
    }: {
      section: SectionListData<CommunityFeedSection>;
    }) => (
      <View style={styles.header}>
        <Text style={styles.title}>{t(`${title}`)}</Text>
      </View>
    ),
    [],
  );

  const renderItem = ({ item }: { item: FeedItemFragment }) => (
    <CommunityFeedItem
      onClearNotification={onClearNotification}
      feedItem={item}
      namePressable={itemNamePressable}
    />
  );

  const renderHeader = useCallback(
    () => (
      <>
        <ErrorNotice
          message={t('errorLoadingCelebrateFeed')}
          error={error}
          refetch={refetch}
        />
        <ErrorNotice
          message={t('errorLoadingCelebrateFeed')}
          error={globalError}
          refetch={globalRefetch}
        />
        {noHeader ? null : (
          <>
            <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
            <CreatePostButton
              person={person || globalPerson}
              communityId={communityId}
              type={filteredFeedType}
            />
            {filteredFeedType || isGlobal ? null : (
              <CelebrateFeedPostCards
                communityId={communityId}
                // Refetch the feed to update new section once read
                feedRefetch={refetch}
              />
            )}
          </>
        )}
      </>
    ),
    [
      error,
      refetch,
      globalError,
      globalRefetch,
      noHeader,
      communityId,
      personId,
      filteredFeedType,
    ],
  );

  return (
    <Animated.SectionList
      {...collapsibleScrollViewProps}
      sections={items}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractorId}
      onEndReachedThreshold={0.2}
      onEndReached={isGlobal ? handleOnEndReachedGlobal : handleOnEndReached}
      onRefresh={handleRefreshing}
      refreshing={isGlobal ? globalLoading : loading}
      style={styles.list}
      contentContainerStyle={[
        collapsibleScrollViewProps?.contentContainerStyle,
        styles.listContent,
      ]}
      scrollIndicatorInsets={{ right: 1 }} // Fix for scrollbar occasionally floating away from the right https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    />
  );
};
