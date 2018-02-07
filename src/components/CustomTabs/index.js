import React, { Component } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../common';
import styles from './styles';

export default class CustomTabs extends Component {
  constructor(props) {
    super(props);
    this.icons = [];
  }

  goToTab(i) {
    Keyboard.dismiss();
    this.props.goToPage(i);
  }

  render() {
    return (
      <View style={[ styles.tabs, this.props.style ]}>
        {this.props.tabArray.map((tab, i) => {
          return (
            <TouchableOpacity key={tab.iconName} onPress={() => this.goToTab(i)} style={styles.tab}>
              <Icon
                name={tab.iconName}
                type="MissionHub"
                size={32}
                style={{ color: this.props.activeTab === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)' }}
                ref={(icon) => { this.icons[i] = icon; }}
              />
              <Text style={[ styles.tabText, { color: this.props.activeTab === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)' } ]}>{tab.tabLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

CustomTabs.propTypes = {
  tabArray: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  goToPage: PropTypes.func,
};
