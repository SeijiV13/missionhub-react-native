import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';

import styles from './styles';

export default function ItemHeaderText({ text }) {
  return <Text style={styles.name}>{text.toUpperCase()}</Text>;
}

ItemHeaderText.propTypes = {
  text: PropTypes.string.isRequired,
};
