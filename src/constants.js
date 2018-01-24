export const LOGIN = 'app/LOGIN';
export const LOGOUT = 'app/LOGOUT';
export const FIRST_TIME = 'app/FIRST_TIME';
export const STAGES = 'app/STAGES';
export const SELECT_STAGE = 'app/SELECT_STAGE';
export const FIRST_NAME_CHANGED = 'app/FIRST_NAME_CHANGED';
export const LAST_NAME_CHANGED = 'app/LAST_NAME_CHANGED';
export const SAVE_NOTES = 'app/SAVE_NOTES';
export const PERSON_FIRST_NAME_CHANGED = 'app/PERSON_FIRST_NAME_CHANGED';
export const PERSON_LAST_NAME_CHANGED = 'app/PERSON_LAST_NAME_CHANGED';
export const ADD_STEP_REMINDER = 'app/ADD_STEP_REMINDER';
export const REMOVE_STEP_REMINDER = 'app/REMOVE_STEP_REMINDER';
export const PUSH_NOTIFICATION_SHOULD_ASK = 'app/PUSH_NOTIFICATION_SHOULD_ASK';
export const PUSH_NOTIFICATION_ASKED = 'app/PUSH_NOTIFICATION_ASKED';
export const PUSH_NOTIFICATION_SET_TOKEN = 'app/PUSH_NOTIFICATION_SET_TOKEN';
export const PUSH_NOTIFICATION_REMINDER = 'app/PUSH_NOTIFICATION_REMINDER';
export const PEOPLE_WITH_ORG_SECTIONS = 'app/PEOPLE_WITH_ORG_SECTIONS';
export const SWIPE_REMINDER_STEPS_HOME = 'app/SWIPE_REMINDER_STEPS_HOME';
export const SWIPE_REMINDER_STEPS_CONTACT = 'app/SWIPE_REMINDER_STEPS_CONTACT';
export const SWIPE_REMINDER_STEPS_REMINDER = 'app/SWIPE_REMINDER_STEPS_REMINDER';
export const SWIPE_REMINDER_JOURNEY = 'app/SWIPE_REMINDER_JOURNEY';



export const URL_ENCODED = 'application/x-www-form-urlencoded';
export const THE_KEY_CLIENT_ID = '8480288430352167964';

export const CASEY = 'casey';
export const JEAN = 'jean';

export const LINKS = {
  about: 'https://get.missionhub.com',
  help: 'http://help.missionhub.com',
  playStore: 'market://details?id=com.missionhub',
  appleStore: 'itms://itunes.apple.com/us/app/apple-store/id447869440?mt=8',
  terms: 'https://get.missionhub.com/terms-of-service/',
};

export const ANALYTICS_CONTEXT_CHANGED = 'app/ANALYTICS_CONTEXT_CHANGED';

export const ANALYTICS = {
  PAGE_NAME: 'PageName',
  MCID: 'cru.mcid',
  SCREENNAME: 'cru.screenname',
  PREVIOUS_SCREENNAME: 'cru.previousscreenname',
  SITE_SECTION: 'cru.sitesection',
  SITE_SUBSECTION: 'cru.sitesubsection',
  SITE_SUB_SECTION_3: 'cru.subsectionlevel3',
  SITE_SUB_SECTION_4: 'cru.subsectionlevel4',
  CONTENT_AUDIENCE_TARGET: 'cru.contentaudiencetarget',
  CONTENT_TOPIC: 'cru.contenttopic',
  LOGGED_IN_STATUS: 'cru.loggedinstatus',
  SSO_GUID: 'cru.ssoguid',
  GR_MASTER_PERSON_ID: 'cru.grmasterpersonid',
  FACEBOOK_ID: 'cru.facebookid',
  CONTENT_LANGUAGE: 'cru.contentlanguage',
};

export const INTERACTION_TYPES = {
  MHInteractionTypeAssignedContacts: { id: 100, requestFieldName: 'contact_count', iconName: 'peopleIcon', translationKey: 'interactionAssignedContacts' },
  MHInteractionTypeUncontacted: { id: 101, requestFieldName: 'uncontacted_count', iconName: 'spiritualConversationsIcon', translationKey: 'interactionUncontacted' },
  // MHInteractionTypeNote: { id: 1, iconName: '', translationKey: 'interactionNote' },
  MHInteractionTypeSpiritualConversation: { id: 2, iconName: 'spiritualConversationsIcon', translationKey: 'interactionSpiritualConversation' },
  MHInteractionTypeGospelPresentation: { id: 3, iconName: 'gospelIcon', translationKey: 'interactionGospel' },
  MHInteractionTypePersonalDecision: { id: 4, iconName: 'decisionIcon', translationKey: 'interactionDecision' },
  MHInteractionTypeHolySpiritConversation: { id: 5, iconName: 'spiritIcon', translationKey: 'interactionSpirit' },
  // MHInteractionTypeGraduatingOnMission: { id: 6, iconName: '', translationKey: 'interactionNote' },
  MHInteractionTypeDiscipleshipConversation: { id: 9, iconName: 'discipleshipConversationIcon', translationKey: 'interactionDiscipleshipConversation' },
};

export default {

};
