import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';
import { getApplyScenes } from '@/client/user';
import { fetchProfessions } from '@/client/category';
import { isDirty } from '@/utils/form';

import { EXPERTISE_STATUS_PUBLISHED } from '@/modules/commerce/constants';

import formMessages from '@/messages/form';

import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TagGroupInput from '@/components/TagGroupInput';
import Input from '@feat/feat-ui/lib/text-input';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
// import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

// import CategorySelectField from '@/components/Formik/CategorySelectField';

import { form as expertiseForm } from '../messages';
import PriceButton from './PriceButton';
import './style.scss';

function fetchAsyncOptions(value) {
  return getApplyScenes(value).then(({ data }) =>
    data.map((item) => ({
      data: {
        value: item.label,
        label: item.label,
      },
      key: value,
    })),
  );
}

function fetchCategoryOptions(value) {
  return fetchProfessions({ name: value }).then(({ data }) =>
    data.map((item) => ({
      data: {
        value: item.id,
        label: item.name,
      },
      key: value,
    })),
  );
}

const validate = (values) => {
  const { name, applications, profession } = values;
  const errors = {};
  if (!name) {
    errors.name = formatMessage(formMessages.shortRequired);
  } else if (name.length > 50) {
    errors.name = formatMessage(formMessages.max, {
      field: formatMessage(expertiseForm.nameLabel),
      length: 50,
    });
  }

  if (!applications || !applications.length) {
    errors.applications = formatMessage(formMessages.shortRequired);
  }

  if (!profession || !profession.length) {
    errors.profession = formatMessage(formMessages.shortRequired);
  }

  return errors;
};

