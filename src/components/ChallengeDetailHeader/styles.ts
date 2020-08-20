import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.transparent,
    paddingVertical: 10,
    marginBottom: 80,
  },
  section: {
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  detailSection: {
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  title: theme.textLight24,
  subHeader: {
    ...theme.textRegular10,
    color: theme.lightGrey,
  },
  dateText: theme.textRegular14,
});
