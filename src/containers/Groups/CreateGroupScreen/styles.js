import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  imageWrap: {
    marginTop: 5,
    borderRadius: 4,
    marginHorizontal: 20,
    height: (theme.fullWidth - 40) * theme.communityImageAspectRatio,
    backgroundColor: theme.accentColor,
  },
  image: {
    borderRadius: 4,
    width: '100%',
    height: '100%',
  },
  fieldWrap: {
    marginTop: 5,
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 24,
    color: theme.backgroundColor,
    textAlign: 'center',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: theme.white,
    textAlign: 'center',
  },
});
