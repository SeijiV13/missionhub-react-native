import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAvoidingView,  View} from 'react-native';
import styles from './styles';
import {Button, Text} from '../../components/common';
import Input from '../../components/Input/index';
import {navigatePush} from '../../actions/navigation';
import {firstNameChanged, lastNameChanged} from '../../actions/profile';
import projectStyles from '../../projectStyles';

class SetupScreen extends Component {
  state = {
    error: false,
  };

  saveAndGoToGetStarted() {
    if (this.props.firstName) {
      this.props.dispatch(navigatePush('GetStarted'));
    } else {
      this.setState({error: true});
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View />

        <View style={{alignItems: 'center'}}>
          <Text style={{fontFamily: 'AmaticSC-Bold', fontSize: 24}}>-FIRST THINGS FIRST-</Text>
          <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 36}]}>What's your name?</Text>
        </View>

        <View style={{paddingTop: 30, paddingLeft: 30, paddingRight: 30}}>
          <View>
            <Text i18n="Profile_Label_FirstName" style={styles.label}/>
            {this.state.error ? <Text style={{color: 'red'}}>This field is required.</Text> : null}
            <Input
              ref={(c) => this.firstName = c}
              onChangeText={(t) => this.props.dispatch(firstNameChanged(t))}
              value={this.props.firstName}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
          </View>

          <View style={{paddingTop: 30}}>
            <Text i18n="Profile_Label_LastName" style={styles.label} />
            <Input
              ref={(c) => this.lastName = c}
              onChangeText={(t) => this.props.dispatch(lastNameChanged(t))}
              value={this.props.lastName}
              returnKeyType="next"
              blurOnSubmit={true}
            />
          </View>
        </View>

        <View style={{alignItems: 'stretch'}}>
          <Button
            type="header"
            onPress={() => this.saveAndGoToGetStarted()}
            text="NEXT"
            style={projectStyles.primaryButtonStyle}
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
