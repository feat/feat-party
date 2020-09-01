import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { formatMessage } from '@/services/intl';
import { initCache } from '@/services/cache';
import { selectCurrentUser } from '@/modules/auth/selectors';

import message from '@feat/feat-ui/lib/message';
import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';

import { getAvatar } from '@/utils/user';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import AvatarPreview from './components/AvatarPreview';
import IdentityForm from './components/IdentityForm';

import intlMessages from './messages';
import {
  asyncUpdateProfile,
  asyncUpdateAvatar,
  asyncFetchProfile,
} from '../../actions/profile';
import { selectProfile, selectIdentityBlockState } from '../../selectors';

class IdentityBlock extends Component {
  constructor(props) {
    super(props);
    this.cache = initCache({
      userId: props.currentUser.uid,
      cacheKey: 'settings.identity',
    });
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchProfile().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  updateIdentity = (data, { setSubmitting, setErrors }) => {
    this.props
      .updateProfile({
        userId: this.props.profile.uid,
        data,
      })
      .then(() => {
        message.success(formatMessage(intlMessages.basicInfoUpdated));
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(err.data);
        } else {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  updateAvatar = (data) =>
    this.props.updateAvatar({
      userId: this.props.profile.uid,
      ...data,
    });

  render() {
    const { profile, blockState } = this.props;
    if (blockState.fetchError) {
      return (
        <FtBlock
          title={
            <TranslatableMessage message={intlMessages.identitySectionTitle} />
          }
        >
          <div>{blockState.fetchError.message}</div>
        </FtBlock>
      );
    }
    if (!profile) {
      return (
        <FtBlock
          title={
            <TranslatableMessage message={intlMessages.identitySectionTitle} />
          }
        >
          <div>Loading...</div>
        </FtBlock>
      );
    }
    const {
      firstname,
      lastname,
      name_order,
      gender,
      marriage,
      dob,
      orig_avatar: originAvatar,
      crop_info: cropInfo,
    } = profile;

    const initialValues = {
      firstname,
      lastname,
      name_order,
      gender,
      marriage,
      dob,
    };

    return (
      <FtBlock
        title={
          <TranslatableMessage message={intlMessages.identitySectionTitle} />
        }
      >
        <AvatarPreview
          croppedFile={getAvatar(profile, 'lg')}
          originFile={originAvatar}
          cropInfo={cropInfo}
          onSubmit={this.updateAvatar}
        />
        <IdentityForm
          formRef={this.props.formRef}
          initialValues={initialValues}
          onSubmit={this.updateIdentity}
          cacheValues={this.cache.get('formValues')}
          updateCache={(values) => {
            this.cache.set('formValues', values);
          }}
        />
      </FtBlock>
    );
  }
}

IdentityBlock.propTypes = {
  blockState: PropTypes.object,
  currentUser: PropTypes.object,
  profile: PropTypes.object,
  fetchProfile: PropTypes.func, // promise
  updateProfile: PropTypes.func, // promise
  updateAvatar: PropTypes.func, // promise
  formRef: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  blockState: selectIdentityBlockState,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = {
  fetchProfile: asyncFetchProfile,
  updateProfile: asyncUpdateProfile,
  updateAvatar: asyncUpdateAvatar,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(IdentityBlock);
