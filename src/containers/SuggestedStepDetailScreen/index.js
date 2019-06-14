import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';

import styles from './styles';

@withTranslation('suggestedStepDetail')
class SuggestedStepDetailScreen extends Component {
  addStep = async () => {
    const { dispatch, step, receiverId, orgId, next } = this.props;

    await dispatch(addStep(step, receiverId, orgId));
    dispatch(next({ contactId: receiverId, orgId }));
  };

  render() {
    const {
      t,
      step: { body, description_markdown },
    } = this.props;
    const { centerContent } = styles;

    return (
      <StepDetailScreen
        CenterHeader={null}
        RightHeader={null}
        CenterContent={<View style={centerContent} />}
        text={body}
        markdown={description_markdown}
        bottomButtonProps={{
          onPress: this.addStep,
          text: t('addStep'),
        }}
      />
    );
  }
}

SuggestedStepDetailScreen.propTypes = {
  step: PropTypes.object.isRequired,
  receiverId: PropTypes.string.isRequired,
  orgId: PropTypes.string,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step, receiverId, orgId },
      },
    },
  },
) => ({
  step,
  receiverId,
  orgId,
});
export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
