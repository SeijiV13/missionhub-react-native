import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { getOrganizationContacts } from '../../actions/organizations';
import { navToPersonScreen } from '../../actions/person';
import SearchList from '../../components/SearchList';
import PersonListItem from '../../components/PersonListItem';
import { searchRemoveFilter } from '../../utils/filters';
import { buildUpdatedPagination } from '../../utils/pagination';

import { SEARCH_CONTACTS_FILTER_SCREEN } from './ContactsFilter';
import OnboardingCard, { GROUP_ONBOARDING_TYPES } from './OnboardingCard';
import styles from './styles';

@translate('groupsContacts')
class Contacts extends Component {
  constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      pagination: {
        page: 0,
        hasMore: true,
      },
      filters: {
        // Default filters
        unassigned: {
          id: 'unassigned',
          selected: true,
          text: t('searchFilter:unassigned'),
        },
        // TODO: temporarily remove this until the API supports it
        // time: { id: 'time30', text: t('searchFilter:time30') },
      },
      defaultResults: [],
    };
  }

  componentDidMount() {
    // TODO: Only do this when this tab is focused to improve performance
    // Use the default filters to load in these people
    this.loadContactsWithFilters();
  }

  loadContactsWithFilters = async () => {
    const contacts = await this.handleSearch('');

    this.setState({ defaultResults: contacts });
  };

  handleRemoveFilter = key => {
    return searchRemoveFilter(this, key, ['unassigned', 'time']);
  };

  handleFilterPress = () => {
    const { dispatch, organization } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_CONTACTS_FILTER_SCREEN, {
        onFilter: this.handleChangeFilter,
        organization,
        filters,
      }),
    );
  };

  handleChangeFilter = filters => {
    this.setState({ filters });
    this.handleRefreshSearchList();
  };

  handleSearch = async text => {
    const pagination = {
      page: 0,
      hasMore: true,
    };

    await this.setState({ pagination });

    return this.handleLoadMore(text);
  };

  handleRefreshSearchList = () => {
    if (this.searchList && this.searchList.getWrappedInstance) {
      this.searchList.getWrappedInstance().search();
    }
  };

  handleLoadMore = async text => {
    const { dispatch, organization } = this.props;
    const { filters, pagination } = this.state;

    const result = await dispatch(
      getOrganizationContacts(organization.id, text, pagination, filters),
    );

    const { meta, response } = result;

    this.setState({ pagination: buildUpdatedPagination(meta, pagination) });

    return response;
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(
      navToPersonScreen(person, organization, {
        onAssign: this.handleRefreshSearchList,
      }),
    );
  };

  listRef = c => (this.searchList = c);

  renderItem = ({ item }) => (
    <PersonListItem
      organization={this.props.organization}
      person={item}
      onSelect={this.handleSelect}
    />
  );

  render() {
    const { t } = this.props;
    const { filters, defaultResults } = this.state;
    return (
      <SafeAreaView style={styles.pageContainer}>
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />
          <SearchList
            ref={this.listRef}
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}

Contacts.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default connect()(Contacts);
