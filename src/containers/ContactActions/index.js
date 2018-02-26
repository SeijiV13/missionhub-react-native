import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { INTERACTION_TYPES } from '../../constants';
import { addNewInteraction } from '../../actions/interactions';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { navigatePush } from '../../actions/navigation';
import { Flex, Icon, Text, Touchable } from '../../components/common';
import styles from './styles';
import { trackAction } from '../../actions/analytics';

const ACTION_ITEMS = Object.values(INTERACTION_TYPES).filter((i) => i.isOnAction);

@translate('actions')
export class ContactActions extends Component {

  handleInteraction = (item, text) => {
    const { person, organization } = this.props;
    this.props.dispatch(addNewInteraction(person.id, item.id, text, organization && organization.id));
    this.props.dispatch(trackAction(item.tracking));
  }

  handleCreateInteraction = (item) => {
    this.props.dispatch(navigatePush(ADD_STEP_SCREEN, {
      onComplete: (text) => this.handleInteraction(item, text),
      type: 'interaction',
      hideSkip: item.id === INTERACTION_TYPES.MHInteractionTypeNote.id,
    }));
  }

  renderIcons = (item) => {
    const { t } = this.props;

    return (
      <Flex key={item.id} direction="column" align="center" justify="start" style={styles.rowWrap}>
        <Touchable onPress={()=> this.handleCreateInteraction(item)} style={styles.iconBtn}>
          <Flex self="stretch" align="center" justify="center" style={styles.iconWrap}>
            <Icon name={item.iconName} type="MissionHub" style={styles.icon} />
          </Flex>
        </Touchable>
        <Text style={styles.text}>{t(item.translationKey)}</Text>
      </Flex>
    );
  }

  render() {
    return (
      <Flex direction="row" wrap="wrap" align="center" justify="center" style={styles.container}>
        <Flex direction="row" wrap="wrap" align="start" justify="center" >
          {
            ACTION_ITEMS.map(this.renderIcons)
          }
        </Flex>
      </Flex>
    );
  }
}

export default connect()(ContactActions);