function ExpertiseForm(props) {
  const {
    initialValues,
    delaySubmit,
    cancelSubmit,
    onDelete,
    shouldAutoFocus,
    num,
    unitOptions,
  } = props;

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const errors = useMemo(() => validate(values), [values]);
  const isInit = initialValues.status === undefined;
  const setFieldTouched = useCallback(
    (name) => {
      setTouched({
        ...touched,
        [name]: true,
      });
    },
    [touched],
  );
  const setFieldValue = useCallback(
    (name, value) => {
      setValues({
        ...values,
        [name]: value,
      });
    },
    [values],
  );
  const getValidateInfo = useCallback(
    (name) => {
      if (
        (touched[name] && errors[name]) ||
        (!isInit && submitCount && errors[name])
      ) {
        return {
          validateStatus: 'error',
          // help: <FormHelp data={errors[name]} />,
        };
      }
      return {};
    },
    [touched, errors, submitCount],
  );

  const submitForm = useCallback(
    (delay) => {
      const isChange =
        values.name === initialValues.name &&
        values.applications.length === initialValues.applications.length &&
        values.profession.length === initialValues.profession.length;
      if (!isDirty(values, initialValues) && isChange) {
        return;
      }
      const isValid = Object.keys(errors).length === 0;
      const processed = {
        ...values,
        publish: isValid,
      };
      setSubmitCount(submitCount + 1);
      delaySubmit(processed, delay);
    },
    [values, initialValues],
  );

  const handleBlockFocus = useCallback(
    () => {
      cancelSubmit();
    },
    [cancelSubmit],
  );

  // fallback to submit
  useEffect(
    () => {
      submitForm(1000);
    },
    [values],
  );

  return (
    <form className="ExpertiseForm">
      <div className="ExpertiseForm__content">
        <div className="ExpertiseForm__basic">
          <div style={{ display: 'flex', position: 'relative' }}>
            <FormItem
              style={{ flex: 1 }}
              className="ft-FormItem_inline"
              label={
                <>
                  <FormLabel>
                    <TranslatableMessage message={expertiseForm.nameLabel} />
                    <span style={{ marginLeft: '.25em' }}>#{num}</span>
                  </FormLabel>
                </>
              }
              modifier="dashed"
              {...getValidateInfo('name')}
            >
              {({ handleBlur, handleFocus, bindWidget }) => (
                <Input
                  value={values.name}
                  ref={(n) => {
                    bindWidget(n);
                  }}
                  name="name"
                  block
                  placeholder={formatMessage(expertiseForm.namePlaceholder)}
                  disabled={values.status === EXPERTISE_STATUS_PUBLISHED}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue('name', value);
                  }}
                  onBlur={() => {
                    handleBlur();
                    setFieldTouched('name');
                    submitForm(500);
                  }}
                  onFocus={(e) => {
                    handleFocus(e);
                    handleBlockFocus();
                  }}
                  autoFocus={shouldAutoFocus}
                />
              )}
            </FormItem>
            {props.showDeleteButton && (
              <div style={{ position: 'absolute', right: 0, top: 0 }}>
                <SquareButton
                  type="dashed"
                  onClick={onDelete}
                  tabIndex="-1"
                  size="xs"
                >
                  &times;
                </SquareButton>
              </div>
            )}
          </div>
          <FormItem
            className="ft-FormItem_inline ExpertiseForm__tagField"
            label={
              <FormLabel>
                <TranslatableMessage message={expertiseForm.applySceneLabel} />
              </FormLabel>
            }
            modifier="dashed"
            {...getValidateInfo('applications')}
          >
            {({ handleFocus, handleBlur, bindWidget }) => (
              <TagGroupInput
                ref={(n) => {
                  bindWidget(n);
                }}
                value={values.applications}
                onChange={(value) => {
                  setFieldValue('applications', value);
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  setFieldTouched('applications');
                  submitForm(500);
                }}
                onFocus={(e) => {
                  handleFocus(e);
                  handleBlockFocus();
                }}
                asyncOptions={fetchAsyncOptions}
                autoCommit
                placeholder={formatMessage(expertiseForm.applyScenePlaceholder)}
                itemMaxLength={30}
              />
            )}
          </FormItem>
          <FormItem
            className="ft-FormItem_inline ExpertiseForm__CategoryField"
            label={
              <FormLabel>
                <TranslatableMessage message={expertiseForm.categoryLabel} />
              </FormLabel>
            }
            modifier="dashed"
            {...getValidateInfo('profession')}
          >
            {({ handleFocus, handleBlur, bindWidget }) => (
              <TagGroupInput
                ref={(n) => {
                  bindWidget(n);
                }}
                value={values.profession}
                onChange={(value) => {
                  setFieldValue('profession', value);
                }}
                onBlur={(e) => {
                  handleBlur(e);
                  setFieldTouched('profession');
                  submitForm(500);
                }}
                onFocus={(e) => {
                  handleFocus(e);
                  handleBlockFocus();
                }}
                asyncOptions={fetchCategoryOptions}
                autoCommit
                placeholder={formatMessage(expertiseForm.categoryPlaceholder)}
                itemMaxLength={30}
              />
            )}
          </FormItem>
          {/* <FormItem>
            <Checkbox
              checked={values.is_primary} 
              onChange={
                (e) => {
                  setFieldValue('is_primary',  e.target.checked)
                }
              }
              onBlur={() => {
                submitForm(500);
              }}
            >
              <TranslatableMessage
                message={expertiseForm.setAsPrimaryLabel}
              />
            </Checkbox>
          </FormItem> */}
        </div>
        <div className="ExpertiseForm__services">
          {values.services.map((item, index) => (
            <PriceButton
              key={item.type}
              data={item}
              unitOptions={unitOptions}
              showTypeLabel
              onChangeUnit={(unit) => {
                const updated = values.services.map((item) => ({
                  ...item,
                  unit,
                }));
                setFieldValue('services', updated);
              }}
              onChangePrice={(value) => {
                const r = {
                  ...item,
                  price: value,
                  is_available: !!value,
                };
                const { services: fieldValue } = values;
                const updated = [
                  ...fieldValue.slice(0, index),
                  r,
                  ...fieldValue.slice(index + 1),
                ];
                setFieldValue('services', updated);
              }}
              onFocus={() => {
                handleBlockFocus();
              }}
              onBlur={() => {
                submitForm(500);
              }}
            />
          ))}
          {/* <FormItem
            label={
              <FormLabel>
                <TranslatableMessage
                  message={expertiseForm.servicePrice}
                />
              </FormLabel>
            }
            help={<FormHelp data={values.currency} />}
          >
            
          </FormItem> */}
        </div>
      </div>
    </form>
  );
}

ExpertiseForm.propTypes = {
  initialValues: PropTypes.object,
  error: PropTypes.object,
  delaySubmit: PropTypes.func,
};

export default ExpertiseForm;
