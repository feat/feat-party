import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import classNames from 'classnames';

import commonMessages from '@/messages/common';
import { formatMessage } from '@/services/intl';

import FtBlock from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormValueStatic from '@feat/feat-ui/lib/form/FormValueStatic';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { asyncFetchCurrencyOptions } from '@/modules/choices/actions';
import { selectCurrencyOptions } from '@/modules/choices/selectors';

import intlMessages, { payMethod } from './messages';

import {
  asyncFetchPaymentSettings,
  asyncFetchPaymentAccounts,
  addPaymentAccount,
  asyncDeletePaymentAccount,
  asyncSetDefaultPaymentAccount,
  asyncSetDefaultReceiptAccount,
} from '../../actions/payment';
import { selectPaymentConfigBlockState } from '../../selectors';

import PaymentAccountForm from './PaymentAccountForm';
import './style.scss';

class PaymentConfigBlock extends Component {
  state = {
    showAccountForm: false,
  };

  componentDidMount() {
    if (!this.props.currencyOptions) {
      this.props.fetchCurrencyOptions().catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchPaymentAccounts().catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
      this.props.fetchPaymentSettings().catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  handleAccountBinded = (data) => {
    // TODO Fix Bind Request
    this.props.addPaymentAccountSuccess(data);
    this.setState({
      showAccountForm: false,
    });
  };

  handleSubmit = (values, actions) => {
    const { blockState: { basic, accounts } } = this.props;
    const promises = [];
    const lefts = values.accounts.map((a) => a.id);
    const removed = accounts.filter((a) => lefts.indexOf(a.id) === -1);
    Object.keys(values).forEach((key) => {
      if (key === 'accounts') {
        return;
      }
      if (values[key] !== basic[key]) {
        switch(key) {
          case 'default_receipt':
            promises.push(this.props.setDefaultReceiptAccount({ id: values[key] }));
            break;
          case 'default_payment':
            promises.push(this.props.setDefaultPaymentAccount({ id: values[key] }));
            break;
          case 'currency':
            // promises.push(this.props.)
            break;
          default: 
            logging.error(`Unknown payment setting :${key}`);
        }
      }
    });
    if (removed.length) {
      promises.push(
        Promise.all(removed.map(this.props.deletePaymentAccount)).then(() => {
          this.props.fetchPaymentAccounts();
        })
      )
    }
    Promise.all(promises).then(
      () => {
        message.success(formatMessage(intlMessages.paymentSettingsUpdated))
      }
    ).catch((err) => {
      notification.error({
        message: 'Error',
        description: err.message,
      });
    }).finally(() => {
      actions.setSubmitting(false);
    })
  }

  render() {
    const { blockState, currencyOptions, formRef } = this.props;
    if (!blockState.onceFetched || blockState.fetchingSettings ||!currencyOptions) {
      return (
        <FtBlock
          title={
            <span className="padding_x_5">
              <TranslatableMessage message={intlMessages.sectionTitle} />
            </span>
          }
          noPadding
        >
          <div>Loading...</div>
        </FtBlock>
      )
    }

    return (
      <Formik
        initialValues={{
          ...blockState.basic,
          accounts: blockState.accounts || [],
        }}
        enableReinitialize
        onSubmit={this.handleSubmit}
        innerRef={formRef}
      >
        {(formProps) => {
          const { dirty, values, setFieldValue } = formProps;
          const currencyOption = currencyOptions.find((item) => item.iso_code === values.currency);
          return (
            <FtBlock
              title={
                <span className="padding_x_5">
                  <TranslatableMessage message={intlMessages.sectionTitle} />
                </span>
              }
              subHeader={dirty && (
                <Button
                  type="link"
                  className="ft-Block__toggleBtn"
                  onClick={() => {
                    formProps.submitForm();
                  }}
                  style={{ float: 'right' }}
                  disabled={formProps.isSubmitting}
                >
                  <TranslatableMessage message={commonMessages.lockAction} />
                </Button>
              )}
              noPadding
            >
              <FormItem
                label={
                  <FormLabel>
                    <TranslatableMessage message={intlMessages.currencyLabel} />
                  </FormLabel>
                }
                modifier="dashed"
                className="ft-FormItem_inline"
              >
                <FormValueStatic block size="sm">
                  {currencyOption ? `${currencyOption.description} [${currencyOption.iso_code}]` : 'NONE'}
                </FormValueStatic>
              </FormItem>
              {this.state.showAccountForm ? (
                <FormItem
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.accountsLabel} />
                    </FormLabel>
                  }
                  help={
                    <SquareButton 
                      size="xs"
                      onClick={() => {
                        this.setState({
                          showAccountForm: false,
                        })
                      }}
                    >-</SquareButton>
                  }
                >
                  <PaymentAccountForm 
                    onAccountBinded={this.handleAccountBinded}
                  />
                </FormItem>
              ) : (
                <FormItem
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.accountsLabel} />
                    </FormLabel>
                  }
                  modifier="dashed"
                  help={
                    <SquareButton 
                      size="xs"
                      onClick={() => {
                        this.setState({
                          showAccountForm: true,
                        })
                      }}
                    >+</SquareButton>
                  }
                >
                  {(values.accounts.length) ? (
                    values.accounts.map((account, i) => (
                      <div className="st-PaymentAccountItem" key={account.id}>
                        <div className="st-PaymentAccountItem__main">
                          <div>
                            {formatMessage(payMethod[account.pay_method])} |{' '}
                            {account.account_no}
                          </div>
                        </div>
                        <div className="st-PaymentAccountItem__actions">
                          <Button
                            className={classNames('margin_r_12', {
                              'is-selected': account.id === values.default_receipt,
                            })}
                            type="merge"
                            size="xs"
                            onClick={() => {
                              setFieldValue('default_receipt', account.id);
                            }}
                          >
                            {formatMessage(intlMessages.setAsDefaultReceipt)}
                          </Button>

                          <Button
                            className={classNames({
                              'is-selected': account.id === values.default_payment,
                            })}
                            type="merge"
                            size="xs"
                            onClick={() => {
                              setFieldValue('default_payment', account.id);
                            }}
                          >
                            {formatMessage(intlMessages.setAsDefaultPayment)}
                          </Button>
                          <SquareButton
                            style={{ position: 'absolute', right: 5, top: 2 }}
                            type="dashed"
                            size="xs"
                            onClick={() => {
                              const updated = [
                                ...values.accounts.slice(0, i),
                                ...values.accounts.slice(i+1),
                              ];
                              setFieldValue('accounts', updated);
                            }}
                          >
                          &times;
                          </SquareButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <FormValueStatic block size="sm">
                      {formatMessage(commonMessages.emptyPlaceholder)}
                    </FormValueStatic>
                  )}
                </FormItem>
              )}
              
            </FtBlock>
          )
        }}
      </Formik>
    )
  }
}

PaymentConfigBlock.propTypes = {
  blockState: PropTypes.object,
  currencyOptions: PropTypes.array,
  // onLock: PropTypes.func,
  // onUnlock: PropTypes.func,
  fetchPaymentSettings: PropTypes.func,
  fetchCurrencyOptions: PropTypes.func,
  fetchPaymentAccounts: PropTypes.func,
  setDefaultReceiptAccount: PropTypes.func,
  setDefaultPaymentAccount: PropTypes.func,
  addPaymentAccountSuccess: PropTypes.func,
  deletePaymentAccount: PropTypes.func,

  formRef: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blockState: selectPaymentConfigBlockState,
  currencyOptions: selectCurrencyOptions,
});

const mapDispatchToProps = {
  fetchCurrencyOptions: asyncFetchCurrencyOptions,
  fetchPaymentSettings: asyncFetchPaymentSettings,
  fetchPaymentAccounts: asyncFetchPaymentAccounts,
  addPaymentAccountSuccess: addPaymentAccount.success,
  deletePaymentAccount: asyncDeletePaymentAccount,
  setDefaultReceiptAccount: asyncSetDefaultReceiptAccount,
  setDefaultPaymentAccount: asyncSetDefaultPaymentAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentConfigBlock);
