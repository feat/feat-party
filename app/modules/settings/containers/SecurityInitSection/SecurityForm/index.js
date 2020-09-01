import React from 'react';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import TextField from '@/components/Formik/TextField';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../messages';

const updateValidate = (values) => {
  const { question, answer, new_question, new_answer } = values;
  const errors = {};

  if (!question) {
    errors.question = formatMessage(formMessages.shortRequired);
  }
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
};

const initValidate = (values) => {
  const { question, answer } = values;
  const errors = {};

  if (!question) {
    errors.question = formatMessage(formMessages.shortRequired);
  }
  if (!answer) {
    errors.answer = formatMessage(formMessages.shortRequired);
  }
};

function SecurityForm(props) {
  const { onSubmit, initialValues, forwardedRef } = props;
  const autoFocusField =
    initialValues && initialValues.question ? 'answer' : 'question';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={
        initialValues && initialValues.question ? updateValidate : initValidate
      }
      innerRef={forwardedRef}
    >
      {(formProps) => {
        const { handleSubmit, errors } = formProps;
        return (
          <form className="ft-Form" onSubmit={handleSubmit}>
            <Field
              name="question"
              label={
                <TranslatableMessage message={intlMessages.securityHint} />
              }
              component={TextField}
              modifier="dashed"
              autoFocus={autoFocusField === 'question'}
              disabled={!!initialValues.question}
            />
            <Field
              name="answer"
              label={
                <TranslatableMessage message={intlMessages.securityResponse} />
              }
              component={TextField}
              autoFocus={autoFocusField === 'answer'}
              modifier="dashed"
              autoComplete="off"
            />

            {initialValues.question && (
              <Field
                name="new_question"
                label={
                  <TranslatableMessage message={intlMessages.securityNewhint} />
                }
                component={TextField}
                modifier="dashed"
                autoComplete="off"
              />
            )}
            {initialValues.question && (
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
              />
            )}
            {errors._error && (
              <div className="padding_y_5">
                <FormHelp validateStatus="error" data={errors._error} />
              </div>
            )}
          </form>
        );
      }}
    </Formik>
  );
}

SecurityForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.any,
  forwardedRef: PropTypes.func,
};

SecurityForm.defaultProps = {
  initialValues: {
    question: '',
    answer: '',
    new_question: '',
    new_answer: '',
  },
};

export default React.forwardRef((props, ref) => (
  <SecurityForm {...props} forwardedRef={ref} />
));
