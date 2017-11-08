import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush, navigateBack} from '../../actions/navigation';
import {View, ScrollView} from 'react-native';
import {getStages} from '../../actions/stages';
import {selectStage} from '../../actions/selectStage';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import projectStyles from '../../projectStyles';
import {PRIMARY_BACKGROUND_COLOR} from '../../theme';

class StageScreen extends Component {
  componentWillMount() {
    this.props.dispatch(getStages());
  }

  setStage(id) {
    this.props.dispatch(selectStage(id));
    this.props.dispatch(navigatePush('StageSuccess'));
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <View style={{flex: 1}}>
          <Button text="Back" onPress={() => this.props.dispatch(navigateBack())} />
        </View>
        <View style={{flex: 2}}>
          <Text style={{color: PRIMARY_BACKGROUND_COLOR, fontSize: 18, paddingBottom: 25, textAlign: 'center'}}>{this.props.firstName}, which stage best describes where you are on your journey?</Text>
          <ScrollView horizontal={true}>
            {this.renderStages()}
          </ScrollView>
        </View>
        <View style={{flex: 1}}></View>
      </Flex>
    );
  }

  renderStages() {
    if (this.props.stages) {
      return this.props.stages.map(stage =>
        <View key={stage.id} style={{justifyContent: 'space-between', backgroundColor: 'white', width: 250, marginLeft: 20, marginRight: 20}}>
          <View>
            <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 42, color: PRIMARY_BACKGROUND_COLOR, textAlign: 'center'}]}>{stage.name}</Text>
            <Text style={[projectStyles.primaryTextStyle, {color: '#505256', textAlign: 'center'}]}>{stage.description}</Text>
          </View>

          <Button
            style={{backgroundColor: PRIMARY_BACKGROUND_COLOR, alignItems: 'center'}}
            onPress={() => this.setStage(stage.id)}
            text="I AM HERE"
          />
        </View>
      );
    }

    return null;
  }
}

const mapStateToProps = ({profile, stages}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
  stages: stages.stages,
});

export default connect(mapStateToProps)(StageScreen);
