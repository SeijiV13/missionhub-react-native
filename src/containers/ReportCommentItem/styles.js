import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 0,
    marginBottom: 8,
    backgroundColor: theme.grey,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  users: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.inactiveColor,
  },
  comment: {
    paddingVertical: 15,
  },
  buttonLeft: {
    borderRightWidth: 1,
    borderRightColor: theme.white,
    borderBottomLeftRadius: 8,
  },
  buttonRight: {
    borderBottomRightRadius: 8,
  },
});
