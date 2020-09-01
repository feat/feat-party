import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';


import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormItem from '@feat/feat-ui/lib/form/FormItem';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import TextField from '@/components/Formik/TextField';


import mapErrorMessages from '@/utils/mapErrorMessages';

import intlMessages from './messages';
import { blockAction } from '../../messages'

import {
  asyncFetchUserSecurityInfo,
  asyncUpdateUserSecurityInfo,
} from '../../actions/security'
import {
  selectSecurityBlockState,
} from '../../selectors'

const validate = (values) => {
  const {  answer, new_question, new_answer } = values;
  const errors = {};

  if (!answer) {
    errors.answer = formatMessage(formMessages.shortRequired);
  }
  if (!new_question) {
    errors.new_question = formatMessage(formMessages.shortRequired);
  }
  if (!new_answer) {
    errors.new_answer = formatMessage(formMessages.shortRequired);
  }

  return errors;
}

class SecurityUpdateSection extends React.Component {
  state = {
    isActive: false,
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.getUserSecurityInfo().catch((err) => {
        logging.debug(err);
      });
    }
  }

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    this.props.updateUserSecurityInfo(values)
      .then(() => {
        this.setState({
          isActive: false,
        })
      }).catch((err) => {
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
      })
  }

  render() {
    const { blockState, formRef } = this.props;
    if (!blockState.data || blockState.fetcheError) {
      return (
        <FtBlock
          title={<TranslatableMessage message={intlMessages.securityTitle} />}
          secondary
          id='security-block'
        >
          {blockState.fetcheError ? (
            <div>{blockState.fetchError.message}</div>
          ) : 
            <div style={{ height: 300, position: 'relative' }}>
              <MaskLoader />
            </div>
          }  
        </FtBlock>
      )
    }

    return (
      <Formik
        initialValues={{
          question: blockState.data.question,
          answer: '',
          new_question: '',
          new_answer: '',
        }}
        enableReinitialize
        onSubmit={this.handleSubmit}
        innerRef={formRef}
        validate={validate}
      >
        {(formProps) => {
          const { handleSumbit, status, errors, touched, isValid, isSubmitting } = formProps;
          let subHeader = null;
          if (isValid && Object.keys(touched).length) {
            subHeader = (
              <Button
                type="link"
                className="st-Block__toggleBtn"
                onClick={() => {
                  formProps.submitForm();
                }}
                style={{ float: 'right' }}
                disabled={isSubmitting}
              >
                <TranslatableMessage message={blockAction.lock} />
              </Button>
            )
          } else if (this.state.isActive) {
            subHeader = (
              <Button
                type="link"
                className="st-Block__toggleBtn"
                onClick={() => {
                  this.setState({
                    isActive: false,
                  })
                }}
                style={{ float: 'right' }}
                disabled={isSubmitting}
              >
                <TranslatableMessage message={blockAction.cancel} />
              </Button>
            )
          }
          return(
            <FtBlock
              title={
                <span className="padding_x_5">
                  <TranslatableMessage message={intlMessages.securityTitle} />
                </span>
              }
              secondary
              id='security-block'
              subHeader={subHeader}
              noPadding
            >
              <form onSubmit={handleSumbit} id='security-update-form'>
                <Field
                  name="question"
                  label={
                    <TranslatableMessage message={intlMessages.securityHint} />
                  }
                  component={TextField}
                  modifier="dashed"
                  disabled
                  className="ft-FormItem_inline"
                />
                {this.state.isActive ? (
                  <>
                  <Field
                    name="answer"
                    label={
                      <TranslatableMessage message={intlMessages.securityResponse} />
                    }
                    component={TextField}
                    autoFocus
                    modifier="dashed"
                    autoComplete="off"
                    className="ft-FormItem_inline"
                  />
                  <Field
                    name="new_question"
                    label={
                      <TranslatableMessage message={intlMessages.securityNewhint} />
                    }
                    component={TextField}
                    modifier="dashed"
                    autoComplete="off"
                    className="ft-FormItem_inline"
                  />
                  <Field
                    name="new_answer"
                    label={
                      <TranslatableMessage
                        message={intlMessages.securityNewResponse}
                      />
                    }
                    component={TextField}
                    modifier="dashed"
                    autoComplete="off"
                    className="ft-FormItem_inline"
                  />
                  </>
                ) : (
                  <FormItem
                    label={
                      <FormLabel>
                        <TranslatableMessage message={intlMessages.securityResponse} />
                      </FormLabel>
                    }
                    modifier="dashed"
                    className="ft-FormItem_inline"
                  >
                    <Button 
                      size="sm" 
                      type="default"
                      block
                      style={{ textAlign: 'left', lineHeight: 2 }}
                      onClick={() => {
                        this.setState({
                          isActive: true,
                        })
                      }}
                    >
                        *******
                    </Button>
                  </FormItem>
                )}
                
                {errors._error && (
                  <div className="padding_y_5">
                    <FormHelp validateStatus="error" data={errors._error} />
                  </div>
                )}
                {status && (
                  <div className="padding_y_5">
                    <FormHelp validateStatus="error" data={status} />
                  </div>
                )}
              </form>
            </FtBlock>
          )
        }}
      </Formik>
    )
  }
}

SecurityUpdateSection.propTypes = {
  formRef: PropTypes.func,
  blockState: PropTypes.object,
  getUserSecurityInfo: PropTypes.func,
  updateUserSecurityInfo: PropTypes.func,
};


const mapStateToProps = createStructuredSelector({
  blockState: selectSecurityBlockState,
});

const mapDispatchToProps = {
  getUserSecurityInfo: asyncFetchUserSecurityInfo,
  updateUserSecurityInfo: asyncUpdateUserSecurityInfo,
}


export default connect(mapStateToProps, mapDispatchToProps)(SecurityUpdateSection);
