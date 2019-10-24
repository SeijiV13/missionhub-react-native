import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  headerIcon: {
    fontSize: 40,
    color: theme.secondaryColor,
  },
  headerTitle: {
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: 2,
    color: theme.secondaryColor,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.white,
    paddingHorizontal: 50,
    paddingBottom: 36,
    textAlign: 'center',
  },
  collapsedHeaderTitle: {
    fontSize: 14,
    color: theme.white,
  },
});
