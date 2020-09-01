import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field } from 'formik'
import groupBy from 'lodash/groupBy';

import {
  LANGUAGE_LEVEL_NATIVE,
  LANGUAGE_LEVEL_PROFICIENCY,
  LANGUAGE_LEVEL_WORKABLE,
} from '@/modules/user/constants';

import FtBlock from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { selectLocales } from '@/modules/language/selectors';
import { asyncFetchLocales } from '@/modules/language/actions';
// import commonMessages from '@/messages/common'

import { formatMessage } from '@/services/intl';

import intlMessages from './messages';
import { selectLanguages, selectLanguageBlockState } from '../../selectors';
import { 
  asyncFetchLanguages, 
  asyncCreateLanguage,
  asyncDeleteLanguage,
} from '../../actions/language';

import LevelLanguageField from './LevelLanguageField';
import { useAutoSubmit } from '../../hooks';

const classifyLanguages = (records) => {
  const grouped = groupBy(records, (r) => r.level);
  const output = {};
  output[LANGUAGE_LEVEL_NATIVE] = grouped[LANGUAGE_LEVEL_NATIVE] || [];
  output[LANGUAGE_LEVEL_PROFICIENCY] = grouped[LANGUAGE_LEVEL_PROFICIENCY] || [];
  output[LANGUAGE_LEVEL_WORKABLE] = grouped[LANGUAGE_LEVEL_WORKABLE] || [];
  return output;
}

function LanguageBlock(props) {
  const {  formRef } = props;
  const languages = useSelector(selectLanguages);
  const blockState = useSelector(selectLanguageBlockState);
  const locales = useSelector(selectLocales);
  const dispatch = useDispatch();
  const fetchLocales = useCallback(() => {
    dispatch(asyncFetchLocales());
  }, [])

  useEffect(() => {
    if (!blockState.onceFetched && !blockState.loading) {
      dispatch(asyncFetchLanguages()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }, [])
  
  const submitCallback  = useCallback((values, actions) => {
    // get diff content;
    const formValues = [
      ...values[LANGUAGE_LEVEL_NATIVE],
      ...values[LANGUAGE_LEVEL_PROFICIENCY],
      ...values[LANGUAGE_LEVEL_WORKABLE],
    ];
    const getKey = (r) => `${r.level}_${r.locale}`;
    const baseLocales = languages.map(getKey);
    const newValues = formValues.filter((item) => baseLocales.indexOf(getKey(item)) === -1);
    const formLocales = formValues.map(getKey);
    const deleteValues = languages.filter((item) => formLocales.indexOf(getKey(item)) === -1);
    if (!newValues.length && !deleteValues.length) {
      actions.resetForm();
      return;
    }
    // may add another action to handle request.
    Promise.all(
      deleteValues.map((r) => dispatch(asyncDeleteLanguage(r)))
    ).then(
      Promise.all(
        newValues.map((r) => dispatch(asyncCreateLanguage(r)))
      )
    ) .then(() => {
      message.success({
        content: formatMessage(intlMessages.languageUpdateSuccess),
      });
    }).catch((err) => {
      notification.error({
        message: formatMessage(intlMessages.languageUpdateFailed),
        description: err.message,
      });
    }).finally(() => {
      actions.setSubmitting(false);
    })
  }, [languages]);
    

  if (!blockState.onceFetched || blockState.loading) {
    return (
      <FtBlock
        noPadding
        title={
          <span className="padding_x_5">
            <TranslatableMessage message={intlMessages.languageSectionTitle} />
          </span>
        }
      >
        <div>Loading...</div>
      </FtBlock>
    )
  }
  const grouped = useMemo(() => classifyLanguages(languages), [languages]);
  return (
    <Formik
      enableReinitialize
      innerRef={formRef}
      initialValues={grouped}
      onSubmit={submitCallback}
    >
      {(formProps) => {    
        const { values, isSubmitting } = formProps;
        const selectedLocales = [
          ...values[LANGUAGE_LEVEL_NATIVE],
          ...values[LANGUAGE_LEVEL_PROFICIENCY],
          ...values[LANGUAGE_LEVEL_WORKABLE],
        ].map((a) => a.locale);
        useAutoSubmit(formProps, props.submitTimeout);
        

        let subHeader = null;
        if (isSubmitting) {
          subHeader = (
            <Button
              type="link"
              className="ft-Block__toggleBtn"
              style={{ float: 'right' }}
              disabled
            >
              <Loader size='xs' />
            </Button>
          )
        }
        // const timer = useAutoSubmit(formProps, props.submitTimeout);
        // const handleSubmit = useCallback(() => {
        //   clearTimeout(timer);
        //   if (formProps.isSubmitting) {
        //     return;
        //   }
        //   formProps.handleSubmit();
        // }, [values, formProps.isSubmitting])
        // let subHeader = null;
        // if (formProps.dirty) {
        //   subHeader = (
        //     <Button
        //       type="link"
        //       className="ft-Block__toggleBtn"
        //       onClick={handleSubmit}
        //       style={{ float: 'right' }}
        //       disabled={formProps.isSubmitting}
        //     >
        //       {formProps.isSubmitting ? (
        //         <Loader size='xs' />
        //       ) : (
        //         <TranslatableMessage message={commonMessages.lockAction} />
        //       )}
        //     </Button>
        //   )
        // }
        return(
          <FtBlock
            noPadding
            title={
              <span className="padding_x_5">
                <TranslatableMessage message={intlMessages.languageSectionTitle} />
              </span>
            }
            subHeader={subHeader}
          >
            <FtBlock.Help className="padding_5">
              <TranslatableMessage message={intlMessages.languageSectionHint} />
            </FtBlock.Help>
            <Field
              name={LANGUAGE_LEVEL_NATIVE}
              component={LevelLanguageField}
              locales={locales}
              selectedLocales={selectedLocales}
              fetchLocales={fetchLocales}
              recordLimit={1}
            />
            <Field
              name={LANGUAGE_LEVEL_PROFICIENCY}
              component={LevelLanguageField}
              locales={locales}
              selectedLocales={selectedLocales}
              fetchLocales={fetchLocales}
            />
            <Field
              name={LANGUAGE_LEVEL_WORKABLE}
              component={LevelLanguageField}
              locales={locales}
              selectedLocales={selectedLocales}
              fetchLocales={fetchLocales}
            />
          </FtBlock>
        )
      }}
    </Formik>
  )
}

LanguageBlock.propTypes = {
  formRef: PropTypes.func,
  submitTimeout: PropTypes.number,
};

LanguageBlock.defaultProps = {
  submitTimeout: 200,
}

export default LanguageBlock;