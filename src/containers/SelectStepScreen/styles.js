import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  headerIcon: {
    fontSize: 36,
    color: theme.secondaryColor,
  },
  headerTitle: {
    fontSize: 36,
    color: theme.secondaryColor,
  },
  collapsedHeader: {
    paddingTop: theme.notchHeight,
    height: '100%',
  },
  collapsedHeaderTitle: {
    fontSize: 14,
    color: theme.white,
  },
  headerText: {
    fontSize: 16,
    color: theme.white,
    paddingHorizontal: 50,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    lineHeight: 24,
  },
});
