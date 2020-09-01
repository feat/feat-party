import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';

import { formatMessage } from '@/services/intl';
import mapErrorMessages from '@/utils/mapErrorMessages';
import formMessages from '@/messages/form';

import TextInput from '@feat/feat-ui/lib/text-input';
import FtBlock from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { LogoutBlock } from '@/modules/auth/containers/LogoutButton';

import HomeDomainWidget from './HomeDomainWidget';
import intlMessages from './messages';

import {
  asyncFetchProfile,
} from '../../actions/profile';
import {
  asyncSetHomeDomain,
} from '../../actions/account'

import './style.scss';
import { selectProfile, selectAccountBlockState } from '../../selectors';
import { blockAction } from '../../messages';
// import { useAutoSubmit } from '../../hooks';

const validate = (values) => {
  const errors = {};
  if (!values.home_domain || !values.home_domain.trim()) {
    errors.home_domain = formatMessage(formMessages.shortRequired);
  }
}

class AccountBlock extends React.PureComponent {
  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchProfile();
    }
  }

  handleHomeDomainForm = (values, { setSubmitting, setErrors, setStatus }) =>
    this.props.setHomeDomain(values)
      .then(() => {
        message.success({
          content: formatMessage(intlMessages.setHomeDomainSuccess),
        });
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          const messages = mapErrorMessages(err.data);
          if (messages._error) {
            setStatus(messages._error);
          } else {
            setErrors(messages);
          }
        }
        setSubmitting(false);
      });

  render() {
    const { blockState, profile, formRef } = this.props;

    if (!blockState.onceFetched || blockState.loading || blockState.fetchError) {
      return (
        <FtBlock
          title={
            <span className="padding_x_5">
              <TranslatableMessage message={intlMessages.sectionTitle} />
            </span>
          }
          secondary
          noPadding
        >
          {blockState.fetchError ? (
            <div>{blockState.fetchError.message}</div>
          ) : <div>Loading...</div>}
          <div className="block-Logout">
            <LogoutBlock className="block-Logout__btn" />
          </div>
        </FtBlock>
      )
    }

    return (
      <Formik
        initialValues={{
          home_domain: profile.home_domain,
        }}
        enableReinitialize
        innerRef={formRef}
        onSubmit={this.handleHomeDomainForm}
        validate={validate}
      >
        {(formProps) => {
          const { status } = formProps;
          // const timer = useAutoSubmit(formProps, this.props.submitTimeout);
          // const handleSubmit = useCallback(() => {
          //   if (timer) {
          //     clearTimeout(timer);
          //   }
          //   formProps.handleSubmit();
          // }, [formProps.values]);
          return (
            <FtBlock
              title={
                <span className="padding_x_5">
                  <TranslatableMessage message={intlMessages.sectionTitle} />
                </span>
              }
              secondary
              noPadding
              subHeader={formProps.dirty && (
                <Button
                  type="link"
                  onClick={() => {
                    formProps.submitForm();
                  }}
                  style={{ float: 'right' }}
                  disabled={formProps.isSubmitting}
                >
                  {formProps.isSubmitting ? (
                    <Loader size='xs' />
                  ) : (
                    <TranslatableMessage
                      message={blockAction.lock}
                    />
                  )}
                </Button>
              )}
            >
              <FormItem
                label={
                  <FormLabel>
                    <TranslatableMessage message={intlMessages.userIdLabel} />
                  </FormLabel>
                }
                modifier="dashed"
                className="ft-FormItem_inline"
              >
                <TextInput block value={profile.uid} disabled />
              </FormItem>
              <FormItem
                label={
                  <FormLabel>
                    <TranslatableMessage message={intlMessages.contactLabel} />
                  </FormLabel>
                }
                modifier="dashed"
                className="ft-FormItem_inline"
              >
                <TextInput block value={profile.mobile} disabled />
              </FormItem>
              <Field
                name="home_domain"
                prefix={`${window.location.host}/profile/`}
                label={
                  <FormLabel>
                    <TranslatableMessage message={intlMessages.userDomainLabel} />
                  </FormLabel>
                }
                tooltip={
                  <TranslatableMessage message={intlMessages.userDomainTooltip} />
                }
                modifier="dashed"
                disabled={String(profile.home_domain) !== String(profile.uid)}
                component={HomeDomainWidget}
              />
              {status && <div>{status}</div>}
              <div className="block-Logout">
                <LogoutBlock className="block-Logout__btn" />
              </div>
            </FtBlock>
          )
        }}
      </Formik>
    );
  }
}

AccountBlock.propTypes = {
  blockState: PropTypes.object,
  profile: PropTypes.object,
  fetchProfile: PropTypes.func,
  setHomeDomain: PropTypes.func,
  formRef: PropTypes.func,
  // submitTimeout: PropTypes.number,
};

// AccountBlock.defaultProps = {
//   submitTimeout: 2000,
// }

const mapStateToProps = createStructuredSelector({
  blockState: selectAccountBlockState,
  profile: selectProfile,
});

const mapDispatchToProps = {
  fetchProfile: asyncFetchProfile,
  setHomeDomain: asyncSetHomeDomain,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBlock);
