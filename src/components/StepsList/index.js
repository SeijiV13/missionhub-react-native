import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Separator, Touchable, Icon } from '../common';
import Button from '../Button';
import { keyExtractorId } from '../../utils/common';

import styles from './styles';

export default class StepsList extends Component {
  selectStep = item => this.props.onSelectStep(item);
  renderRow = ({ item }) => {
    return (
      <Touchable pressProps={[item]} onPress={this.selectStep}>
        <Flex direction="row" align="center" justify="start" value={1}>
          <Icon
            type="MissionHub"
            name={item.selected ? 'removeStepIcon' : 'addStepIcon'}
            style={styles.addIcon}
          />
          <Text style={styles.stepName}>{item.body}</Text>
        </Flex>
      </Touchable>
    );
  };

  renderFooter = () => {
    const {
      onCreateStep,
      onLoadMoreSteps,
      createStepText,
      loadMoreStepsText,
    } = this.props;
    const {
      separatorWrap,
      addIcon,
      stepName,
      loadMoreStepsButton,
      loadMoreStepsButtonText,
    } = styles;

    return (
      <Flex align="center">
        <Touchable onPress={onCreateStep} style={{ alignSelf: 'stretch' }}>
          <Flex
            direction="row"
            align="center"
            justify="start"
            value={1}
            style={separatorWrap}
          >
            <Icon name="createStepIcon" type="MissionHub" style={addIcon} />
            <Text style={stepName}>{createStepText}</Text>
          </Flex>
        </Touchable>

        <Button
          pill={true}
          text={loadMoreStepsText.toUpperCase()}
          onPress={onLoadMoreSteps}
          style={loadMoreStepsButton}
          buttonTextStyle={loadMoreStepsButtonText}
        />
      </Flex>
    );
  };

  onScrollToEnd() {
    setTimeout(() => this.listView.scrollToEnd(), 200);
  }

  ref = c => (this.listView = c);

  itemSeparatorComponent = (sectionID, rowID) => <Separator key={rowID} />;

  render() {
    return (
      <FlatList
        ref={this.ref}
        keyExtractor={keyExtractorId}
        data={this.props.items}
        renderItem={this.renderRow}
        scrollEnabled={true}
        ListFooterComponent={this.renderFooter}
        ItemSeparatorComponent={this.itemSeparatorComponent}
      />
    );
  }
}

StepsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      selected: PropTypes.bool,
    }),
  ).isRequired,
  createStepText: PropTypes.string.isRequired,
  loadMoreStepsText: PropTypes.string.isRequired,
  onSelectStep: PropTypes.func.isRequired,
  onCreateStep: PropTypes.func.isRequired,
  onLoadMoreSteps: PropTypes.func.isRequired,
};
