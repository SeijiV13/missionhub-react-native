import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getMyPeople } from '../../actions/people';
import { navigatePush } from '../../actions/navigation';
import { getStagesIfNotExists } from '../../actions/stages';

import styles from './styles';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../Header';
import { openMainMenu, refresh } from '../../utils/common';
import { CONTACT_SCREEN } from '../ContactScreen';
import { ADD_CONTACT_SCREEN } from '../AddContactScreen';
import { SEARCH_SCREEN } from '../SearchPeopleScreen';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

@translate('peopleScreen')
export class PeopleScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };

    this.getPeople = this.getPeople.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentWillMount() {
    this.getPeople();

    this.props.dispatch(getStagesIfNotExists());
  }

  getPeople() {
    return this.props.dispatch(getMyPeople());
  }

  handleAddContact(org) {
    this.props.dispatch(navigatePush(ADD_CONTACT_SCREEN, {
      organization: org && org.id ? org : undefined,
      isJean: this.props.isJean,
      onComplete: () => this.getPeople(),
    }));
  }

  handleSearch() {
    this.props.dispatch(navigatePush(SEARCH_SCREEN));
    this.props.dispatch(trackAction(ACTIONS.SEARCH_CLICKED, {}));
  }

  handleRowSelect(person, organization) {
    this.props.dispatch(navigatePush(CONTACT_SCREEN, { person, organization }));
  }

  handleRefresh() {
    refresh(this, this.getPeople);
  }

  render() {
    const { people, sectionPeople, isJean, t } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(openMainMenu())} />
          }
          right={
            isJean ? (
              <IconButton
                name="searchIcon"
                type="MissionHub"
                onPress={this.handleSearch} />
            ) : (
              <IconButton
                name="plusIcon"
                type="MissionHub"
                onPress={() => this.handleAddContact()} />
            )
          }
          title={t('header').toUpperCase()}
          shadow={!isJean}
        />
        <PeopleList
          sections={isJean}
          items={isJean ? sectionPeople : people }
          onSelect={this.handleRowSelect}
          onAddContact={this.handleAddContact}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, people, stages }) => ({
  isJean: auth.isJean,
  people: auth.user && auth.user.id ? [ auth.user ].concat(people.all) : people.all,
  sectionPeople: people.allByOrg,
  me: auth.user,
  stagesExist: !!stages.stagesObj,
});

export default connect(mapStateToProps)(PeopleScreen);
