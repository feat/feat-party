import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { formatMessage } from '@/services/intl';
import isEmpty from '@/utils/isEmpty';
import formMessages from '@/messages/form';

import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TextInput from '@feat/feat-ui/lib/text-input';
import CountdownButton from '@feat/feat-ui/lib/countdown-button';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import { paymentAccountForm, payMethod } from './messages';
import {
  PAY_METHOD_UNIONPAY,
  PAY_METHOD_ALIPAY,
  PAY_METHOD_WECHATPAY,
  // PAY_METHOD_DUMMY,
} from './constants';
import {
  uniBindAccountSentVCode,
  uniBindAccount,
  alipayInfo,
} from './requests';

class PaymentAccountForm extends React.PureComponent {
  payMethodOptions = [
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

  state = {
    type: this.payMethodOptions[0],
    uniAccount: '',
    uniPhone: '',
    uniVcode: '',
    alipayUrl: '',
  };

  getPayMethodOptions() {
    return this.payMethodOptions;
  }

  handleTypeChange = (value) => {
    if (value.value === PAY_METHOD_ALIPAY) {
      alipayInfo()
        .then(() => {
          this.setState({
            alipayUrl: '',
          });
        })
        .catch((err) => {
          if (err.code === 'ALIPAY_BIND_FIRST') {
            this.setState({
              alipayUrl: err.data.auth_url,
            });
          }
        });
    }
    this.setState({
      type: value,
    });
  };

  handleUniAccount = (e) => {
    this.setState({
      uniAccount: e.target.value,
      uniAccountError: null,
    });
  };

  handleUniPhone = (e) => {
    this.setState({
      uniPhone: e.target.value,
      uniPhoneError: null,
    });
  };

  handleVcode = (e) => {
    this.setState({
      uniVcode: e.target.value,
    });
  };

  uniSendVCode = () => {
    const { uniAccount, uniPhone } = this.state;
    // validate;
    const errors = {};
    if (!uniAccount.trim()) {
      errors.uniAccountError = formatMessage(formMessages.shortRequired);
    }
    if (!uniPhone.trim()) {
      errors.uniPhoneError = formatMessage(formMessages.shortRequired);
    }
    if (isEmpty(errors)) {
      this.setState({
        uniSendingVCode: true,
      });
      uniBindAccountSentVCode({
        account_no: this.state.uniAccount,
        phone: this.state.uniPhone,
        // pay_method: 0,
      })
        .then((res) => {
          if (res.code === 'SEND_VCODE') {
            this.countdownBtn.start();
            notification.info({
              message: formatMessage(paymentAccountForm.uniCodeSentTitle),
              description: res.message,
            });
          } else if (res.code === 'INCONSISTENT_PHONE') {
            this.setState({
              uniPhoneError: res.message,
            });
          }
        })
        .catch((err) => {
          if (err.code === 'ACCOUNT_INACTIVE') {
            // TODO: open
            notification.info({
              message: formatMessage(paymentAccountForm.popWindowBlockedTitle),
              description: formatMessage(
                paymentAccountForm.popWindowBlockedDesc,
              ),
            });

            const x = window.open();
            if (x) {
              x.document.open();
              x.document.write(err.data);
              x.document.close();
            }
          } else if (err.code === 'INCONSISTENT_PHONE') {
            this.setState({
              uniPhoneError: err.message,
            });
          } else if (err.code === 'SEND_VCODE') {
            this.countdownBtn.start();
            notification.info({
              message: formatMessage(paymentAccountForm.uniCodeSentTitle),
              description: err.message,
            });
          } else if (err.code === 'VALIDATION_EXCEPTION') {
            const mapped = {};
            if (err.data.account_no) {
              mapped.uniAccountError = err.data.account_no;
            }
            if (err.data.phone) {
              mapped.uniPhoneError = err.data.phone;
            }
            this.setState(mapped);
          }
        })
        .finally(() => {
          this.setState({
            uniSendingVCode: false,
          });
        });
    } else {
      this.setState(errors);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      type: { value: type },
      uniAccount,
      uniPhone,
      uniVcode,
    } = this.state;

    if (type === PAY_METHOD_UNIONPAY) {
      // TOOD Validate
      const errors = {};
      if (!uniAccount.trim()) {
        errors.uniAccountError = formatMessage(formMessages.shortRequired);
      }
      if (!uniPhone.trim()) {
        errors.uniPhoneError = formatMessage(formMessages.shortRequired);
      }
      if (!uniVcode.trim()) {
        errors.uniVcodeError = formatMessage(formMessages.shortRequired);
      }
      if (isEmpty(errors)) {
        this.setState({
          uniBindingAccount: true,
        });
        uniBindAccount({
          account_no: uniAccount,
          phone: uniPhone,
          vcode: uniVcode,
        })
          .then((res) => {
            // logging.debug(res);
            message.success(formatMessage(paymentAccountForm.uniBindSucceeded));
            if (this.props.onAccountBinded) {
              this.props.onAccountBinded(res.data);
            }
          })
          .catch((err) => {
            logging.debug(err);
          })
          .finally(() => {
            this.setState({
              uniBindingAccount: false,
            });
          });
      } else {
        this.setState(errors);
      }
    }
  };

  renderTypeFields() {
    const { accounts } = this.props;
    const { type } = this.state;
    if (type.value === PAY_METHOD_UNIONPAY) {
      return (
        <>
          <FormItem
            label={
              <FormLabel>{formatMessage(paymentAccountForm.accountNo)}</FormLabel>
            }
            help={
              this.state.uniAccountError ? (
                <FormHelp
                  data={this.state.uniAccountError}
                  validateStatus="error"
                />
              ) : null
            }
            validateStatus={this.state.uniAccountError ? 'error' : undefined}
            modifier="dashed"
          >
            {({ handleBlur, handleFocus, bindWidget }) => (
              <TextInput
                block
                ref={(n) => {
                  bindWidget(n);
                }}
                value={this.state.uniAccount}
                onChange={this.handleUniAccount}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            )}
          </FormItem>
          <FormItem
            label={
              <FormLabel>{formatMessage(paymentAccountForm.phone)}</FormLabel>
            }
            help={
              this.state.uniPhoneError ? (
                <FormHelp
                  data={this.state.uniPhoneError}
                  validateStatus="error"
                />
              ) : null
            }
            validateStatus={this.state.uniPhoneError ? 'error' : undefined}
            modifier="dashed"
          >
            {({ handleBlur, handleFocus, bindWidget }) => (
              <TextInput
                block
                ref={(n) => {
                  bindWidget(n);
                }}
                value={this.state.uniPhone}
                onChange={this.handleUniPhone}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            )}
          </FormItem>
          <FormItem
            label={
              <FormLabel>{formatMessage(paymentAccountForm.vcode)}</FormLabel>
            }
            validateStatus={this.state.uniVcodeError ? 'error' : undefined}
            modifier="dashed"
          >
            {({ handleBlur, handleFocus, bindWidget }) => (
              <TextInput
                ref={(n) => {
                  bindWidget(n);
                }}
                value={this.state.uniVcode}
                onChange={this.handleVcode}
                onFocus={handleFocus}
                onBlur={handleBlur}
                addonAfter={
                  <CountdownButton
                    size="sm"
                    ref={(n) => {
                      this.countdownBtn = n;
                    }}
                    onClick={this.uniSendVCode}
                    // type="merge"
                    count={60}
                    renderCountDown={(left) => `${left}s`}
                    disabled={this.state.uniSendingVCode}
                  >
                    {formatMessage(paymentAccountForm.sendCodeLabel)}
                  </CountdownButton>
                }
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              className="margin_y_12"
              htmlType="submit"
              block
              type="primary"
              disabled={this.state.uniBindingAccount}
            >
              {formatMessage(paymentAccountForm.submit)}
            </Button>
          </FormItem>
        </>
      );
    }
    if (type.value === PAY_METHOD_ALIPAY) {
      return (
        <>
          {this.state.alipayUrl ? (
            <div className="payment__alipay">
              <iframe
                src={this.state.alipayUrl}
                width={500}
                height={680}
                title="alipay"
              />
            </div>
          ) : (
            <>
              {accounts &&
                accounts.map((account) => {
                  if (account.pay_method === PAY_METHOD_ALIPAY) {
                    return (
                      <div className="st-PaymentAccountItem">
                        <div>已绑定支付宝</div>
                        <div className="st-PaymentAccountItem__main">
                          <div>
                            {formatMessage(payMethod[account.pay_method])} |{' '}
                            {account.account_no}
                          </div>
                        </div>
                        <div className="st-PaymentAccountItem__actions">
                          <SquareButton
                            style={{ position: 'absolute', right: 5, top: 2 }}
                            type="dashed"
                            size="xs"
                            onClick={() => this.props.deleteAccount(account)}
                          >
                            &times;
                          </SquareButton>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
            </>
          )}
        </>
      );
    }
    if (type.value === PAY_METHOD_WECHATPAY) {
      return (
        <>
          <div>WeChatPay</div>
        </>
      );
    }
    return null;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="payment__form">
        <FormItem 
          label={
            <FormLabel>{formatMessage(paymentAccountForm.payMethod)}</FormLabel>
          }
          modifier="dashed"
        >
          <Select
            value={this.state.type}
            onChange={this.handleTypeChange}
            options={this.getPayMethodOptions()}
          />
        </FormItem>
        {this.renderTypeFields()}
      </form>
    );
  }
}

PaymentAccountForm.propTypes = {
  onAccountBinded: PropTypes.func,
  accounts: PropTypes.array,
  deleteAccount: PropTypes.func,
};

export default PaymentAccountForm;
