import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable } from '../common';

import styles from './styles';

@translate('groupItem')
class ContactItem extends Component {
  handleSelect = () => {
    this.props.onSelect(this.props.contact);
  };
  render() {
    const { contact, organization, t } = this.props;
    // TODO: Figure out how someone is assigned/unassigned
    const isAssigned = false;
    return (
      <Touchable onPress={this.handleSelect} highlight={true}>
        <Flex align="center" direction="row" style={styles.row}>
          <Flex value={1} justify="center" direction="column">
            <Text style={styles.name}>
              {contact.first_name}
              {contact.last_name ? ` ${contact.last_name}` : null}
            </Text>
          </Flex>
          {isAssigned ? null : (
            <Text style={styles.unassigned}>{t('unassigned')}</Text>
          )}
        </Flex>
      </Touchable>
    );
  }
}

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string,
    isAssigned: PropTypes.bool,
  }).isRequired,
  organization: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ContactItem;
