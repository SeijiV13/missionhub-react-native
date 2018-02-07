import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush, navigateBack } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { removeSwipeStepsContact } from '../../actions/swipe';
import { getStepsByFilter, completeStep, deleteStep } from '../../actions/steps';

import styles from './styles';
import { Flex, Button, Text } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/footprints.png';
import { findAllNonPlaceHolders } from '../../utils/common';

@translate('contactSteps')
class ContactSteps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      steps: [],
    };

    this.bumpComplete = this.bumpComplete.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
    this.handleSaveNewSteps = this.handleSaveNewSteps.bind(this);
    this.getSteps = this.getSteps.bind(this);
  }

  componentWillMount() {
    this.getSteps();
  }

  bumpComplete() {
    this.props.dispatch(removeSwipeStepsContact());
  }

  getSteps() {
    return this.props.dispatch(getStepsByFilter({ completed: false, receiver_ids: this.props.person.id })).then((results) => {
      const steps = findAllNonPlaceHolders(results, 'accepted_challenge');
      this.setState({ steps });
      return results;
    });
  }

  handleRemove(step) {
    this.props.dispatch(deleteStep(step.id)).then(() => {
      this.getSteps();
    });
  }

  handleComplete(step) {
    this.props.dispatch(completeStep(step)).then(() => {
      this.getSteps();
    });
  }

  handleSaveNewSteps() {
    this.getSteps().then(() => {
      this.list.scrollToEnd();
    });
    this.props.dispatch(navigateBack());
  }

  handleCreateStep() {
    if (this.props.isMe) {
      this.props.dispatch(navigatePush('Step', {
        onSaveNewSteps: this.handleSaveNewSteps,
        enableButton: true,
      }));
    } else {
      this.props.dispatch(navigatePush('PersonStep', {
        contactName: this.props.person.first_name,
        contactId: this.props.person.id,
        contact: this.props.person,
        onSaveNewSteps: this.handleSaveNewSteps,
      }));
    }
  }

  renderRow({ item, index }) {
    const { showBump } = this.props;
    return (
      <RowSwipeable
        key={item.id}
        bump={showBump && index === 0}
        onBumpComplete={this.bumpComplete}
        onDelete={() => this.handleRemove(item)}
        onComplete={() => this.handleComplete(item)}
      >
        <StepItem step={item} type="contact" />
      </RowSwipeable>
    );
  }

  renderList() {
    const { steps } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={steps}
        keyExtractor={(i) => i.id}
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
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>{t('header').toUpperCase()}</Text>
        <Text style={styles.nullText}>{t('stepNull', { name })}</Text>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {
            this.state.steps.length > 0 ? this.renderList() : this.renderNull()
          }
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
  person: PropTypes.object,
};

const mapStateToProps = ({ swipe }) => ({
  showBump: swipe.stepsContact,
});

export default connect(mapStateToProps)(ContactSteps);
