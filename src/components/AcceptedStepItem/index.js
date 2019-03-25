import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { Text, Card, Button } from '../common';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { completeStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../containers/AcceptedStepDetailScreen';
import { CONTACT_STEPS } from '../../constants';
import Icon from '../Icon/index';

import styles from './styles';

@translate('contactSteps')
class AcceptedStepItem extends Component {
  handleNavigate = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  };

  handleCompleteStep = async () => {
    const { dispatch, step, onComplete } = this.props;

    await dispatch(completeStep(step, CONTACT_STEPS));
    onComplete && onComplete();
  };

  handleSetReminder = () => {};

  render() {
    const {
      t,
      step: { title, completed_at, id, reminder },
    } = this.props;
    const {
      card,
      stepText,
      stepTextCompleted,
      iconButton,
      checkIcon,
      reminderButton,
      bellIcon,
      reminderText,
    } = styles;

    return completed_at ? (
      <Card
        flex={1}
        flexDirection="row"
        alignItems="center"
        onPress={this.handleNavigate}
        style={card}
      >
        <View flex={1} flexDirection="column">
          <Text style={[stepText, stepTextCompleted]}>{title}</Text>
        </View>
        <Image source={GREY_CHECKBOX} style={checkIcon} />
      </Card>
    ) : (
      <Card
        flex={1}
        flexDirection="row"
        alignItems="center"
        onPress={this.handleNavigate}
        style={card}
      >
        <View flex={1} flexDirection="column">
          <ReminderButton stepId={id}>
            <View flexDirection="row" style={reminderButton}>
              <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              <ReminderDateText reminder={reminder} />
            </View>
          </ReminderButton>
          <Text style={stepText}>{title}</Text>
        </View>
        <Button onPress={this.handleCompleteStep} style={iconButton}>
          <Image source={BLUE_CHECKBOX} style={checkIcon} />
        </Button>
      </Card>
    );
  }
}

AcceptedStepItem.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired,
    completed_at: PropTypes.string,
    reminder: PropTypes.object,
  }).isRequired,
  onComplete: PropTypes.func,
};

export default connect()(AcceptedStepItem);
