import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { Text, Card, Button } from '../common';
import { completeStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { STEP_DETAIL_SCREEN } from '../../containers/StepDetailScreen';
import { CONTACT_STEPS } from '../../constants';

import styles from './styles';
import Icon from '../Icon/index';

@translate('contactSteps')
class AcceptedStepItem extends Component {
  handleNavigate = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_DETAIL_SCREEN, { step }));
  };

  handleCompleteStep = async () => {
    const { dispatch, step, onComplete } = this.props;
    const { receiver, organization = {} } = step;

    await dispatch(completeStep(step, CONTACT_STEPS));
    dispatch(reloadJourney(receiver.id, organization.id));

    onComplete && onComplete();
  };

  handleSetReminder = () => {};

  render() {
    const {
      t,
      step: { title, completed_at },
    } = this.props;
    const {
      card,
      reminderButton,
      bellIcon,
      reminderText,
      stepText,
      iconButton,
      checkIcon,
    } = styles;

    return (
      <Card onPress={this.handleNavigate} style={card}>
        <View flex={1} flexDirection="row" alignItems="center">
          <View flex={1} flexDirection="column">
            <View flexDirection="row">
              <Button
                type="transparent"
                style={reminderButton}
                onPress={this.handleSetReminder}
              >
                <View flexDirection="row">
                  <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
                  <Text style={reminderText}>{t('setReminder')}</Text>
                </View>
              </Button>
            </View>
            <Text style={stepText}>{title}</Text>
          </View>
          <Button onPress={this.handleCompleteStep} style={iconButton}>
            <Image
              source={completed_at ? GREY_CHECKBOX : BLUE_CHECKBOX}
              style={checkIcon}
            />
          </Button>
        </View>
      </Card>
    );
  }
}

AcceptedStepItem.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired,
    completed_at: PropTypes.string,
    receiver: PropTypes.object.isRequired,
    organization: PropTypes.object,
  }).isRequired,
  onComplete: PropTypes.func,
};

export default connect()(AcceptedStepItem);
