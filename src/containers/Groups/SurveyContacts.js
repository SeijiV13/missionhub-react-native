import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import SearchList from '../../components/SearchList';
import PersonListItem from '../../components/PersonListItem';
import {
  searchRemoveFilter,
  unassignedFilter,
  thirtyDaysFilter,
} from '../../utils/filters';
import { buildTrackingObj } from '../../utils/common';
import Header from '../../components/Header';
import BackButton from '../BackButton';
import { navToPersonScreen } from '../../actions/person';
import { buildUpdatedPagination } from '../../utils/pagination';
import ShareSurveyMenu from '../../components/ShareSurveyMenu';
import { getOrganizationContacts } from '../../actions/organizations';

import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from './SurveyContactsFilter';
import styles from './styles';

@withTranslation('groupsSurveyContacts')
class SurveyContacts extends Component {
  state = {
    pagination: {
      page: 0,
      hasMore: true,
    },
    //Default filters
    filters: {
      unassigned: unassignedFilter(this.props.t, true),
      time: thirtyDaysFilter(this.props.t),
    },
    defaultResults: [],
  };

  componentDidMount() {
    // Use the default filters to load in these people
    this.loadContactsWithFilters();
  }

  loadContactsWithFilters = async () => {
    const contacts = await this.handleLoadMore('');
    this.setState({ defaultResults: contacts });
  };

  handleRemoveFilter = key => {
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    const { dispatch, survey } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_SURVEY_CONTACTS_FILTER_SCREEN, {
        survey,
        onFilter: this.handleChangeFilter,
        filters,
      }),
    );
  };

  handleChangeFilter = filters => {
    this.setState({ filters });
    this.handleRefreshSearchList();
  };

  handleSearch = async text => {
    await this.setState({ pagination: { page: 0, hasMore: true } });
    return this.handleLoadMore(text);
  };

  handleRefreshSearchList = () =>
    this.searchListSearch && this.searchListSearch();

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(
      navToPersonScreen(person, organization, {
        onAssign: this.handleRefreshSearchList,
        trackingObj: buildTrackingObj(
          'communities : surveys : respondants : contact',
          'communities',
          'surveys',
          'respondants',
          'contact',
        ),
      }),
    );
  };

  handleLoadMore = async text => {
    const { dispatch, organization, survey } = this.props;
    const { filters, pagination } = this.state;
    const searchFilters = {
      ...filters,
      survey: { id: survey.id },
    };

    const results = await dispatch(
      getOrganizationContacts(organization.id, text, pagination, searchFilters),
    );

    const { meta, response } = results;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    // Get the results from the search endpoint
    return response;
  };

  setSearch = search => (this.searchListSearch = search);

  renderItem = ({ item }) => {
    const { organization } = this.props;

    return (
      <PersonListItem
        organization={organization}
        person={item}
        onSelect={this.handleSelect}
      />
    );
  };

  render() {
    const { t, organization, survey } = this.props;
    const { filters, defaultResults } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <View style={styles.pageContainer}>
        <Header
          left={<BackButton />}
          title={orgName}
          right={<ShareSurveyMenu survey={survey} header={true} />}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <SearchList
            setSearch={this.setSearch}
            defaultData={defaultResults}
            onFilterPress={this.handleFilterPress}
            listProps={{
              renderItem: this.renderItem,
            }}
            onSearch={this.handleSearch}
            onRemoveFilter={this.handleRemoveFilter}
            onLoadMore={this.handleLoadMore}
            filters={filters}
            placeholder={t('searchPlaceholder')}
          />
        </SafeAreaView>
      </View>
    );
  }
}

SurveyContacts.propTypes = {
  organization: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyContacts);
export const GROUPS_SURVEY_CONTACTS = 'nav/GROUPS_SURVEY_CONTACTS';
