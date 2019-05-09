import { Dimensions, StatusBarStyle } from 'react-native';
import Color from 'color';

import { isAndroid, hasNotch } from './utils/common';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// See https://github.com/qix-/color for help
function colorConvert({
  color,
  alpha,
  lighten,
  darken,
  negate,
  rotate,
  whiten,
  blacken,
  hex,
}: {
  color: string;
  alpha?: number;
  lighten?: number;
  darken?: number;
  negate?: number;
  rotate?: number;
  whiten?: number;
  blacken?: number;
  hex?: boolean;
}): string {
  let col = Color(color);
  // Lots of things you can do with color stuff
  if (alpha) {
    col = Color(col).alpha(alpha);
  }
  if (lighten) {
    col = Color(col).lighten(lighten);
  }
  if (darken) {
    col = Color(col).darken(darken);
  }
  if (negate) {
    col = Color(col).negate();
  }
  if (rotate) {
    col = Color(col).rotate(rotate);
  }
  if (whiten) {
    col = Color(col).whiten(whiten);
  }
  if (blacken) {
    col = Color(col).blacken(blacken);
  }
  if (hex === true) {
    return col.hex().toString();
  }
  return col.rgb().toString();
}

export const COLORS = {
  LIGHT_BLUE: '#66D9F0',
  BLUE: '#52C5DC',
  PRIMARY_FADE: 'rgba(68, 200, 232, 0.3)',
  DARK_BLUE: '#007398',
  ACCENT_BLUE: '#005A7F',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GREY: '#505256',
  INACTIVE_GREY: '#A0A2A6',
  LIGHT_GREY: '#B4B6BA',
  EXTRA_LIGHT_GREY: '#ECEEF2',
  TRANSPARENT: 'transparent',
  BLUE_GREEN: '#50DCC8',
  IMPACT_BLUE: '#3EB1C8',
  RED: '#FF5532',
  DARK_RED: '#260C06',
  IOS_BLUE: '#007AFF',
  GREEN: '#44E4AB',
  convert: colorConvert,
};

const PRIMARY = COLORS.DARK_BLUE;
const SECONDARY = COLORS.BLUE;
const BACKGROUND = COLORS.LIGHT_BLUE;
const ACCENT = COLORS.ACCENT_BLUE;

const iPhoneHeaderHeight = 65;
const notchDifference = hasNotch() ? 22 : 0;

const statusBar = {
  backgroundColor: colorConvert({
    color: COLORS.DARK_BLUE,
    darken: 0.1,
    hex: true,
  }),
  animated: true,
};

export default {
  // base theme
  loadingColor: COLORS.WHITE,
  primaryColor: PRIMARY,
  secondaryColor: SECONDARY,
  accentColor: ACCENT,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  backgroundColor: BACKGROUND,
  textColor: COLORS.GREY,
  iconColor: COLORS.WHITE,
  transparent: COLORS.TRANSPARENT,
  buttonHeight: 60,
  buttonBackgroundColor: COLORS.TRANSPARENT,
  buttonBorderColor: COLORS.WHITE,
  buttonBorderWidth: 1,
  buttonTextColor: COLORS.WHITE,
  buttonIconColor: COLORS.WHITE,
  separatorColor: COLORS.EXTRA_LIGHT_GREY,
  separatorHeight: 1,
  headerTextColor: COLORS.WHITE,
  inactiveColor: COLORS.INACTIVE_GREY,
  checkBackgroundColor: COLORS.BLUE_GREEN,
  red: COLORS.RED,
  darkRed: COLORS.DARK_RED,
  green: COLORS.GREEN,
  fullWidth: deviceWidth,
  fullHeight: deviceHeight,
  convert: colorConvert,
  impactBlue: COLORS.IMPACT_BLUE,
  grey: COLORS.GREY,
  grey1: '#B2B0B2',
  grey2: '#4E4C4E',
  grey3: '#C5C7CB',
  lightGrey: COLORS.LIGHT_GREY,
  extraLightGrey: COLORS.EXTRA_LIGHT_GREY,
  iosBlue: COLORS.IOS_BLUE,

  contactHeaderIconActiveColor: 'rgba(255,255,255,1)',
  contactHeaderIconInactiveColor: 'rgba(255,255,255,0.4)',

  notchDifference,
  headerHeight: isAndroid ? 56 : iPhoneHeaderHeight + notchDifference,
  parallaxHeaderHeight: 215,
  swipeTabHeight: 48,
  statusBar: {
    lightContent: {
      ...statusBar,
      barStyle: 'light-content' as StatusBarStyle,
    },
    darkContent: {
      ...statusBar,
      barStyle: (isAndroid
        ? 'light-content'
        : 'dark-content') as StatusBarStyle,
    },
  },
  hitSlop: (n: number) => ({ top: n, right: n, left: n, bottom: n }),
};
