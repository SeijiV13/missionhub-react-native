import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  cardContent: {
    flex: 1,
    paddingVertical: 12,
  },
  headerWrap: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  headerNameWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTime: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.lightGrey,
  },
  postTextWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
  },
  postImage: {
    paddingVertical: 12,
    width: 40,
  },
  commentLikeWrap: {
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  topLeft: {
    justifyContent: 'flex-start',
  },
  clearNotificationWrap: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  clearNotificationTouchable: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: theme.grey,
    borderRadius: 20,
  },
  clearNotificationIcon: {
    padding: 8,
    color: theme.white,
  },
});
