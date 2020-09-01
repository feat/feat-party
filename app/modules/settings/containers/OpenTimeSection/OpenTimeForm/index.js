import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, Formik } from 'formik';

import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import PeriodRecordField from './PeriodRecordField';

const validate = () => {
  const errors = {};
  return errors;
};

export default function OpenTimeForm({ initialValues, onSubmit, formRef }) {
  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <form className="OpenTimeForm relative" onSubmit={handleSubmit}>
          {errors._error && (
            <FormHelp data={errors._error} validateStatus='error' />
          )}
          <FieldArray name="records" component={PeriodRecordField} />
          {isSubmitting && <MaskLoader loaderSize="sm" />}
        </form>
      )}
    </Formik>
  );
}

OpenTimeForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  formRef: PropTypes.func,
};
