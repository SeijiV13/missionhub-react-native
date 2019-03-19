/* eslint max-lines-per-function: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils/index';
import { buildTrackingObj } from '../../../utils/common';
import { SelectPersonStageFlowScreens } from '../selectPersonStageFlow';
import { navigatePush } from '../../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen/index';

jest.mock('../../../actions/navigation');

const myId = '111';
const otherId = '222';
const otherName = 'Other';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const stage = { id: 1 };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: 0 } } },
  personProfile: { id: '1', personFirstName: otherName },
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = SelectPersonStageFlowScreens[screen];

  await store.dispatch(
    renderShallow(
      <Component
        navigation={{
          state: {
            params: navParams,
          },
        }}
      />,
      store,
    )
      .instance()
      .props.next(nextProps),
  );
};

const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('PersonStageScreen next', () => {
  describe('isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'person',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText,
          orgId,
          contactId: otherId,
          contactAssignmentId,
          name: otherName,
        },
        {
          stage,
          contactId: otherId,
          name: otherName,
          orgId,
          isAlreadySelected: true,
        },
      );
    });

    it('should navigate to CelebrationScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
        contactId: otherId,
        orgId,
      });
    });
  });

  describe('not isAlreadySelected', () => {
    beforeEach(async () => {
      await buildAndCallNext(
        PERSON_STAGE_SCREEN,
        {
          section: 'people',
          subsection: 'person',
          firstItem: 0,
          enableBackButton: false,
          noNav: true,
          questionText,
          orgId,
          contactId: otherId,
          contactAssignmentId,
          name: otherName,
        },
        {
          stage,
          contactId: otherId,
          name: otherName,
          orgId,
          isAlreadySelected: false,
        },
      );
    });

    it('should navigate to PersonSelectStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
        contactStage: stage,
        contactId: otherId,
        organization: { id: orgId },
        contactName: otherName,
        createStepTracking: buildTrackingObj(
          'people : person : steps : create',
          'people',
          'person',
          'steps',
        ),
      });
    });
  });
});
