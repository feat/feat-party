import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import { formatMessage } from '@/services/intl';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import TextInput from '@feat/feat-ui/lib/text-input';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import DigitInput from '@feat/feat-ui/lib/digit-input';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Loader from '@feat/feat-ui/lib/loader';
import Button from '@feat/feat-ui/lib/button';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';
import CountdownButton from '@feat/feat-ui/lib/countdown-button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import CardBrandButton from '../CardBrandButton';
import {
  getCardNumber,
  getCardType,
  getCardTypeInfo,
  formatCardNumber,
  luhnCheck,
  formatExpiry,
} from '../../../../utils/card';

import intlMessages from './messages';
import commerceMessages from '../../../../messages';

import './style.scss';

const payMethodOptions = ['unionpay', 'visa', 'mastercard'];

const initialCardState = {
  isQueryingOpenStatus: false,
  popWindowError: null,
  isFetchingOpenTemplate: false,
  unionOpenTemplate: null,
  unionOpenInfoError: null,
  cardInfo: null,
  queryGatewayError: null,
  type: undefined, // 影响组件显示布局，当确认可以进行下一步动作时，才设置。
  typeInfo: null, // 缓存检测的类型信息
};

const initialState = {
  // Form
  cardNumber: '',
  vcode: '',
  cvc: '',
  phone: '',
  name: '',
  // Pointer
  account: undefined,
  cards: {},
};

/**
 * Flow
 * 1. input card number
 * 2. if is a valid card, initial account state,
 * 3. update account state,
 */
class PayMethodPanel extends React.PureComponent {
  state = initialState;

  reset = () => {
    this.setState(initialState);
  };

  updateCardState = (account, data, callback) => {
    const accountState = this.state.cards[account];
    this.setState(
      {
        cards: {
          ...this.state.cards,
          [account]: {
            ...accountState,
            ...data,
          },
        },
      },
      callback,
    );
  };

  submit = () => {
    const { account, vcode, payment } = this.state;
    const cardState = this.state.cards[account];

    if (!cardState) {
      // Form Error
      logging.warn('Cannot get card state when submit');
      return;
    }

    if (cardState.type === 'unionpay') {
      this.props.onConfirm({
        type: cardState.type,
        accountNo: account,
        vcode,
        paymentId: payment && payment.id,
      });
    } else {
      notification.info({
        message: 'Sorry',
        description: 'No related service support yet.',
      });
    }
    // TODO: ...
  };

  getCardState() {
    return get(this.state.cards, this.state.account, initialCardState);
  }

  queryOpenStatus = (card) => {
    const account = card instanceof Object || !card ? this.state.account : card;
    const cardState = this.state.cards[account];
    if (cardState.isQueryingOpenStatus) {
      return;
    }
    this.updateCardState(account, {
      isQueryingOpenStatus: true,
      isCardActive: undefined,
      queryGatewayError: null,
      openQueryOnceFetched: true,
    });

    this.props
      .unionpayQueryOpenStatus({
        accountNo: account,
      })
      .then(({ data }) => {
        this.updateCardState(
          account,
          {
            type: 'unionpay',
            cardInfo: data.consumer_info || data.data.consumer_info,
            isCardActive: true,
          },
          () => this.sendConsumeCode(account),
        );
      })
      .catch((err) => {
        if (err.code === 'SERVICE_NOT_OPEN') {
          this.updateCardState(account, {
            isCardActive: false,
          });
          if (!cardState.unionOpenTemplate) {
            this.queryOpenTemplate(account);
          }
        } else if (err.code) {
          this.updateCardState(account, {
            queryGatewayError: err,
          });
        }
        // message.error(get(err, 'response.data.message', err.message));
      })
      .finally(() => {
        this.updateCardState(account, {
          isQueryingOpenStatus: false,
        });
      });
  };

  sendConsumeCode = (card) => {
    const account = card instanceof Object ? this.state.account : card;
    const cardState = this.state.cards[account];
    this.updateCardState(account, {
      vcodeError: null,
      isSendingCode: true,
    });
    this.props
      .unionpaySendConsumeCode({
        accountNo: account,
        phone: get(cardState, 'cardInfo.phone_no'),
      })
      .then(({ data }) => {
        this.setState({
          payment: data.payment,
        });
        this.updateCardState(account, {
          vcodeSent: true,
        });
        if (this.digitInput) {
          this.digitInput.focus();
        }
      })
      .catch((err) => {
        this.updateCardState(account, {
          vcodeError: err,
        });
        // message.error(get(err, 'response.data.message', err.message));
      })
      .finally(() => {
        this.updateCardState(account, {
          isSendingCode: false,
          sendCodeLeft: 10,
        });
      });
  };

