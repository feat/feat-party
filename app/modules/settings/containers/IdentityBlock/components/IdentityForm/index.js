import React, { useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik'

import { formatMessage } from '@/services/intl';

import {
  GENDER_MALE,
  GENDER_FEMALE,
  MARRIAGE_SINGLE,
  MARRIAGE_MARRIED,
  FIRSTNAME_AHEAD,
  LASTNAME_AHEAD,
} from '@/modules/user/constants';

import commonMessages from '@/messages/common';
import formMessages from '@/messages/form';

import {
  genderOption as genderOptionMesssages,
  marriageOption as marriageOptionMesssages,
} from '@/modules/user/messages';

import warningIcon from '@/images/warning.svg';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import Loader from '@feat/feat-ui/lib/loader';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import SwitchButtonField from '@/components/Formik/SwitchButtonField';
import TextField from '@/components/Formik/TextField';

import DobField from './DobField';
import { profile as profileMessages } from '../../../../messages';
import intlMessages from '../../messages';
import { useTimeout } from '../../../../hooks'
import './style.scss';

const IdentityForm = (props) => {
  const { initialValues, formRef, onSubmit } = props;
  const hasNameData = initialValues.firstname && initialValues.lastname;
  const validate = useCallback(
    (values) => {
      const errors = {};
      if (!hasNameData) {
        const { firstname, lastname } = values;
        if (!firstname || firstname.trim() === '') {
          errors.firstname = formatMessage(formMessages.required, {
            field: formatMessage(profileMessages.firstnameLabel),
          });
        } else if (firstname.trim().length > 30) {
          errors.firstname = formatMessage(formMessages.max, {
            length: 30,
          });
        }
        if (!lastname || lastname.trim() === '') {
          errors.lastname = formatMessage(formMessages.required, {
            field: formatMessage(profileMessages.lastnameLabel),
          });
        } else if (lastname.trim().length > 30) {
          errors.lastname = formatMessage(formMessages.max, {
            length: 30,
          });
        }
      }
      return errors;
    },
    [initialValues],
  )
  const genderOptions = useMemo(() => [
    {
      value: GENDER_MALE,
      label: formatMessage(genderOptionMesssages[GENDER_MALE]),
    },
    {
      value: GENDER_FEMALE,
      label: formatMessage(genderOptionMesssages[GENDER_FEMALE]),
    },
  ], []);
  const marriageOptions = useMemo(() => [
    {
      value: MARRIAGE_SINGLE,
      label: formatMessage(marriageOptionMesssages[MARRIAGE_SINGLE]),
    },
    {
      value: MARRIAGE_MARRIED,
      label: formatMessage(marriageOptionMesssages[MARRIAGE_MARRIED]),
    },
  ], []);


  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, actions) => {
        const data = {...values};
        if (hasNameData) {
          delete data.firstname;
          delete data.lastname;
        }
        Object.keys(data).forEach((key) => {
          if (data[key] === null) {
            delete data[key];
          }
        })
        if (data.dob && typeof data.dob === 'object') {
          data.dob = data.dob.format('YYYY-MM-DD');
        }
        return onSubmit(data, actions);
      }}
    >
      {(formProps) => {
        const { values,  setValues, dirty } = formProps;
        const firstname = values.firstname || formatMessage(intlMessages.firstnamePlaceholder);
        const lastname = values.lastname || formatMessage(intlMessages.lastnamePlaceholder);
        const nameOptions = [
          { value: FIRSTNAME_AHEAD, label: `${firstname} ${lastname}` },
          { value: LASTNAME_AHEAD, label: `${lastname} ${firstname}` },
        ];
        const submitCallback = useCallback(() => {
          if (!hasNameData) {
            return;
          }
          if (formProps.dirty && formProps.isValid) {
            formProps.submitForm();
          }
        }, [values]);
        const timer = useTimeout(submitCallback, [values], props.submitTimeout);
        useEffect(() => {
          if (props.cacheValues) {
            setValues(props.cacheValues);
          }
        }, []);
        useEffect(() => {
          if (props.updateCache) {
            props.updateCache(dirty ? values: null);
          }
        }, [dirty]);

        let subHeader = null;
        if (formProps.dirty && !hasNameData) {
          subHeader = (
            <Button
              type="link"
              className="ft-Block__toggleBtn"
              onClick={() => {
                if (timer) {
                  clearTimeout(timer);
                }
                formProps.submitForm();
              }}
              style={{ float: 'right' }}
            >
              <TranslatableMessage message={commonMessages.lockAction} />
            </Button>
          )
        } else if (formProps.isSubmitting) {
          subHeader = (
            <Button
              type="link"
              className="ft-Block__toggleBtn"
              style={{ float: 'right' }}
              disabled
            >
              <Loader size="xs" />
            </Button>
          )
        }
      
        return (
          <FtBlock
            className='IdentityForm'
            title={
              <span className="padding_l_5">
                <TranslatableMessage
                  message={intlMessages.basicInfoSectionTitle}
                />
              </span>
            }
            subHeader={subHeader}
            secondary
            noPadding
          >
            <form onSubmit={formProps.handleSubmit}>
              {hasNameData ? (
                <Field
                  name="name_order"
                  label={
                    <TranslatableMessage message={profileMessages.nameLabel} />
                  }
                  className="ft-FormItem_inline"
                  component={SwitchButtonField}
                  options={nameOptions}
                  modifier="dashed"
                />    
              ) : (
                  <>
                    <div className="IdentityForm__nameNotice">
                      <div 
                        className="IdentityForm__noticeIcon"
                        dangerouslySetInnerHTML={{ __html: warningIcon }} 
                      />
                      <TranslatableMessage message={intlMessages.nameWarning} />
                    </div>
                    <Field
                      name="firstname"
                      label={
                        <TranslatableMessage message={profileMessages.firstnameLabel} />
                      }
                      modifier="dashed"
                      component={TextField}
                    />
                    <Field
                      name="lastname"
                      label={
                        <TranslatableMessage message={profileMessages.lastnameLabel} />
                      }
                      modifier="dashed"
                      component={TextField}
                    />
                    <Field
                      name="name_order"
                      label={
                        <TranslatableMessage message={profileMessages.nameLabel} />
                      }
                      modifier="dashed"
                      component={SwitchButtonField}
                      options={nameOptions}
                      placeholder={formatMessage(intlMessages.selectNameOrder)}
                    />
                  </>
              )}
              <Field
                name="gender"
                label={
                  <TranslatableMessage message={profileMessages.genderLabel} />
                }
                className="ft-FormItem_inline"
                component={SwitchButtonField}
                options={genderOptions}
                modifier="dashed"
                placeholder={formatMessage(intlMessages.selectGender)}
              />
              <Field
                name="marriage"
                label={
                  <TranslatableMessage message={profileMessages.marriageLabel} />
                }
                className="ft-FormItem_inline"
                component={SwitchButtonField}
                options={marriageOptions}
                modifier="dashed"
                placeholder={formatMessage(intlMessages.selectStatus)}
              />
              <Field
                name="dob"
                label={
                  <TranslatableMessage message={profileMessages.ageLabel} />
                }
                activeLabel={
                  <TranslatableMessage message={profileMessages.dobLabel} />
                }
                className="ft-FormItem_inline"
                modifier="dashed"
                component={DobField}
                minAge={16}
              />
            </form>
          </FtBlock>
        )
      }}
    </Formik>
  )
}

IdentityForm.propTypes = {
  initialValues: PropTypes.object,
  formRef: PropTypes.func,
  onSubmit: PropTypes.func,
  submitTimeout: PropTypes.number,
  cacheValues: PropTypes.object,
  updateCache: PropTypes.func,
}

IdentityForm.defaultProps = {
  submitTimeout: 1000,
}

export default IdentityForm;