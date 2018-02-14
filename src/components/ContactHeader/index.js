import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import i18next from '../../i18n';

import { Flex, Text, IconButton } from '../common';
import styles from './styles';
import PillButton from '../PillButton';
import SecondaryTabBar from '../SecondaryTabBar';
import { CASEY, JEAN } from '../../constants';
import { buildTrackingObj } from '../../utils/common';

export const PERSON_STEPS = buildTrackingObj('people : person : steps : steps', 'people', 'person', 'steps');
export const SELF_STEPS = buildTrackingObj('people : self : steps : steps', 'people', 'self', 'steps');
const CASEY_TABS = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: i18next.t('contactHeader:mySteps'),
    tracking: PERSON_STEPS,
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: i18next.t('contactHeader:ourJourney'),
    tracking: buildTrackingObj('people : person : journey : journey', 'people', 'person', 'journey'),
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: i18next.t('contactHeader:myNotes'),
    tracking: buildTrackingObj('people : person : notes : notes', 'people', 'person', 'notes'),
  },
];

const ME_TABS = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: i18next.t('contactHeader:mySteps'),
    tracking: SELF_STEPS,
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: i18next.t('contactHeader:myJourney'),
    tracking: buildTrackingObj('people : self : journey : journey', 'people', 'self', 'journey'),
  },
];

const JEAN_TABS = [
  CASEY_TABS[0],
  {
    page: 'actions',
    iconName: 'actionsIcon',
    tabLabel: i18next.t('contactHeader:myActions'),
    tracking: buildTrackingObj('people : person : actions : actions', 'people', 'person', 'actions'),
  },
  CASEY_TABS[1],
  CASEY_TABS[2],
];

const JEAN_TABS_MH_USER = [
  ...JEAN_TABS,
  {
    page: 'userImpact',
    iconName: 'impactIcon',
    tabLabel: i18next.t('contactHeader:impact'),
    tracking: buildTrackingObj('people : person : impact : impact', 'people', 'person', 'impact'),
  },
];

export default class ContactHeader extends Component {

  constructor(props) {
    super(props);
  }

  getTabs() {
    const { person, type, isMe } = this.props;

    if (isMe) {
      return ME_TABS;
    } else if (type === CASEY) {
      return CASEY_TABS;
    } else if (person.userId) {
      return JEAN_TABS_MH_USER;
    }

    return JEAN_TABS;
  }

  openUrl(url) {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        WARN('Can\'t handle url: ', url);
      } else {
        Linking.openURL(url)
          .catch((err) => {
            if (url.includes('telprompt')) {
            // telprompt was cancelled and Linking openURL method sees this as an error
            // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      }
    }).catch((err) => WARN('An unexpected error happened', err));
  }

  getJeanButtons() {
    const { person } = this.props;
    const numberExists = person.phone_numbers && person.phone_numbers[0];
    const emailExists = person.email_addresses && person.email_addresses[0];
    let phoneNumberUrl;
    let smsNumberUrl;
    let emailUrl;
    if (numberExists) {
      phoneNumberUrl = `tel:${person.phone_numbers[0]}`;
      smsNumberUrl =`sms:${person.phone_numbers[0]}`;
    }
    if (emailExists) {
      emailUrl = `mailto:${person.email_addresses[0]}`;
    }

    return (
      <Flex align="center" justify="center" direction="row">
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!numberExists} style={numberExists ? styles.contactButton : styles.contactButtonDisabled} name="textIcon" type="MissionHub" onPress={()=> this.openUrl(smsNumberUrl)} />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!numberExists} style={numberExists ? styles.contactButton : styles.contactButtonDisabled} name="callIcon" type="MissionHub" onPress={() => this.openUrl(phoneNumberUrl)} />
        </Flex>
        <Flex align="center" justify="center" style={styles.iconWrap}>
          <IconButton disabled={!emailExists} style={[ emailExists ? styles.contactButton : styles.contactButtonDisabled, styles.emailButton ]} name="emailIcon" type="MissionHub" onPress={() => this.openUrl(emailUrl)} />
        </Flex>
      </Flex>
    );
  }

  render() {
    const { person, type, stage, isMe } = this.props;
    const hasStage = stage && stage.name;

    return (
      <Flex value={1} style={styles.wrap} direction="column" align="center" justify="center" self="stretch">
        <Text style={styles.name}>{person.first_name.toUpperCase()}</Text>
        <PillButton
          filled={true}
          text={hasStage ? stage.name.toUpperCase() : i18next.t('contactHeader:selectStage')}
          style={hasStage ? styles.stageBtn : styles.noStage}
          buttonTextStyle={styles.stageBtnText}
          onPress={this.props.onChangeStage}
        />
        { type === JEAN ? this.getJeanButtons() : null }
        <SecondaryTabBar isMe={isMe} person={person} tabs={this.getTabs()} />
      </Flex>
    );
  }
}

ContactHeader.propTypes = {
  person: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  stage: PropTypes.object,
  onChangeStage: PropTypes.func.isRequired,
  isMe: PropTypes.bool.isRequired,
};
