import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

// import ImageCropper from "@feat/feat-ui/lib/image-cropper";
import notification from '@feat/feat-ui/lib/notification';
import CropPanel from '@feat/feat-ui/lib/image-cropper/CropPanel';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import { RectShape } from '@feat/feat-ui/lib/placeholder';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import './style.scss';
import intlMessages from './messages';

const stopPropagation = (e) => {
  e.stopPropagation();
};

class AvatarPreview extends Component {
  state = {
    tempFile: undefined,
    cropSource: undefined,
    preview: undefined,
    isCropOpened: false,
  };

  getValidCropInfo() {
    if (this.props.cropInfo instanceof Object) {
      return {
        ...this.props.cropInfo,
        aspect: 1,
      };
    }
    return {
      aspect: 1,
    };
  }

  handleDrop = (files) => {
    if (!files[0]) {
      return;
    }
    this.setState({
      tempFile: files[0],
      cropSource: URL.createObjectURL(files[0]),
      isCropOpened: true,
    });
  };

  handleCropConfirm = () =>
    this.cropPanel
      .getValue()
      .then((data) => {
        this.setState({
          submitting: true,
          preview: URL.createObjectURL(data.preview),
        });
        const preData = {};
        if (this.state.tempFile) {
          preData.originFile = this.state.tempFile;
        }
        preData.croppedFile = data.preview;
        preData.cropInfo = data.crop;

        this.props.onSubmit(preData).then(() => {
          this.reset();
        });
      })
      .catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });

  handleCropClose = () => {
    this.reset();
    this.setState({
      preview: undefined,
    });
  };

  reset() {
    this.setState({
      tempFile: undefined,
      cropSource: undefined,
      isCropOpened: false,
      submitting: false,
    });
  }

  getPlaceholderProps() {
    if (this.state.preview) {
      return {
        style: {
          backgroundImage: `url(${this.state.preview}`,
        },
      };
    }
    if (this.props.croppedFile && this.props.cropInfo) {
      return {
        style: {
          backgroundImage: `url(${this.props.croppedFile}`,
        },
      };
    }
    return {
      label: <TranslatableMessage message={intlMessages.placeholder} />,
    };
  }

  render() {
    const { croppedFile, cropInfo } = this.props;
    return (
      <div className="AvatarPreview">
        <Dropzone
          onDrop={this.handleDrop}
          accept="image/*"
          onClick={(e) => {
            if (croppedFile && cropInfo) {
              e.preventDefault();
            }
          }}
          onDragOver={stopPropagation}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={classNames('AvatarPreview__dropzone', {
                'is-active': isDragActive,
              })}
            >
              <RectShape
                className="AvatarPreview__preview"
                ratio={1}
                {...this.getPlaceholderProps()}
                onClick={() => {
                  if (!this.props.originFile) {
                    return;
                  }
                  this.setState({
                    cropSource: this.props.originFile,
                    cropInfo: this.getValidCropInfo(),
                    isCropOpened: true,
                  });

                  // setTimeout(() => {
                  //   const img = document.querySelector('.ReactCrop__image');
                  //   img.setAttribute('crossOrigin', 'anonymous');
                  // }, 100);
                }}
              />
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        {this.state.isCropOpened && (
          <div className="AvatarPreview__cropContainer">
            <CropPanel
              src={this.state.cropSource}
              defaultCrop={this.state.cropInfo}
              ref={(n) => {
                this.cropPanel = n;
              }}
              crossorigin="Anonymous"
            />
            <div className="AvatarPreview__cropControls">
              <IconButton
                className="margin_r_24"
                svgIcon="no-btn"
                size="md"
                onClick={this.handleCropClose}
                disabled={this.state.submitting}
              />
              <IconButton
                svgIcon="ok-btn"
                size="md"
                onClick={this.handleCropConfirm}
                disabled={this.state.submitting}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

AvatarPreview.propTypes = {
  originFile: PropTypes.string,
  croppedFile: PropTypes.string,
  cropInfo: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default AvatarPreview;
