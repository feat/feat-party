import React from 'react';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import moment from 'moment';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';

import TextField from '@/components/Formik/TextField';
import SelectField from '@/components/Formik/SelectField';
import DatePickerField from '@/components/Formik/DatePickerField';
import BoolField from '@/components/Formik/BoolField';
// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { paymentAccountForm, payMethod } from './messages';
import {
  PAY_METHOD_UNIONPAY,
  PAY_METHOD_ALIPAY,
  PAY_METHOD_WECHATPAY,
  // PAY_METHOD_DUMMY,
} from './constants';


const validate = (values) => {
  const errors = {};
  if (!values.pay_method) {
    errors.pay_method = formatMessage(formMessages.shortRequired);
  }
  return errors;
}

class PaymentAccountForm extends React.PureComponent {
  getPayMethodOptions() {
    if (!this.payMethodOptions) {
      this.payMethodOptions = [
        {
          value: PAY_METHOD_UNIONPAY,
          label: formatMessage(payMethod[PAY_METHOD_UNIONPAY]),
        },
        {
          value: PAY_METHOD_ALIPAY,
          label: formatMessage(payMethod[PAY_METHOD_ALIPAY]),
        },
        {
          value: PAY_METHOD_WECHATPAY,
          label: formatMessage(payMethod[PAY_METHOD_WECHATPAY]),
        },
      ];
    }
    return this.payMethodOptions;
  }

  render() {
    const { initialValues, onSubmit } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Field
                name="pay_method"
                label={formatMessage(paymentAccountForm.payMethod)}
                component={SelectField}
                options={this.getPayMethodOptions()}
              />
              <Field
                name="account_no"
                label={formatMessage(paymentAccountForm.accountNo)}
                component={TextField}
              />
              <Field
                name="expires"
                label={formatMessage(paymentAccountForm.expires)}
                component={DatePickerField}
                viewMode="YM"
                momentFormat="YYYY-MM"
                pickerMode="future"
                yearRange={5}
                placeholder="YYYY-MM"
                minDate={moment()
                  .startOf('day')
                  .toISOString()}
                maxDate={moment()
                  .add(5, 'year')
                  .toISOString()}
                autoCloseOnChange
                canClear
              />
              <Field
                name="phone"
                label={formatMessage(paymentAccountForm.phone)}
                component={TextField}
              />
              <Field
                name="default_receipt"
                label={formatMessage(paymentAccountForm.asDefaultReceiptAccount)}
                component={BoolField}
              />
              <Field
                name="default_payment"
                label={formatMessage(paymentAccountForm.asDefaultReceiptAccount)}
                component={BoolField}
              />
              {props.status && props.status.error && (
                <FormHelp data={props.status.error} validateStatus="error" />
              )}

              <Button className="margin_y_12" htmlType="submit" block type="primary">
                {formatMessage(paymentAccountForm.submit)}
              </Button>
            </form>
          )
        }}
      </Formik>
    );
  }
}

PaymentAccountForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default PaymentAccountForm;