  queryOpenTemplate = (account) => {
    this.updateCardState(account, {
      isFetchingOpenTemplate: true,
    });
    this.props
      .unionpayGetOpenTemplate({
        accountNo: account,
      })
      .then(({ data }) => {
        this.updateCardState(account, {
          unionOpenTemplate: data.template,
        });
      })
      .catch((err) => {
        this.updateCardState(account, {
          unionOpenInfoError: err,
        });
      })
      .finally(() => {
        this.updateCardState(account, {
          isFetchingOpenTemplate: false,
        });
      });
  };

  handleCardNumberInput = (e) => {
    const inputVal = e.target.value;
    const number = getCardNumber(inputVal);
    const typeInfo = getCardType(number, payMethodOptions);

    const maxNumberLength = typeInfo ? typeInfo.maxNumberLength : 19;
    if (number.length > maxNumberLength) {
      return;
    }
    const cardNumber = formatCardNumber(number, typeInfo);
    this.setState(
      {
        cardNumber,
      },
      this.tryToDetectCardType,
    );
  };

  handleVcodeInput = (value) => {
    this.setState(
      {
        vcode: value,
      },
      () => {
        if (value.length === 6) {
          this.submit();
        }
      },
    );
  };

  handleExpiresInput = (e) => {
    const expires = formatExpiry(e);
    this.setState(
      {
        expires,
      },
      this.tryToFocusCvc,
    );
  };

  handleCVCInput = (e) => {
    const cvc = e.target.value.replace(/\D/g, '');
    const cardState = this.getCardState();
    const { cvcLength } = cardState.typeInfo;
    if (cvc.length > cvcLength[0]) {
      return;
    }
    this.setState(
      {
        cvc,
      },
      this.tryToFocusPhone,
    );
  };

  handlePhoneInput = (e) => {
    this.setState({
      phone: e.target.value,
    });
  };

  handleNameInput = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  setCardType = (type) => {
    const { account } = this.state;
    const cardState = this.getCardState();
    if (!cardState.typeInfo && !account) {
      message.error('Please input your card number first.');
      return;
    }
    if (
      type === cardState.type ||
      (cardState.typeInfo && type === cardState.typeInfo.type)
    ) {
      return;
    }
    const newCardState = {
      ...cardState,
    };
    newCardState.type = type;
    newCardState.typeInfo = getCardTypeInfo(type);
    let callback;
    if (type === 'unionpay') {
      callback = () => this.queryOpenStatus(account);
    } else {
      callback = this.expiresInput.focus;
    }
    this.setState(
      {
        cards: {
          ...this.state.cards,
          [account]: newCardState,
        },
      },
      callback,
    );
  };

  tryToDetectCardType = () => {
    const { cardNumber } = this.state;
    const number = getCardNumber(cardNumber);
    const typeInfo = getCardType(number, payMethodOptions);

    const shouldCheckLuhn =
      typeInfo && typeInfo.lengths.indexOf(number.length) > -1;

    // set account
    this.setState({
      account: number,
    });

    if (!shouldCheckLuhn) {
      return;
    }

    const isValidCardNumber = shouldCheckLuhn && luhnCheck(number);

    let cardState = this.state.cards[number];

    // has cardState already
    if (cardState) {
      return;
    }

    let callback;
    cardState = { ...initialCardState };

    if (typeInfo.type === 'unionpay') {
      // if is valid card number, init auto query
      cardState.typeInfo = typeInfo;
      if (isValidCardNumber) {
        callback = () => this.queryOpenStatus(number);
      } else {
        if (this.showOpenQueryBtnTimer) {
          clearTimeout(this.showOpenQueryBtnTimer);
        }
        this.showOpenQueryBtnTimer = setTimeout(() => {
          this.updateCardState(number, { shouldShowQueryBtn: true });
        }, 500);
      }
    } else if (isValidCardNumber) {
      // is master or visa
      cardState.type = typeInfo.type;
      cardState.typeInfo = typeInfo;
      callback = this.expiresInput.focus;
    }

    this.setState(
      {
        cards: {
          ...this.state.cards,
          [number]: cardState,
        },
      },
      callback,
    );
  };

  tryToFocusCvc = () => {
    const { expires } = this.state;
    if (/\d{2} \/ \d{2}/.test(expires)) {
      this.cvcInput.focus();
    }
  };

