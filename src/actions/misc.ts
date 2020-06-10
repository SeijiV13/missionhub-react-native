/* eslint max-params: 0, max-lines-per-function: 0 */

import { Linking } from 'react-native';
import gql from 'graphql-tag';

import {
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
} from '../routes/constants';
import { WARN } from '../utils/logging';
import { buildTrackingObj } from '../utils/common';
import { Person } from '../reducers/people';
import { apolloClient } from '../apolloClient';

import { trackActionWithoutData } from './analytics';
import { createContactAssignment } from './person';
import { navigatePush } from './navigation';
import { GetFeatureFlags } from './__generated__/GetFeatureFlags';

export const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags {
    features
  }
`;

export function getFeatureFlags() {
  apolloClient.query<GetFeatureFlags>({
    query: GET_FEATURE_FLAGS,
  });
}

// @ts-ignore
export function openCommunicationLink(url, action) {
  //if someone has a better name for this feel free to suggest.
  // @ts-ignore
  return dispatch =>
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          WARN("Can't handle url: ", url);
          return;
        }

        Linking.openURL(url)
          .then(() => {
            dispatch(trackActionWithoutData(action));
          })
          .catch(err => {
            if ((url || '').includes('telprompt')) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      })
      .catch(err => WARN('An unexpected error happened', err));
}

// @ts-ignore
export function assignContactAndPickStage(person) {
  // @ts-ignore
  return async (dispatch, getState) => {
    const auth = getState().auth;
    const myId = auth.person.id;
    const personId = person.id;

    const { person: resultPerson } = await dispatch(
      createContactAssignment(undefined, myId, personId),
    );

    dispatch(
      navigatePush(SELECT_PERSON_STAGE_FLOW, {
        personId: resultPerson.id,
        undefined,
        section: 'people',
        subsection: 'person',
      }),
    );
  };
}

export function navigateToStageScreen(
  personIsCurrentUser: boolean,
  person: Person,
  // @ts-ignore
  contactAssignment,
  organization = {},
  firstItemIndex: number | undefined, //todo find a way to not pass this
) {
  // @ts-ignore
  return dispatch => {
    if (personIsCurrentUser) {
      dispatch(
        navigatePush(SELECT_MY_STAGE_FLOW, {
          selectedStageId: firstItemIndex,
          personId: person.id,
          section: 'people',
          subsection: 'self',
        }),
      );
    } else {
      dispatch(
        navigatePush(SELECT_PERSON_STAGE_FLOW, {
          selectedStageId: firstItemIndex,
          personId: person.id,
          // @ts-ignore
          orgId: organization.id,
          section: 'people',
          subsection: 'person',
        }),
      );
    }
  };
}

export function navigateToAddStepFlow(
  // @ts-ignore
  personIsCurrentUser,
  // @ts-ignore
  person,
  // @ts-ignore
  organization,
) {
  // @ts-ignore
  return dispatch => {
    const trackingParams = {
      // @ts-ignore
      trackingObj: buildTrackingObj(
        'people : person : steps : add',
        'people',
        'person',
        'steps',
      ),
    };

    if (personIsCurrentUser) {
      dispatch(
        navigatePush(ADD_MY_STEP_FLOW, {
          ...trackingParams,
          personId: person.id,
          organization,
        }),
      );
    } else {
      dispatch(
        navigatePush(ADD_PERSON_STEP_FLOW, {
          ...trackingParams,
          personId: person.id,
          organization,
          // @ts-ignore
          createStepTracking: buildTrackingObj(
            'people : person : steps : create',
            'people',
            'person',
            'steps',
          ),
        }),
      );
    }
  };
}
