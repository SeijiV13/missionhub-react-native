import i18next from 'i18next';

import { personSelector } from '../../selectors/people';
import { getStageIndex, getAnalyticsSubsection } from '../../utils/common';

export function paramsForStageNavigation(personId, orgId, getState) {
  const {
    auth: { person: authPerson },
    stages: { stages, stagesObj },
    steps,
    people,
  } = getState();

  const isMe = personId === authPerson.id;
  const person = isMe
    ? authPerson
    : personSelector({ people }, { personId, orgId });
  const assignment = isMe
    ? null
    : getReverseContactAssignment(person, orgId, authPerson);
  const stageId = getStageId(isMe, assignment, authPerson);
  const hasHitCount = hasHitThreeSteps(steps, personId);
  const isNotSure = hasNotSureStage(stagesObj, stageId);
  const subsection = getAnalyticsSubsection(personId, authPerson.id);
  const firstItemIndex = getStageIndex(stages, stageId);
  const firstName = isMe ? authPerson.first_name : person.first_name;
  const questionText = getQuestionText(isMe, isNotSure, firstName);

  return {
    hasHitCount,
    isNotSure,
    subsection,
    firstItemIndex,
    questionText,
  };
}

function getReverseContactAssignment(person, orgId, authPerson) {
  return (
    ((person && person.reverse_contact_assignments) || []).find(
      a =>
        a &&
        ((a.organization && a.organization.id === orgId) ||
          (!a.organization && (!orgId || orgId === 'personal'))) &&
        a.assigned_to &&
        a.assigned_to.id === authPerson.id,
    ) || null
  );
}

function getStageId(isMe, assignment, authPerson) {
  return isMe
    ? authPerson.user.pathway_stage_id
    : assignment && assignment.pathway_stage_id >= 0
    ? assignment.pathway_stage_id
    : null;
}

function hasHitThreeSteps(steps, personId) {
  return steps.userStepCount[personId] % 3 === 0;
}

function hasNotSureStage(stagesObj, stageId) {
  return (stagesObj[stageId] || {}).name_i18n === 'notsure_name';
}

function getQuestionText(isMe, isNotSure, name) {
  return isMe
    ? isNotSure
      ? i18next.t('selectStage:meQuestion', {
          name,
        })
      : i18next.t('selectStage:completed3StepsMe')
    : isNotSure
    ? i18next.t('selectStage:completed1Step', {
        name,
      })
    : i18next.t('selectStage:completed3Steps', {
        name,
      });
}
