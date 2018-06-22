import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Button } from '../../components/common';
import Header from '../Header';
import BackButton from '../BackButton';

import styles from './styles';

@translate('statusComplete')
class StatusCompleteScreen extends Component {
  cancel = () => {
    LOG('complete');
  };

  complete = () => {
    LOG('complete');
  };

  render() {
    const { t } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Header left={<BackButton />} shadow={false} />

        <Text style={styles.text}>
          {t('continue', { name1: 'Name 1', name2: 'Name 2' })}
        </Text>
        <Button
          type="secondary"
          onPress={this.complete}
          text={t('totally')}
          style={styles.button}
        />
        <Button
          type="secondary"
          onPress={this.cancel}
          text={t('nope')}
          style={styles.button}
        />
      </Flex>
    );
  }
}

StatusCompleteScreen.propTypes = {
  person: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  me: auth.person,
});

export default connect(mapStateToProps)(StatusCompleteScreen);
export const STATUS_COMPLETE_SCREEN = 'nav/STATUS_COMPLETE';
