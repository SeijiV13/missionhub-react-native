import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { withTranslation } from 'react-i18next';
import ImageCropPicker from 'react-native-image-crop-picker';

import PopupMenu from '../../components/PopupMenu';
import theme from '../../theme.ts';
import { LOG } from '../../utils/logging';

// See all options: https://github.com/ivpusic/react-native-image-crop-picker
const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  width: theme.fullWidth,
  height: theme.fullWidth * theme.communityImageAspectRatio,
  compressImageQuality: 0.75, // 0 to 1
  cropping: true,
};

function getType(response) {
  if (response.path.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

@withTranslation('imagePicker')
class ImagePicker extends Component {
  takePhoto = () => {
    this.selectImage(true);
  };

  chooseFromLibrary = () => {
    this.selectImage(false);
  };

  async selectImage(takePhoto) {
    const { t, onSelectImage } = this.props;

    try {
      const response = await (takePhoto
        ? ImageCropPicker.openCamera(DEFAULT_OPTIONS)
        : ImageCropPicker.openPicker(DEFAULT_OPTIONS));

      let fileName = response.filename || '';
      const { path: uri, size: fileSize, mime, width, height } = response;

      // Handle strange iOS files "HEIC" format. If the file name is not a jpeg, but the uri is a jpg
      // create a new file name with the right extension
      if (uri.includes('.jpg') && !fileName.includes('.jpg')) {
        fileName = `${new Date().valueOf()}.jpg`;
      }

      const payload = {
        fileSize,
        fileName,
        fileType: mime || getType(response),
        width,
        height,
        isVertical: height > width,
        uri,
      };
      onSelectImage(payload);
    } catch (error) {
      const errorCode = error && error.code;
      if (
        errorCode === 'E_PERMISSION_MISSING' ||
        errorCode === 'E_PICKER_CANCELLED'
      ) {
        LOG('User cancelled image picker');
        return;
      }

      LOG('RNImagePicker Error: ', error);
      Alert.alert(t('errorHeader'), t('errorBody'));
    }
  }

  render() {
    const { t } = this.props;

    return (
      <PopupMenu
        actions={[
          { text: t('takePhoto'), onPress: this.takePhoto },
          { text: t('chooseFromLibrary'), onPress: this.chooseFromLibrary },
        ]}
        buttonProps={{ isAndroidOpacity: true, activeOpacity: 0.75 }}
        title={t('selectImage')}
      >
        {this.props.children}
      </PopupMenu>
    );
  }
}

ImagePicker.propTypes = {
  onSelectImage: PropTypes.func.isRequired, // func with args: (data, callback)
  children: PropTypes.element.isRequired,
};

export default ImagePicker;
