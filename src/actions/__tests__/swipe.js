import {
  removeSwipeStepsHome,
  removeSwipeStepsContact,
  removeSwipeStepsReminder,
  removeSwipeJourney,
  removeGroupOnboardingCard,
  removeGroupInviteInfo,
  setScrollGroups,
  resetScrollGroups,
} from '../swipe';
import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_INVITE_INFO,
  GROUP_ONBOARDING_CARD,
  GROUP_TAB_SCROLL_ON_MOUNT,
} from '../../constants';

describe('removeSwipeStepsHome', () => {
  it('should return removeSwipeStepsHome', () => {
    expect(removeSwipeStepsHome()).toEqual({ type: SWIPE_REMINDER_STEPS_HOME });
  });
});

describe('removeSwipeStepsContact', () => {
  it('should return removeSwipeStepsContact', () => {
    expect(removeSwipeStepsContact()).toEqual({
      type: SWIPE_REMINDER_STEPS_CONTACT,
    });
  });
});

describe('removeSwipeStepsReminder', () => {
  it('should return removeSwipeStepsReminder', () => {
    expect(removeSwipeStepsReminder()).toEqual({
      type: SWIPE_REMINDER_STEPS_REMINDER,
    });
  });
});

describe('removeSwipeJourney', () => {
  it('should return removeSwipeJourney', () => {
    expect(removeSwipeJourney()).toEqual({ type: SWIPE_REMINDER_JOURNEY });
  });
});

describe('removeGroupInviteInfo', () => {
  it('should return removeGroupInviteInfo', () => {
    expect(removeGroupInviteInfo()).toEqual({ type: GROUP_INVITE_INFO });
  });
});

describe('removeGroupOnboardingCard', () => {
  it('should return the correct action', () => {
    const target = '123';
    expect(removeGroupOnboardingCard(target)).toEqual({
      type: GROUP_ONBOARDING_CARD,
      target,
      value: false,
    });
  });
});

describe('setScrollGroups', () => {
  it('should return setScrollGroups', () => {
    const orgId = '123';
    expect(setScrollGroups(orgId)).toEqual({
      type: GROUP_TAB_SCROLL_ON_MOUNT,
      value: orgId,
    });
  });
});

describe('resetScrollGroups', () => {
  it('should return resetScrollGroups', () => {
    expect(resetScrollGroups()).toEqual({
      type: GROUP_TAB_SCROLL_ON_MOUNT,
      value: null,
    });
  });
});
