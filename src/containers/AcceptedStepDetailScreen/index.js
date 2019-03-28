import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button, Icon, Text } from '../../components/common';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import { removeStepReminder } from '../../actions/stepReminders';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';

import styles from './styles';

@translate('acceptedStepDetail')
class AcceptedStepDetailScreen extends Component {
  completeStep = () => {
    const { dispatch, step } = this.props;

    dispatch(completeStep(step, 'Step Detail', true));
  };

  removeStep = () => {
    const { dispatch, step } = this.props;

    dispatch(deleteStepWithTracking(step, 'Step Detail'));
    dispatch(navigateBack());
  };

  handleRemoveReminder = () => {
    const {
      dispatch,
      step: { id },
    } = this.props;
    dispatch(removeStepReminder(id));
  };

  renderReminderButton() {
    const {
      t,
      step: { id },
    } = this.props;
    const {
      reminderButton,
      reminderContainer,
      reminderIconCircle,
      reminderIcon,
      reminderText,
      cancelIconButton,
      cancelIcon,
    } = styles;

    return (
      <ReminderButton stepId={id}>
        <View style={reminderButton}>
          <View style={reminderContainer}>
            <View style={reminderIconCircle}>
              <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
            </View>
            <Text style={reminderText}>{t('stepReminder:setReminder')}</Text>
          </View>
          <Button onPress={this.handleRemoveReminder} style={cancelIconButton}>
            <Icon name="close" type="Material" style={cancelIcon} />
          </Button>
        </View>
      </ReminderButton>
    );
  }

  render() {
    const { t, step } = this.props;
    const { challenge_suggestion, title } = step;
    const { removeStepButton, removeStepButtonText } = styles;

    return (
      <StepDetailScreen
        CenterHeader={null}
        RightHeader={
          <Button
            type="transparent"
            text={t('removeStep').toUpperCase()}
            onPress={this.removeStep}
            style={removeStepButton}
            buttonTextStyle={removeStepButtonText}
          />
        }
        CenterContent={this.renderReminderButton()}
        markdown={
          challenge_suggestion && challenge_suggestion.description_markdown
        }
        text={title}
        bottomButtonProps={{
          onPress: this.completeStep,
          text: t('iDidIt'),
        }}
      />
    );
  }
}

AcceptedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step },
      },
    },
  },
) => ({
  step,
});
export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
