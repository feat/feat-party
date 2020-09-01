import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import moment from 'moment';

import { formatMessage } from '@/services/intl';

import formMessages from '@/messages/form';
import {
  EDUCATION_TYPE_SENIOR,
  EDUCATION_TYPE_TRAINING,
  EDUCATION_TYPE_COLLEGE,
} from '@/modules/user/constants';

import { educationType as educationTypeMessages } from '@/modules/user/messages';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import Loader from '@feat/feat-ui/lib/loader';

import RadioButtonField from '@/components/Formik/RadioButtonField';
import TextField from '@/components/Formik/TextField';
import RangeField from '@/components/Formik/RangeField';
import ImageField from '@/components/Formik/ImageField';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages, { form as educationForm } from './messages';
import { blockAction } from '../../messages';
import { useAutoSubmit } from '../../hooks';

const typeOptions = [
  {
    value: EDUCATION_TYPE_SENIOR,
    label: (
      <TranslatableMessage
        message={educationTypeMessages[EDUCATION_TYPE_SENIOR]}
      />
    ),
  },
  {
    value: EDUCATION_TYPE_COLLEGE,
    label: (
      <TranslatableMessage
        message={educationTypeMessages[EDUCATION_TYPE_COLLEGE]}
      />
    ),
  },
  {
    value: EDUCATION_TYPE_TRAINING,
    label: (
      <TranslatableMessage
        message={educationTypeMessages[EDUCATION_TYPE_TRAINING]}
      />
    ),
  },
];

const initialValues = {
  type: EDUCATION_TYPE_SENIOR,
  organization: '',
  title: '',
  city: '',
  period: {
    since: '',
    until: '',
  },
  description: '',
  pic: undefined,
};

const validate = (values) => {
  const { type, city, title, organization, description, period } = values;

  const errors = {};
  if (!organization) {
    errors.organization = formatMessage(formMessages.shortRequired);
  } else if (organization.trim().length > 150) {
    errors.organization = formatMessage(formMessages.max, {
      field: formatMessage(educationForm.organizationLabel),
      length: 150,
    });
  }

  if (Number(type) === EDUCATION_TYPE_SENIOR) {
    if (!city) {
      errors.city = formatMessage(formMessages.shortRequired);
    }
  } else if (!title) {
    errors.title = formatMessage(formMessages.shortRequired);
  } else if (title.trim().length > 50) {
    errors.title = formatMessage(formMessages.max, {
      field: formatMessage(educationForm.subjectLabel),
      length: 50,
    });
  }

  if (!description) {
    errors.description = formatMessage(formMessages.shortRequired);
  }

  if (!period.since || !period.until) {
    errors.range = formatMessage(formMessages.shortRequired);
  }

  return errors;
};

function EducationForm(props) {
  const { onSubmit, formRef, onCancel, canCancel } = props;
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      innerRef={formRef}
    >
      {(formProps) => {
        const { values, dirty, isSubmitting, isValid, setValues } = formProps;
        const isTraining = values.type === EDUCATION_TYPE_TRAINING;
        let subHeader = null;
        const timer = useAutoSubmit(formProps, props.submitTimeout);
        const handleSubmit = useCallback(
          (e) => {
            if (e) {
              e.preventDefault();
            }
            if (timer) {
              clearTimeout(timer);
            }
            formProps.submitForm();
          },
          [values],
        );
        useEffect(() => {
          if (props.cacheValues) {
            const processed = { ...props.cacheValues };
            if (processed.period && processed.period.since) {
              processed.period.since = moment(processed.period.since);
            }
            if (processed.period && processed.period.until) {
              processed.period.until = moment(processed.period.until);
            }
            setValues(processed);
          }
        }, []);
        useEffect(
          () => {
            props.updateCache && props.updateCache(dirty ? values : null);
          },
          [values],
        );

        if (isValid && dirty) {
          subHeader = (
            <Button
              type="link"
              onClick={handleSubmit}
              style={{ float: 'right' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader size="xs" />
              ) : (
                <TranslatableMessage message={blockAction.save} />
              )}
            </Button>
          );
        } else if (canCancel) {
          subHeader = (
            <Button
              type="link"
              onClick={onCancel}
              style={{ float: 'right' }}
              aria-label="cancel-create"
            >
              <TranslatableMessage message={blockAction.cancel} />
            </Button>
          );
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
            <form onSubmit={handleSubmit}>
              <Field
                name="type"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={educationForm.typeLabel} />
                }
                modifier="dashed"
                options={typeOptions}
                component={RadioButtonField}
              />
              <Field
                name="organization"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage
                    message={educationForm.organizationLabel}
                  />
                }
                modifier="dashed"
                autoComplete="off"
                component={TextField}
              />
              {values.type !== EDUCATION_TYPE_SENIOR && (
                <Field
                  name="title"
                  className="ft-FormItem_inline"
                  label={
                    <TranslatableMessage message={educationForm.subjectLabel} />
                  }
                  modifier="dashed"
                  autoComplete="off"
                  component={TextField}
                />
              )}
              {values.type === EDUCATION_TYPE_SENIOR && (
                <Field
                  name="city"
                  className="ft-FormItem_inline"
                  label={
                    <TranslatableMessage message={educationForm.cityLabel} />
                  }
                  component={TextField}
                  modifier="dashed"
                />
              )}
              <Field
                name="period"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={educationForm.periodLabel} />
                }
                placeholder={
                  <TranslatableMessage
                    message={educationForm.periodPlaceholder}
                  />
                }
                viewMode={isTraining ? 'YM' : 'Y'}
                momentFormat={isTraining ? 'YYYY-MM' : 'YYYY'}
                normalize={(val) =>
                  val && val.startOf(isTraining ? 'month' : 'year')
                }
                component={RangeField}
                modifier="dashed"
                fieldMap={{ start: 'since', end: 'until' }}
                autoCloseOnChange
              />
              <Field
                name="description"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage
                    message={educationForm.descriptionLabel}
                  />
                }
                component={TextField}
                type="textarea"
                modifier="dashed"
                autosize
              />
              <Field
                name="pic"
                label={
                  <TranslatableMessage message={educationForm.imageLabel} />
                }
                component={ImageField}
                modifier="dashed"
                placeholder={
                  <TranslatableMessage message={educationForm.dropImageHint} />
                }
              />
            </form>
          </FtBlock>
        );
      }}
    </Formik>
  );
}

EducationForm.propTypes = {
  onSubmit: PropTypes.func,
  formRef: PropTypes.func,
  onCancel: PropTypes.func,
  canCancel: PropTypes.bool,
  submitTimeout: PropTypes.number,
  cacheValues: PropTypes.object,
  updateCache: PropTypes.func,
};
EducationForm.defaultProps = {
  submitTimeout: 10000,
};

export default EducationForm;
