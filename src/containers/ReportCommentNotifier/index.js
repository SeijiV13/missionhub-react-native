import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getReportedComments } from '../../actions/reportComments';
import { Flex, Text, Card, Icon } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { isOwner, orgIsCru, isAdmin } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';

import styles from './styles';

@translate('groupsReport')
class ReportCommentNotifier extends Component {
  componentDidMount() {
    const { dispatch, organization, isVisible } = this.props;
    if (isVisible) {
      dispatch(getReportedComments(organization.id));
    }
  }

  report = () => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  render() {
    const { t, count, isVisible } = this.props;
    if (!isVisible || count === 0) {
      return null;
    }
    return (
      <Flex style={styles.itemWrap}>
        <Card onPress={this.report} style={styles.item}>
          <Icon
            name="uncontactedIcon"
            type="MissionHub"
            size={20}
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>{t('reports', { count })}</Text>
        </Card>
      </Flex>
    );
  }
}

ReportCommentNotifier.propTypes = {
  organization: PropTypes.object.isRequired,
};

export const mapStateToProps = (
  { auth, organizations, reportedComments },
  { organization = {} },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: selectorOrg.id },
  });
  const allReportedComments = reportedComments.all[selectorOrg.id] || [];
  const count = allReportedComments.length;

  const isUserOwner = isOwner(myOrgPerm);
  const isUserAdmin = isAdmin(myOrgPerm);
  const isCruOrg = orgIsCru(selectorOrg);

  return {
    organization: selectorOrg,
    isVisible: isCruOrg ? isUserAdmin : isUserOwner,
    count,
  };
};

export default connect(mapStateToProps)(ReportCommentNotifier);