  tryToFocusPhone = () => {
    const cardState = this.getCardState();
    const { typeInfo } = cardState;
    if (
      typeInfo.cvcLength.length === 1 &&
      typeInfo.cvcLength[0] === this.state.cvc.length
    ) {
      this.phoneInput.focus();
    }
  };

  tryToResetType = (e) => {
    const { keyCode } = e;
    if (keyCode === 8) {
      // backspace
      this.setState({
        account: undefined,
      });
    }
  };

  handleOpenLinkClicked = () => {
    const { account } = this.state;
    const cardState = this.getCardState();
    if (cardState.unionOpenTemplate) {
      const x = window.open();
      if (x) {
        x.document.open();
        x.document.write(cardState.unionOpenTemplate);
        x.document.close();
        this.updateCardState(account, {
          popWindowOpened: true,
          popWindowError: false,
        });
      } else {
        // message.error(formatMessage(intlMessages.windowHasBeenBlocked));
        this.updateCardState(account, {
          popWindowError: true,
        });
      }
    }
  };

  renderUnionpayInfo() {
    const cardState = this.getCardState();
    if (cardState.isQueryingOpenStatus) {
      return null;
    }
    return (
      <div className="cm-PayMethodPanel__info">
        {cardState.isCardActive === false && (
          <div>
            <div>
              <TranslatableMessage
                message={intlMessages.unionpayCardIsNotActive}
              />
              <Button
                disabled={cardState.isQueryingOpenStatus}
                onClick={this.handleOpenLinkClicked}
                type="link"
              >
                {cardState.isFetchingOpenTemplate ? (
                  <Loader size="xs" />
                ) : (
                  <TranslatableMessage message={intlMessages.unionpayOpenNow} />
                )}
              </Button>
            </div>
          </div>
        )}
        {(cardState.shouldShowQueryBtn || cardState.queryGatewayError) &&
          !cardState.type &&
          !cardState.unionOpenTemplate && (
          <Button onClick={this.queryOpenStatus}>
            {cardState.openQueryOnceFetched ? (
              <TranslatableMessage
                message={intlMessages.unionpayOpenQueryRetry}
              />
            ) : (
              <TranslatableMessage message={intlMessages.unionpayOpenQuery} />
            )}
          </Button>
        )}
        {cardState.popWindowOpened && (
          <Button onClick={this.queryOpenStatus}>
            <TranslatableMessage message={intlMessages.unionpayRecheck} />
          </Button>
        )}
        {cardState.popWindowError && (
          <FormHelp
            validateStatus="error"
            data={formatMessage(intlMessages.windowHasBeenBlocked)}
          />
        )}
      </div>
    );
  }

  renderVCodeHelp() {
    const cardState = this.getCardState();
    if (cardState.vcodeSent) {
      return (
        <FormHelp
          data={formatMessage(intlMessages.unionpayCodeSent, {
            phone: get(cardState, 'cardInfo.phone_no'),
          })}
        />
      );
    }
    return null;
  }

  renderPayRequestError() {
    const { payRequestError } = this.props;
    if (!payRequestError) {
      return null;
    }
    if (payRequestError.code === 'INVALID_VCODE') {
      return (
        <div className="cm-PayMethodPanel__error">
          <FormHelp
            validateStatus="error"
            data={formatMessage(intlMessages.unionpayInvalidVcode)}
          />
        </div>
      );
    }
    return (
      <div className="cm-PayMethodPanel__error">
        <FormHelp validateStatus="error" data={payRequestError.message} />
      </div>
    );
  }

