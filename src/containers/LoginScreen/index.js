import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';

import {login, firstTime} from '../../actions/auth';
import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import {navigatePush} from '../../actions/navigation';
import projectStyles from '../../projectStyles';

class LoginScreen extends Component {
  buttonTextStyle = {
    color: 'white',
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 14,
  };

  login() {
    this.props.dispatch(login());
    this.navigateToNext();
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext();
  }

  navigateToNext() {
    if (this.props.stageId) {
      this.props.dispatch(navigatePush('MainTabs'));
    } else {
      this.props.dispatch(navigatePush('Welcome'));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 3}} />
        <View style={{flex: 4, justifyContent: 'space-between'}}>
          <View style={{alignItems: 'center'}}>
            <Text>MissionHub</Text>
            <Text style={projectStyles.primaryTextStyle}>Grow closer to God.</Text>
            <Text style={projectStyles.primaryTextStyle}>Help others experience Him.</Text>
          </View>
          <View>
            <Button
              onPress={() => console.log('join')}
              text="SIGN UP WITH FACEBOOK"
              style={{alignItems: 'center'}}
              buttonTextStyle={this.buttonTextStyle}
            />
            <Button
              onPress={() => this.tryItNow()}
              text="TRY IT NOW"
              style={{alignItems: 'center'}}
              buttonTextStyle={this.buttonTextStyle}
            />
          </View>
        </View>
        <View style={{flex: 3, justifyContent: 'flex-end'}}>
          <Button
            style={{alignItems: 'center'}}
            onPress={() => this.login()}
            text="SIGN IN"
            buttonTextStyle={this.buttonTextStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({myStageReducer}) => {
  return {
    stageId: myStageReducer.stageId,
  };
};

export default connect(mapStateToProps)(LoginScreen);
