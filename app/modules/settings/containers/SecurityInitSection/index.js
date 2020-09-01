import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, Formik } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { LogoutBlock } from '@/modules/auth/containers/LogoutButton';

import NoticeWell from '@/components/NoticeWell';
import TextField from '@/components/Formik/TextField';

import mapErrorMessages from '@/utils/mapErrorMessages';

import intlMessages from './messages';
import { blockAction } from '../../messages';

import {
  asyncUpdateUserSecurityInfo,
} from '../../actions/security'

const validate = (values) => {
  const { question, answer } = values;
  const errors = {};

  if (!question) {
    errors.question = formatMessage(formMessages.shortRequired);
  }
  if (!answer) {
    errors.answer = formatMessage(formMessages.shortRequired);
  }
};

class SecuritySection extends React.Component {

  initialValues =  {
    question: '',
    answer: '',
  }

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    this.props.updateUserSecurityInfo(values)
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          const messages = mapErrorMessages(err.data);
          setErrors(messages);
        } else {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        }
        setSubmitting(false);
      });
  }
    
  render() {
    const { formRef } = this.props;
    return (
      <Formik
        initialValues={this.initialValues}
        onSubmit={this.handleSubmit}
        validate={validate}
        innerRef={formRef}
      >
        {(formProps) => {
          const { submitForm, isSubmitting, isValid, touched } = formProps;
          const isReady = Object.keys(touched).length && isValid;
          return (
            <FtBlock
              title={<TranslatableMessage message={intlMessages.securityTitle} />}
              secondary
              id='security-block'
              style={{ position: 'relative' }}
              subHeader={<LogoutBlock style={{ float: 'right' }} className="ft-Button ft-Button_merge ft-Button_sm" />}
            >
              <NoticeWell className="margin_y_12">
                <div><TranslatableMessage message={intlMessages.initWarning} /></div>
                {/* <div className="margin_t_12 ft-FlexRow">
                  <LogoutBlock className="ft-Button ft-Button_merge ft-Button_sm" />
                  <Button 
                    type="primary"
                    style={{ marginLeft: 'auto' }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (this.questionInput) {
                        this.questionInput.focus();
                      }
                    }}
                  >
                    <TranslatableMessage message={intlMessages.continue} />
                  </Button>
                </div> */}
              </NoticeWell>
              <Field
                name="question"
                label={
                  <TranslatableMessage message={intlMessages.securityHint} />
                }
                component={TextField}
                modifier="dashed"
                autoFocus
                autoComplete="off"
                inputRef={(n) => {
                  this.questionInput = n;
                }}
              />
              <Field
                name="answer"
                label={
                  <TranslatableMessage message={intlMessages.securityResponse} />
                }
                component={TextField}
                modifier="dashed"
                autoComplete="off"
              />
              <Button
                className="margin_t_12"
                onClick={() => {
                  submitForm();
                }}
                disabled={isSubmitting || !isReady}
                block
              >
                <TranslatableMessage message={blockAction.save} />
              </Button>
            </FtBlock>
          )
        }}
        
      </Formik>
    );
  }
}

SecuritySection.propTypes = {
  updateUserSecurityInfo: PropTypes.func,
  formRef: PropTypes.func,
};



const mapDispatchToProps = {
  updateUserSecurityInfo: asyncUpdateUserSecurityInfo,
}


export default connect(null, mapDispatchToProps)(SecuritySection);