  render() {
    const cardState = this.getCardState();
    const { type } = cardState;

    return (
      <FeatModal className="cm-PayMethodPanel">
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.panelTitle} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content className={type ? `is-${type}` : undefined}>
            <p className="cm-PayMethodPanel__message">
              <TranslatableMessage message={intlMessages.panelMessage} />
            </p>
            <div className="cm-PayMethodPanel__methods">
              {payMethodOptions &&
                payMethodOptions.map((item) => (
                  <CardBrandButton
                    className="cm-PayMethodPanel__option"
                    selected={item === type}
                    icon={item}
                    key={item}
                    onClick={() => {
                      this.setCardType(item);
                    }}
                  />
                ))}
            </div>
            <div
              className={classNames('cm-PayMethodPanel__form', {
                [`is-${type}`]: type,
              })}
            >
              <div className="cm-PayMethodPanel__row">
                <FormItem
                  className="cm-PayMethodPanel__cardNumber"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.cardNumber} />
                    </FormLabel>
                  }
                >
                  <TextInput
                    name="cardNumber"
                    size="md"
                    value={this.state.cardNumber}
                    onChange={this.handleCardNumberInput}
                    onKeyDown={this.tryToResetType}
                    placeholder="XXXX XXXX XXXX XXXX"
                    autoFocus
                    addonAfter={
                      <Loader
                        className={classNames(
                          'cm-PayMethodPanel__accountLoader',
                          {
                            'is-visible': cardState.isQueryingOpenStatus,
                          },
                        )}
                        size="xs"
                      />
                    }
                  />
                </FormItem>
                <FormItem
                  className="cm-PayMethodPanel__expires"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.expires} />
                    </FormLabel>
                  }
                >
                  <TextInput
                    name="expires"
                    size="md"
                    ref={(n) => {
                      this.expiresInput = n;
                    }}
                    value={this.state.expires}
                    onChange={this.handleExpiresInput}
                    placeholder="MM/YY"
                  />
                </FormItem>
                <FormItem
                  className="cm-PayMethodPanel__cvc"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.cvc} />
                    </FormLabel>
                  }
                >
                  <TextInput
                    name="cvc"
                    size="md"
                    ref={(n) => {
                      this.cvcInput = n;
                    }}
                    value={this.state.cvc}
                    onChange={this.handleCVCInput}
                    placeholder="XXX"
                  />
                </FormItem>
              </div>
              {cardState.typeInfo &&
                cardState.typeInfo.type === 'unionpay' &&
                this.renderUnionpayInfo()}
              <div className="cm-PayMethodPanel__row">
                <FormItem
                  className="cm-PayMethodPanel__phone"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.phone} />
                    </FormLabel>
                  }
                >
                  <TextInput
                    name="phone"
                    size="md"
                    ref={(n) => {
                      this.phoneInput = n;
                    }}
                    value={this.state.phone}
                    onChange={this.handlePhoneInput}
                  />
                </FormItem>
                <FormItem
                  className="cm-PayMethodPanel__name"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.name} />
                    </FormLabel>
                  }
                >
                  <TextInput
                    name="name"
                    size="md"
                    value={this.state.name}
                    onChange={this.handleNameInput}
                  />
                </FormItem>
                <FormItem
                  className="cm-PayMethodPanel__vCode"
                  label={
                    <FormLabel>
                      <TranslatableMessage message={intlMessages.vcode} />
                    </FormLabel>
                  }
                  help={this.renderVCodeHelp()}
                >
                  <div className="padding_y_12">
                    <DigitInput
                      ref={(n) => {
                        this.digitInput = n;
                      }}
                      digitCount={6}
                      value={this.state.vcode}
                      onChange={this.handleVcodeInput}
                      size="md"
                    />
                    {this.renderPayRequestError()}
                  </div>
                  {cardState.isSendingCode ? (
                    <Button className="cm-PayMethodPanel__sendCodeBtn" disabled>
                      {formatMessage(intlMessages.sendingCode)}
                    </Button>
                  ) : (
                    <CountdownButton
                      className="cm-PayMethodPanel__sendCodeBtn"
                      count={10}
                      left={cardState.sendCodeLeft}
                      renderCountDown={(left) =>
                        formatMessage(intlMessages.countdownMessage, {
                          time: left,
                        })
                      }
                      onClick={this.sendConsumeCode}
                    >
                      {cardState.vcodeSent || cardState.vcodeError ? (
                        <TranslatableMessage
                          message={intlMessages.resendVcode}
                        />
                      ) : (
                        <TranslatableMessage message={intlMessages.sendVcode} />
                      )}
                    </CountdownButton>
                  )}
                </FormItem>
              </div>
            </div>
            {this.props.submitting && (
              <MaskLoader
                loaderSize="sm"
                loaderLabel={
                  <TranslatableMessage
                    message={commerceMessages.paymentProcessing}
                  />
                }
              />
            )}
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              disabled={this.props.submitting}
              onClick={this.props.onCancel}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              disabled={this.props.submitting}
              onClick={this.submit}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }
}

PayMethodPanel.propTypes = {
  submitting: PropTypes.bool,
  unionpayQueryOpenStatus: PropTypes.func.isRequired,
  unionpayGetOpenTemplate: PropTypes.func.isRequired,
  unionpaySendConsumeCode: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  payRequestError: PropTypes.object,
};

export default PayMethodPanel;
