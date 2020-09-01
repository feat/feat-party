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
import RangeField from '@/components/Formik/RangeField';
import BoolField from '@/components/Formik/BoolField';
import ImageField from '@/components/Formik/ImageField';

import intlMessages, { form as careerForm } from './messages';
import { blockAction } from '../../messages';
import { useAutoSubmit } from '../../hooks';

const validate = (values) => {
  const {
    organization,
    position,
    description,
    achievement,
    working_on,
    since,
    period,
  } = values;
  const errors = {};
  if (!organization) {
    errors.organization = formatMessage(formMessages.shortRequired);
  } else if (organization.trim().length > 150) {
    errors.organization = formatMessage(formMessages.max, {
      field: formatMessage(careerForm.organizationLabel),
      length: 150,
    });
  }
  if (!position) {
    errors.position = formatMessage(formMessages.shortRequired);
  } else if (position.trim().length > 50) {
    errors.position = formatMessage(formMessages.max, {
      field: formatMessage(careerForm.positionLabel),
      length: 50,
    });
  }
  if (!description) {
    errors.description = formatMessage(formMessages.shortRequired);
  } else if (description.trim().length > 1000) {
    errors.description = formatMessage(formMessages.max, {
      field: formatMessage(careerForm.descriptionLabel),
      length: 1000,
    });
  }
  if (!achievement) {
    errors.achievement = formatMessage(formMessages.shortRequired);
  } else if (achievement.trim().length > 1000) {
    errors.achievement = formatMessage(formMessages.max, {
      field: formatMessage(careerForm.achievementLabel),
      length: 1000,
    });
  }
  if (working_on) {
    if (!since) {
      errors.since = formatMessage(formMessages.shortRequired);
    }
  } else if (!period.since || !period.until) {
    errors.period = formatMessage(formMessages.shortRequired);
  }

  return errors;
};

function  CareerForm(props) {
  const { onSubmit, initialValues, formRef, onCancel, canCancel, cacheValues } = props;
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      innerRef={formRef}
    >
      {(formProps) => {
        const { dirty, status, values, isValid, isSubmitting, setValues } = formProps;
        const { working_on: workingOn } = values;
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
        useEffect(() => {
          if (cacheValues) {
            const processed = {...cacheValues};
            if (processed.since) {
              processed.since = moment(processed.since);
            }
            if (processed.period && processed.period.since) {
              processed.period.since = moment(processed.period.since);
            }
            if (processed.period && processed.period.until) {
              processed.period.until = moment(processed.period.until);
            }
            setValues(processed);
          }
        }, []);
        useEffect(() => {
          props.updateCache && props.updateCache(dirty ? values : null);
        }, [values]);

        let subHeader = null;
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
                <Loader size='xs' />
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
            <form className="CareerForm" onSubmit={handleSubmit}>
              <Field
                name="organization"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={careerForm.organizationLabel} />
                }
                component={TextField}
                autoFocus={canCancel}
                modifier="dashed"
              />
              <Field
                name="position"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={careerForm.positionLabel} />
                }
                component={TextField}
                modifier="dashed"
              />
              <Field
                name="description"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={careerForm.descriptionLabel} />
                }
                component={TextField}
                type="textarea"
                autosize
                modifier="dashed"
              />
              <Field
                name="achievement"
                className="ft-FormItem_inline"
                label={
                  <TranslatableMessage message={careerForm.achievementLabel} />
                }
                component={TextField}
                type="textarea"
                autosize
                modifier="dashed"
              />
              <Field
                name="working_on"
                className="ft-FormItem_inline"
                component={BoolField}
                label={
                  <TranslatableMessage message={careerForm.workingThereLabel} />
                }
                modifier="dashed"
              />
              {workingOn && (
                <Field
                  name="since"
                  className="ft-FormItem_inline"
                  label={
                    <TranslatableMessage message={careerForm.dateFromLabel} />
                  }
                  component={DatePickerField}
                  viewMode="YM"
                  normalize={(val) => val && val.startOf('month')}
                  placeholder={
                    <TranslatableMessage message={careerForm.datePlacehodler} />
                  }
                  momentFormat="YYYY-MM"
                  modifier="dashed"
                  autoCloseOnChange
                />
              )}
              {!workingOn && (
                <Field
                  name="period"
                  className="ft-FormItem_inline"
                  label={
                    <TranslatableMessage message={careerForm.periodLabel} />
                  }
                  component={RangeField}
                  viewMode="YM"
                  normalize={(val) => val && val.startOf('month')}
                  momentFormat="YYYY MM"
                  modifier="dashed"
                  fieldMap={{ start: 'since', end: 'until' }}
                  placheholder={
                    <TranslatableMessage
                      message={careerForm.periodPlaceholder}
                    />
                  }
                  autoCloseOnChange
                />
              )}
              <Field
                name="pic"
                label={<TranslatableMessage message={careerForm.imageLabel} />}
                component={ImageField}
                modifier="dashed"
                placeholder={<TranslatableMessage message={careerForm.dropImageHint} />}
              />
              {status && <FormHelp validateStatus="error" data={status} />}
            </form>
          </FtBlock>
        );
      }}
    </Formik>
  );
}

CareerForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  canCancel: PropTypes.bool,
  formRef: PropTypes.func,
  submitTimeout: PropTypes.number,
  cacheValues: PropTypes.object,
  updateCache: PropTypes.func,
};

CareerForm.defaultProps = {
  initialValues: {
    organization: '',
    position: '',
    description: '',
    achievement: '',
    working_on: false,
    since: undefined,
    period: { since: undefined, until: undefined },
    pic: undefined,
  },
  submitTimeout: 2000,
};

export default CareerForm;
