import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush, navigateBack } from '../../actions/navigation';
import { removeSwipeStepsContact } from '../../actions/swipe';
import {
  getContactSteps,
  completeStep,
  deleteStepWithTracking,
} from '../../actions/steps';
import { reloadJourney } from '../../actions/journey';
import { Flex, Button } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/footprints.png';
import { buildTrackingObj, getAnalyticsSubsection } from '../../utils/common';
import { promptToAssign } from '../../utils/prompt';
import { contactAssignmentSelector } from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
} from '../../actions/misc';
import NullStateComponent from '../../components/NullStateComponent';
import { personSelector } from '../../selectors/people';
import { CONTACT_STEPS } from '../../constants';

import styles from './styles';
import { SELECT_STEP_SCREEN } from '../SelectStepScreen';

@translate('contactSteps')
class ContactSteps extends Component {
  componentDidMount() {
    this.getSteps();
  }

  bumpComplete = () => {
    this.props.dispatch(removeSwipeStepsContact());
  };

  getSteps = () => {
    const { dispatch, person, organization = {} } = this.props;

    dispatch(getContactSteps(person.id, organization.id));
  };

  handleRemove = async step => {
    await this.props.dispatch(deleteStepWithTracking(step, CONTACT_STEPS));
    this.getSteps();
  };

  handleComplete = async step => {
    const { dispatch, person, organization } = this.props;
    await dispatch(completeStep(step, CONTACT_STEPS));
    this.getSteps();
    dispatch(
      reloadJourney(person.id, organization ? organization.id : undefined),
    );
  };

  handleSaveNewSteps = async () => {
    await this.getSteps();
    this.list && this.list.scrollToEnd();
    this.props.dispatch(navigateBack());
  };

  handleNavToStage() {
    const { dispatch, person, contactAssignment, organization } = this.props;

    // TODO: point to stage and step flow
    return dispatch(
      navigateToStageScreen(
        false,
        person,
        contactAssignment,
        organization,
        null,
      ),
    );
  }

  handleNavToSteps() {
    const { dispatch, person, organization } = this.props;
    const subsection = getAnalyticsSubsection(person.id, this.props.myId);
    const trackingParams = {
      trackingObj: buildTrackingObj(
        ['people', `${subsection}`, 'steps'],
        'add',
      ),
    };

    dispatch(
      navigatePush(SELECT_STEP_SCREEN, {
        ...trackingParams,
        personId: person.id,
        orgId: organization.id,
        next: () => () => {
          this.handleSaveNewSteps();
        },
      }),
    );
  }

  async handleAssign() {
    const { dispatch, person, organization, myId } = this.props;

    if (await promptToAssign()) {
      dispatch(assignContactAndPickStage(person, organization, myId));
    }
  }

  handleCreateStep = () => {
    const { contactAssignment, isMe } = this.props;

    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? this.handleNavToSteps()
      : contactAssignment
        ? this.handleNavToStage()
        : this.handleAssign();
  };

  renderRow = ({ item, index }) => {
    const { showBump } = this.props;
    return (
      <RowSwipeable
        key={item.id}
        bump={showBump && index === 0}
        onBumpComplete={this.bumpComplete}
        deletePressProps={[item]}
        completePressProps={[item]}
        onDelete={this.handleRemove}
        onComplete={this.handleComplete}
      >
        <StepItem step={item} type="contact" />
      </RowSwipeable>
    );
  };

  ref = c => (this.list = c);

  keyExtractor = i => i.id;

  renderList() {
    const { steps } = this.props;
    return (
      <FlatList
        ref={this.ref}
        style={styles.list}
        data={steps}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderNull() {
    const name = this.props.person.first_name;
    const { t } = this.props;

    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('header').toUpperCase()}
        descriptionText={t('stepNull', { name })}
      />
    );
  }

  render() {
    const { t, steps } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex
          align="center"
          justify="center"
          value={1}
          style={styles.container}
        >
          {steps.length > 0 ? this.renderList() : this.renderNull()}
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateStep}
            text={t('addStep').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

ContactSteps.propTypes = {
  isMe: PropTypes.bool,
  person: PropTypes.object,
  contactAssignment: PropTypes.object,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { swipe, auth, steps, people },
  { person: navPerson, organization = {} },
) => {
  const person =
    personSelector(
      { people },
      { personId: navPerson.id, orgId: organization.id },
    ) || navPerson;

  return {
    showBump: swipe.stepsContact,
    myId: auth.person.id,
    steps:
      steps.contactSteps[`${person.id}-${organization.id || 'personal'}`] || [], // TODO: move to selector
    contactAssignment: contactAssignmentSelector(
      { auth },
      { person, orgId: organization.id },
    ),
    isMe: person.id === auth.person.id,
    person,
  };
};

export default connect(mapStateToProps)(ContactSteps);
