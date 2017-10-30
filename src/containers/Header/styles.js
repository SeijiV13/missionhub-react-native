
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: 'darkblue',
    paddingTop: 20,
    // TODO: Add shadow (ios) and elevation (android)
  },
  center: {

  },
  left: {

  },
  right: {

  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  // HeaderIcon styles
  headerIcon: {
    fontSize: 32,
    backgroundColor: COLORS.TRANSPARENT,
    // backgroundColor: COLORS.YELLOW,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // HeaderTwoLine styles
  headerTwoLine: {
    paddingHorizontal: 10,
  },
  headerTwoLine1: {
    fontSize: 12,
    color: theme.accentColor,
  },
  headerTwoLine2: {
    fontSize: 20,
    color: theme.lightText,
  },
});
