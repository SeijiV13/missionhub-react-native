import { formatApiDate } from '../utils/common';
import { getFeed, reloadFeed, CHALLENGE } from '../utils/actions';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { UPDATE_CHALLENGE } from '../constants';

import callApi, { REQUESTS } from './api';
import { reloadGroupCelebrateFeed } from './celebration';
import { navigatePush, navigateBack } from './navigation';

export function getGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(getFeed(CHALLENGE, orgId));
  };
}

export function reloadGroupChallengeFeed(orgId) {
  return dispatch => {
    return dispatch(reloadFeed(CHALLENGE, orgId));
  };
}

export function completeChallenge(item, orgId) {
  const query = {
    challengeId: item.id,
  };
  const bodyData = {
    data: {
      attributes: {
        completed_at: formatApiDate(),
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.COMPLETE_GROUP_CHALLENGE, query, bodyData));
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => {
          dispatch(navigateBack());
        },
      }),
    );
    dispatch(reloadGroupChallengeFeed(orgId));
    // After completing a challenge, reload the group celebrate feed with this new item
    dispatch(reloadGroupCelebrateFeed(orgId));
  };
}

export function joinChallenge(item, orgId) {
  const query = {
    challengeId: item.id,
  };
  const bodyData = {
    data: {
      attributes: {
        community_challenge_id: item.id,
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.ACCEPT_GROUP_CHALLENGE, query, bodyData));
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        onComplete: () => {
          dispatch(navigateBack());
        },
        gifId: 0,
      }),
    );
    dispatch(reloadGroupChallengeFeed(orgId));
    // After joining a challenge, reload the group celebrate feed with this new item
    dispatch(reloadGroupCelebrateFeed(orgId));
  };
}

export function createChallenge(challenge, orgId) {
  const query = {};
  const bodyData = {
    data: {
      attributes: {
        title: challenge.title,
        end_date: challenge.date,
        organization_id: orgId,
      },
    },
  };
  return async dispatch => {
    await dispatch(callApi(REQUESTS.CREATE_GROUP_CHALLENGE, query, bodyData));
    return dispatch(reloadGroupChallengeFeed(orgId));
  };
}

export function updateChallenge(challenge, orgId) {
  const challenge_id = challenge.id;

  if (!challenge || !challenge_id) {
    return Promise.reject(
      `Invalid Data from updateChallenge: no challenge passed in`,
    );
  }
  const query = {
    challenge_id,
  };
  const attributes = {};
  if (challenge.title) {
    attributes.title = challenge.title;
  }
  if (challenge.date) {
    attributes.end_date = challenge.date;
  }
  const bodyData = { data: { attributes } };
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.UPDATE_GROUP_CHALLENGE, query, bodyData),
    );
    return dispatch({
      type: UPDATE_CHALLENGE,
      challenge: {
        id: challenge_id,
        organization: response.organization,
        title: response.title,
        end_date: response.end_date,
      },
    });
  };
}

export function getChallenge(challenge_id) {
  return async dispatch => {
    const query = {
      challenge_id,
      include: 'accepted_community_challenges.person.full_name',
    };

    const { response } = await dispatch(
      callApi(REQUESTS.GET_GROUP_CHALLENGE, query),
    );
    return dispatch({
      type: UPDATE_CHALLENGE,
      challenge: {
        id: challenge_id,
        ...response,
      },
    });
  };
}
