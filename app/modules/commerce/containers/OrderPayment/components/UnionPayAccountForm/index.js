import React from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import DigitInput from '@feat/feat-ui/lib/digit-input';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import message from '@feat/feat-ui/lib/message';
import CountdownButton from '@feat/feat-ui/lib/countdown-button';

import ApiError from '@/errors/ApiError';

import unionpayIcon from '@feat/payment-icons/min/flat/unionpay.svg';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from './messages';
import './style.scss';

class UnionPayAccountForm extends React.PureComponent {
  state = {
    vcode: '',
    left: 0,
  };

  componentDidMount() {
    this.requestCode();
  }

  requestCode = () => {
    this.setState({
      isRequestingVcode: true,
    });
    if (this.props.payRequestError) {
      this.props.resetPayRequestError();
    }
    return this.props
      .sendCode({
        accountId: this.props.account.id,
      })
      .then(({ data }) => {
        this.setState(
          {
            vcodeSent: true,
            vcode: '',
            payment: data ? data.payment : undefined,
          },
          this.digitInput ? this.digitInput.focus : undefined,
        );
      })
      .catch((err) => {
        message.error(formatMessage(intlMessages.failedToGetVcode));
        this.setState({
          vcodeFailed: true,
        });
        if (!(err instanceof ApiError)) {
          logging.error(err);
        }
      })
      .finally(() => {
        this.setState({
          isRequestingVcode: false,
          left: 10,
        });
      });
  };

  handleVcodeChange = (value) => {
    this.setState(
      {
        vcode: value,
      },
      () => {
        if (this.props.payRequestError) {
          this.props.resetPayRequestError();
        }
        if (value.length === 6) {
          this.submit();
        }
      },
    );
  };

  submit = () => {
    const data = {
      accountId: this.props.account.id,
      vcode: this.state.vcode,
      paymentId: this.state.payment ? this.state.payment.id : undefined,
    };
    this.props.onSubmit(data);
  };

  renderRequestError() {
    const { payRequestError } = this.props;
    if (!payRequestError) {
      return null;
    }
    if (payRequestError.code === 'INVALID_VCODE') {
      return (
        <div className="cm-UnionPaySection__error">
          <FormHelp
            validateStatus="error"
            data={formatMessage(intlMessages.invalidVcode)}
          />
        </div>
      );
    }
    return (
      <div className="cm-UnionPaySection__error">
        <FormHelp validateStatus="error" data={payRequestError.message} />
      </div>
    );
  }

  render() {
    const { isRequestingVcode, vcodeSent, vcodeFailed } = this.state;

    return (
      <div className="cm-UnionPaySection">
        <h3 className="cm-UnionPaySection__header">
          <span
            className="cm-PayMethodIcon"
            dangerouslySetInnerHTML={{ __html: unionpayIcon }}
          />
          <TranslatableMessage message={intlMessages.title} />
        </h3>
        <div className="margin_y_24">
          <div className="margin_b_24 t-center">
            <TranslatableMessage message={intlMessages.inputVcodeHint} />
          </div>
          <DigitInput
            ref={(n) => {
              this.digitInput = n;
            }}
            digitCount={6}
            value={this.state.vcode}
            size="md"
            onChange={this.handleVcodeChange}
          />
          {this.renderRequestError()}
        </div>
        <div className="cm-UnionPaySection__footer margin_b_24">
          {isRequestingVcode && (
            <Button disabled>
              <TranslatableMessage message={intlMessages.sendingVcode} />
            </Button>
          )}
          {!isRequestingVcode && (
            <CountdownButton
              count={10}
              left={this.state.left}
              renderCountDown={(left) =>
                formatMessage(intlMessages.countdownMessage, {
                  time: left,
                })
              }
              onClick={this.requestCode}
            >
              {vcodeSent || vcodeFailed ? (
                <TranslatableMessage message={intlMessages.resendVcode} />
              ) : (
                <TranslatableMessage message={intlMessages.sendVcode} />
              )}
            </CountdownButton>
          )}
        </div>
        {this.props.submitting && <MaskLoader />}
      </div>
    );
  }
}

UnionPayAccountForm.propTypes = {
  account: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  sendCode: PropTypes.func.isRequired,
  payRequestError: PropTypes.object,
  resetPayRequestError: PropTypes.func,
};

export default UnionPayAccountForm;
