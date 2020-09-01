import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Formik, Field } from 'formik';
import moment from 'moment';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FtBlock from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import TextField from '@/components/Formik/TextField';
import DatePickerField from '@/components/Formik/DatePickerField';
import ImageField from '@/components/Formik/ImageField';

import intlMessages, { form as honorForm } from './messages';
import { blockAction } from '../../messages';
import { useAutoSubmit } from '../../hooks';
import './HonorForm.scss';

const validate = (values) => {
  const errors = {};
  const { title, organization, issued_at, pic } = values;
  if (!title) {
    errors.title = formatMessage(formMessages.shortRequired);
  } else if (title.trim().length > 150) {
    errors.title = formatMessage(formMessages.max, { length: 150 });
  }
  if (!organization) {
    errors.organization = formatMessage(formMessages.shortRequired);
  } else if (organization.trim().length > 150) {
    errors.organization = formatMessage(formMessages.max, { length: 150 });
  }
  if (!issued_at) {
    errors.issued_at = formatMessage(formMessages.shortRequired);
  }
  if (!pic) {
    errors.pic = formatMessage(formMessages.shortRequired);
  }
  return errors;
};


function HonorForm(props) {
  const { onSubmit, formRef, onCancel, canCancel, initialValues } = props;
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      innerRef={formRef}
    >
      {(formProps) => {
        const { status, values, isValid, isSubmitting, dirty, setValues } = formProps;
        const timer = useAutoSubmit(formProps, props.submitTimeout);
        const handleSubmit = useCallback((e) => {
          if (e) {
            e.preventDefault();
          } 
          if (timer) {
            clearTimeout(timer);
          }
          formProps.submitForm();
        }, [values]);
        let subHeader = null;
        useEffect(() => {
          if (props.cacheValues) {
            const processed = {...props.cacheValues};
            if (processed.issued_at) {
              processed.issued_at = moment(processed.issued_at);
            }
            setValues(processed);
          }
        }, []);
        useEffect(() => {
          props.updateCache && props.updateCache(dirty ? values : null);
        }, [values]);

        if (isValid && dirty) {
          subHeader = (
            <Button
              type="link"
              onClick={() => {
                formProps.submitForm();
              }}
              style={{ float: 'right' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader size="xs" />
              ) : (
                <TranslatableMessage
                  message={blockAction.save}
                />
              )}
            </Button>
          )
        } else if (canCancel) {
          subHeader = (
            <Button
              type="link"
              onClick={onCancel}
              style={{ float: 'right' }}
              aria-label="cancel-create"
            >
              <TranslatableMessage
                message={blockAction.cancel}
              />
            </Button>
          )
        }
        
        return (
          <FtBlock
            title={
              <span className="padding_x_5">
                <TranslatableMessage message={intlMessages.sectionTitle} />
              </span>
            }
            subHeader={subHeader}
            noPadding
          >
            <form className="HonorForm" onSubmit={handleSubmit}>
              <Field
                name="title"
                className="ft-FormItem_inline"
                label={<TranslatableMessage message={honorForm.titleLabel} />}
                component={TextField}
                modifier="dashed"
              />
              <Field
                name="organization"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={honorForm.organizationLabel} />
                }
                component={TextField}
                modifier="dashed"
              />
              <Field
                name="issued_at"
                className="ft-FormItem_inline"
                label={<TranslatableMessage message={honorForm.timeLabel} />}
                component={DatePickerField}
                viewMode="YM"
                placeholder={formatMessage(honorForm.issuedAtPlaceholder)}
                normalize={(val) => val.startOf('month')}
                momentFormat="YYYY MM"
                modifier="dashed"
                autoCloseOnChange
              />
              <Field
                name="pic"
                label={<TranslatableMessage message={honorForm.imageLabel} />}
                component={ImageField}
                modifier="dashed"
                placeholder={
                  <TranslatableMessage message={honorForm.dropImageHint} />
                }
              />
              {status && <FormHelp validateStatus="error" data={status} />}
            </form>
          </FtBlock>
        );
      }}
    </Formik>
  );
}

HonorForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  formRef: PropTypes.func,
  canCancel: PropTypes.bool,
  initialValues: PropTypes.object,
  cacheValues: PropTypes.object,
  updateCache: PropTypes.func,
  submitTimeout: PropTypes.number,
};

HonorForm.defaultProps = {
  initialValues: {
    title: '',
    organization: '',
    issued_at: undefined,
    pic: undefined,
  },
  submitTimeout: 10000,
};

export default HonorForm;
