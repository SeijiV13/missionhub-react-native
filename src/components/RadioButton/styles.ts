import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outside: {
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    padding: 2,
  },
  checked: {
    borderColor: theme.secondaryColor,
  },
  inside: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: theme.secondaryColor,
  },
  label: {
    color: theme.white,
    fontSize: 14,
    marginLeft: 5,
  },
});
