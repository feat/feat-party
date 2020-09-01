import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Router from 'next/router';

import { withDeviceInfo } from '@/modules/device-info';

import {
  wtzOpenQuery as wtzOpenQueryRequest,
  wtzGetOpenTemplate as wtzGetOpenTemplateRequest,
  wtzSendConsumeCode as wtzSendConsumeCodeRequest,
} from '@/client/pay';

import cardIcon from '@feat/payment-icons/min/flat/default.svg';
import wechatPayIcon from '@feat/payment-icons/min/flat/wechat-pay.svg';
import alipayIcon from '@feat/payment-icons/min/flat/alipay.svg';
import unionpayIcon from '@feat/payment-icons/min/flat/unionpay.svg';

import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import FeatModal from '@feat/feat-ui/lib/feat-modal';

import Popover from '@feat/feat-ui/lib/popover';
import Modal from '@feat/feat-ui/lib/modal';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import QRCode from '@/components/QRCode';

import { selectCurrentUserId } from '@/modules/auth/selectors';

import OrderInfo from '../../components/OrderInfo';
import OrderBrief from '../../components/OrderBrief';
import MOrderInfo from '../../components/MOrderInfo';

import PayMethodPanel from './components/PayMethodPanel';
import UnionPayAccountForm from './components/UnionPayAccountForm';
import WechatPayInfo from './components/WechatPayInfo';

import {
  selectOrderPaymentState,
  selectUserCommerceInfo,
} from '../../selectors';
import {
  exitOrderPayment,
  selectPayMethod,
  resetPayMethod,
  selectPayAccount,
  postPayRequest,
  resetPayRequestError,
  setStep,
} from '../../actions/payment';

import intlMessages from '../../messages';
import {
  PAYMENT_STEP_REVIEW,
  PAYMENT_STEP_SET_PAY_METHOD,
  PAYMENT_STEP_PAID,
  PAY_METHOD_ALIPAY,
  // PAY_METHOD_CREDIT_CARD,
  PAY_METHOD_UNIONPAY_WTZ,
  PAY_METHOD_WECHAT,
} from '../../constants';

import './style.scss';

class OrderPayment extends React.Component {
  exitOrderPayment = () => {
    this.props.exitOrderPayment({
      orderId: this.props.payment.orderId,
    });
  };

  exitOrderPaymentAndRedirect = () => {
    const { currentUserId } = this.props;
    Router.push(
      {
        pathname: '/user-profile',
        query: {
          userId: currentUserId,
          dashTab: 'purchase',
        },
      },
      `/profile/${currentUserId}?dashTab=purchase`,
    );
    this.exitOrderPayment();
    // this.props.exitOrderPayment({
    //   orderId: this.props.payment.orderId,
    //   shouldRedirect: true,
    // });
  };

  enterConfigPayMethod = () => {
    if (this.methodPop) {
      this.methodPop.closePortal();
    }

    this.props.setStep({
      orderId: this.props.payment.orderId,
      data: PAYMENT_STEP_SET_PAY_METHOD,
    });
  };

  exitConfigPayMethod = () => {
    this.props.setStep({
      orderId: this.props.payment.orderId,
      data: PAYMENT_STEP_REVIEW,
    });
  };

  selectPayMethod = (method) => {
    this.props.selectPayMethod({
      orderId: this.props.payment.orderId,
      data: method,
    });
    if (this.methodPop) {
      this.methodPop.closePortal();
    }
  };

  resetPayMethod = () => {
    this.props.resetPayMethod({
      orderId: this.props.payment.orderId,
    });
  };

  selectPayAccount = (account) => {
    this.props.selectPayAccount({
      orderId: this.props.payment.orderId,
      data: account,
    });
    if (this.methodPop) {
      this.methodPop.closePortal();
    }
  };

  unionpayQueryOpenStatus = (data) =>
    wtzOpenQueryRequest({
      account_no: data.accountNo,
    });

  unionpayGetOpenTemplate = (data) =>
    wtzGetOpenTemplateRequest({
      account_no: data.accountNo,
    });

  unionpaySendConsumeCode = (data) => {
    const {
      payment: { order },
    } = this.props;
    if (data.accountId) {
      return wtzSendConsumeCodeRequest({
        sn: order.order.sn,
        account_id: data.accountId,
      });
    }
    return wtzSendConsumeCodeRequest({
      sn: order.order.sn,
      account_no: data.accountNo,
      phone: data.phone,
    });
  };

  handleUnionPaySubmit = (data) => {
    const {
      payment: { order },
    } = this.props;
    const preData = {
      payMethod: PAY_METHOD_UNIONPAY_WTZ,
      sn: order.order.sn,
      vcode: data.vcode,
    };
    if (data.accountNo) {
      preData.accountNo = data.accountNo;
    }
    if (data.accountId) {
      preData.accountId = data.accountId;
    }
    this.props.postPayRequest({
      orderId: this.props.payment.orderId,
      data: preData,
    });
  };

  handlePayMethodPanelSubmit = (data) => {
    logging.debug(data);
    if (data.type === 'unionpay') {
      this.handleUnionPaySubmit(data);
    } else {
      logging.log('TODO handlePayMethodPanelSubmit', data);
    }
  };

  resetPayRequestError = () => {
    this.props.resetPayRequestError({
      orderId: this.props.payment.orderId,
    });
  };

  tryToInitPaymentWithDefaultConfig = () => {
    const {
      userInfo: { paymentSettings },
      payment: { payAccount },
    } = this.props;

    const account =
      payAccount ||
      paymentSettings.accounts.find(
        (item) => item.id === paymentSettings.default_payment,
      );

    if (!account) {
      this.enterConfigPayMethod();
      return;
    }

    if (account.pay_method === PAY_METHOD_UNIONPAY_WTZ) {
      this.selectPayAccount(account);
      return;
    }
    if (account.pay_method === PAY_METHOD_WECHAT) {
      this.selectPayMethod(PAY_METHOD_WECHAT);
      return;
    }
    if (account.pay_method === PAY_METHOD_ALIPAY) {
      this.selectPayMethod(PAY_METHOD_ALIPAY);
    }
    logging.debug('INIT with default config', account);
    // TODO: handle credit card payment
    // this.props.postPayRequest({
    //   orderId: this.props.payment.orderId,
    //   data: {
    //     payMethod: account.pay_method,
    //     accountId: account.id,
    //     sn: order.order.sn,
    //   },
    // });
    // {
    //   this.props.postPayRequest({
    //     orderId: this.props.payment.orderId,
    //     data: {
    //       account: paymentSettings.default_payment,
    //     },
    //   });
    // }
  };

  renderUnionPayInfo() {
    const {
      payment: { order, payAccount, isPostingPay, payRequestError },
    } = this.props;
    return (
      <Modal isOpen maskClosable onClose={this.resetPayMethod}>
        <div className="ft-OrderPayment__overlay">
          <UnionPayAccountForm
            payRequestError={payRequestError}
            account={payAccount}
            order={order}
            onSubmit={this.handleUnionPaySubmit}
            submitting={isPostingPay}
            sendCode={this.unionpaySendConsumeCode}
            resetPayRequestError={this.resetPayRequestError}
          />
        </div>
      </Modal>
    );
  }

  renderWechatInfo() {
    const {
      payment: { isFetchingWechatPayInfo, wechatPayInfo, wechatPayInfoError },
    } = this.props;
    return (
      <Modal isOpen maskClosable onClose={this.resetPayMethod}>
        <div className="ft-OrderPayment__overlay">
          <div className="cm-WechatPaySection">
            {isFetchingWechatPayInfo && <MaskLoader />}
            {wechatPayInfo && (
              <React.Fragment>
                <QRCode text={wechatPayInfo.info.code_url} />
                <div className="cm-WechatPaySection__hint">
                  <TranslatableMessage message={intlMessages.scanWithWechat} />
                </div>
              </React.Fragment>
            )}
            {wechatPayInfoError && (
              <TranslatableMessage
                message={intlMessages.wechatPayInfoError}
                values={{ message: wechatPayInfoError.message }}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }

  renderMobileWechatInfo() {
    const {
      payment: { isFetchingWechatPayInfo, wechatPayInfo, wechatPayInfoError },
    } = this.props;

    return (
      <WechatPayInfo
        loading={isFetchingWechatPayInfo}
        info={wechatPayInfo}
        error={wechatPayInfoError}
      />
    );
  }

  renderAlipayInfo() {
    const {
      payment: { isFetchingAlipayInfo, alipayInfo, alipayInfoError },
    } = this.props;
    return (
      <Modal isOpen maskClosable onClose={this.resetPayMethod}>
        <div className="ft-OrderPayment__overlay">
          <div className="cm-AlipaySection">
            {isFetchingAlipayInfo && <MaskLoader />}
            {alipayInfo && (
              <React.Fragment>
                <div className="cm-AlipaySection__qrcode">
                  <iframe
                    title="alipay-qrcode"
                    width={230}
                    height={235}
                    src={alipayInfo.info.redirect_url}
                    srcDoc={alipayInfo.info.html}
                  />
                </div>
                <div className="cm-AlipaySection__hint">
                  <TranslatableMessage message={intlMessages.scanWithAlipay} />
                </div>
              </React.Fragment>
            )}
            {!isFetchingAlipayInfo &&
              alipayInfoError && (
              <TranslatableMessage message={intlMessages.alipayInfoError} />
            )}
          </div>
        </div>
      </Modal>
    );
  }

  renderPayMethod = (info) => {
    if (info instanceof Object) {
      switch (info.pay_method) {
        case PAY_METHOD_UNIONPAY_WTZ:
          return (
            <>
              <span
                className="cm-PayMethodIcon"
                dangerouslySetInnerHTML={{ __html: unionpayIcon }}
              />
              {info.account_no}
            </>
          );
        case PAY_METHOD_WECHAT:
          return (
            <span
              className="cm-PayMethodIcon"
              dangerouslySetInnerHTML={{ __html: wechatPayIcon }}
            />
          );
        case PAY_METHOD_ALIPAY:
          return (
            <span
              className="cm-PayMethodIcon"
              dangerouslySetInnerHTML={{ __html: alipayIcon }}
            />
          );
        default:
          return (
            <>
              <span
                className="cm-PayMethodIcon"
                dangerouslySetInnerHTML={{ __html: cardIcon }}
              />
              {info.account_no}
            </>
          );
      }
    }
    switch (info) {
      case PAY_METHOD_WECHAT:
        return (
          <TranslatableMessage message={intlMessages.payMethodWechatPay} />
        );
      case PAY_METHOD_ALIPAY:
        return <TranslatableMessage message={intlMessages.payMethodAlipay} />;
      default:
        return <div>ERROR</div>;
    }
  };

  renderPayMethodOptions = () => {
    const {
      userInfo: {
        paymentSettings: { accounts, default_payment: defaultId },
      },
    } = this.props;
    const sorted = [...accounts]
      .filter((account) => account.pay_method === PAY_METHOD_UNIONPAY_WTZ)
      .sort((item) => (item.id === defaultId ? -1 : 1));
    return (
      <div className="ft-OrderPayment__methodPop">
        {sorted.map((item) => (
          <div
            className="ft-PayMethodLineItem"
            key={item.id}
            onClick={() => this.selectPayAccount(item)}
          >
            {item.pay_method === PAY_METHOD_UNIONPAY_WTZ && (
              <div className="ft-PayMethodLineItem__icon">
                <span
                  className="cm-PayMethodIcon"
                  dangerouslySetInnerHTML={{ __html: unionpayIcon }}
                />
              </div>
            )}
            {item.pay_method !== PAY_METHOD_UNIONPAY_WTZ && (
              <div className="ft-PayMethodLineItem__icon">
                <span
                  className="cm-PayMethodIcon"
                  dangerouslySetInnerHTML={{ __html: cardIcon }}
                />
              </div>
            )}
            <div className="ft-PayMethodLineItem__main">{item.account_no}</div>
            {item.id === defaultId && (
              <span className="ft-PayMethodLineItem__sub">
                <TranslatableMessage message={intlMessages.defaultLabel} />
              </span>
            )}
          </div>
        ))}
        <div
          className="ft-PayMethodLineItem"
          onClick={() => this.selectPayMethod(PAY_METHOD_WECHAT)}
        >
          <div className="ft-PayMethodLineItem__icon">
            <span
              className="cm-PayMethodIcon"
              dangerouslySetInnerHTML={{ __html: wechatPayIcon }}
            />
          </div>
          <div className="ft-PayMethodLineItem__main">
            <TranslatableMessage message={intlMessages.payMethodWechatPay} />
          </div>
        </div>
        <div
          className="ft-PayMethodLineItem"
          onClick={() => this.selectPayMethod(PAY_METHOD_ALIPAY)}
        >
          <div className="ft-PayMethodLineItem__icon">
            <span
              className="cm-PayMethodIcon"
              dangerouslySetInnerHTML={{ __html: alipayIcon }}
            />
          </div>
          <div className="ft-PayMethodLineItem__main">
            <TranslatableMessage message={intlMessages.payMethodAlipay} />
          </div>
        </div>
        <div
          className="ft-PayMethodLineItem"
          onClick={this.enterConfigPayMethod}
        >
          <div className="ft-PayMethodLineItem__icon">
            <span
              className="cm-PayMethodIcon"
              dangerouslySetInnerHTML={{ __html: cardIcon }}
            />
          </div>
          <div className="ft-PayMethodLineItem__main">
            <TranslatableMessage message={intlMessages.newCard} />
          </div>
        </div>
      </div>
    );
  };

  renderPayMethodSelect() {
    const {
      payment: { payAccount, payMethod },
      userInfo: { isFetchingUserPaymentSettings, paymentSettings },
    } = this.props;

    if (isFetchingUserPaymentSettings || !paymentSettings) {
      return (
        <Button
          className="ft-OrderPayment__methodTrigger"
          size="md"
          block
          disabled
        >
          <Loader size="sm">
            <TranslatableMessage
              message={intlMessages.loadingPaymentSettings}
            />
          </Loader>
        </Button>
      );
    }

    if (paymentSettings.accounts && paymentSettings.accounts.length === 0) {
      return (
        <Button
          className="ft-OrderPayment__methodTrigger"
          size="md"
          block
          onClick={this.enterConfigPayMethod}
        >
          <TranslatableMessage message={intlMessages.addPayAccount} />
        </Button>
      );
    }

    let currentMethod;
    if (payAccount) {
      currentMethod = payAccount;
    } else if (payMethod) {
      currentMethod = payMethod;
    } else {
      currentMethod = paymentSettings.accounts.find(
        (item) => item.id === paymentSettings.default_payment,
      );
    }

    return (
      <Popover
        placement="bottomLeft"
        content={this.renderPayMethodOptions()}
        wrapWithDefaultLayer={false}
        ref={(n) => {
          this.methodPop = n;
        }}
        node={null}
      >
        <Button className="ft-OrderPayment__methodTrigger" size="md" block>
          {currentMethod ? (
            this.renderPayMethod(currentMethod)
          ) : (
            <TranslatableMessage message={intlMessages.selectPayMethod} />
          )}
        </Button>
      </Popover>
    );
  }

  renderReviewPanel() {
    const { payment, userInfo, isMobile } = this.props;

    if (isMobile) {
      return (
        <FeatModal>
          <FeatModal.Wrap>
            <FeatModal.Header>
              <FeatModal.Title>
                <TranslatableMessage message={intlMessages.paymentLabel} />
              </FeatModal.Title>
            </FeatModal.Header>
            <FeatModal.Content
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <MOrderInfo data={payment.order} />
              <div style={{ marginTop: 20 }}>
                <div
                  style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}
                >
                  支付方式
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => this.selectPayMethod(PAY_METHOD_WECHAT)}
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: '#f3f3f3',
                    }}
                  >
                    微信
                  </button>
                </div>
              </div>
              {payment.payMethod === PAY_METHOD_WECHAT &&
                this.renderMobileWechatInfo()}
            </FeatModal.Content>
            <FeatModal.Footer>
              <IconButton
                svgIcon="no-btn"
                size="md"
                disabled={payment.isPostingPay}
                onClick={this.exitOrderPayment}
              />
            </FeatModal.Footer>
          </FeatModal.Wrap>
        </FeatModal>
      );
    }

    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.paymentLabel} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <OrderInfo
              data={payment.order}
              payMethodInfo={this.renderPayMethodSelect()}
            />
            {payment.payMethod === PAY_METHOD_WECHAT && this.renderWechatInfo()}
            {payment.payMethod === PAY_METHOD_ALIPAY && this.renderAlipayInfo()}
            {payment.payMethod === PAY_METHOD_UNIONPAY_WTZ &&
              this.renderUnionPayInfo()}
            {payment.isPostingPay && (
              <MaskLoader
                loaderLabel={
                  <TranslatableMessage
                    message={intlMessages.paymentProcessing}
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
              disabled={payment.isPostingPay}
              onClick={this.exitOrderPayment}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              disabled={
                userInfo.isFetchingUserPaymentSettings || payment.isPostingPay
              }
              onClick={this.tryToInitPaymentWithDefaultConfig}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  renderPayMethodPanel() {
    const {
      payment: { isPostingPay, payRequestError },
    } = this.props;

    return (
      <PayMethodPanel
        submitting={isPostingPay}
        payRequestError={payRequestError}
        unionpayQueryOpenStatus={this.unionpayQueryOpenStatus}
        unionpayGetOpenTemplate={this.unionpayGetOpenTemplate}
        unionpaySendConsumeCode={this.unionpaySendConsumeCode}
        onCancel={this.exitConfigPayMethod}
        onConfirm={this.handlePayMethodPanelSubmit}
      />
    );
  }

  renderPaidPanel() {
    const { payment } = this.props;
    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.thanksForOrder} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <OrderBrief className="margin_t_12" data={payment.order} />
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              onClick={this.exitOrderPaymentAndRedirect}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  render() {
    const {
      payment: { step },
    } = this.props;
    switch (step) {
      case PAYMENT_STEP_REVIEW:
        return this.renderReviewPanel();
      case PAYMENT_STEP_SET_PAY_METHOD:
        return this.renderPayMethodPanel();
      case PAYMENT_STEP_PAID:
        return this.renderPaidPanel();
      default:
        return <div>Unkownk Step {step}</div>;
    }
  }
}

const mapStateToProps = createStructuredSelector({
  payment: selectOrderPaymentState,
  userInfo: selectUserCommerceInfo,
  currentUserId: selectCurrentUserId,
});

OrderPayment.propTypes = {
  exitOrderPayment: PropTypes.func,
  selectPayMethod: PropTypes.func,
  selectPayAccount: PropTypes.func,
  postPayRequest: PropTypes.func,
  resetPayMethod: PropTypes.func,
  resetPayRequestError: PropTypes.func,
  setStep: PropTypes.func,
  userInfo: PropTypes.object,
  isMobile: PropTypes.bool,
  payment: PropTypes.shape({
    order: PropTypes.object,
    orderId: PropTypes.number,
  }),
  currentUserId: PropTypes.number,
};

export default withDeviceInfo(
  connect(
    mapStateToProps,
    {
      exitOrderPayment,
      selectPayMethod,
      selectPayAccount,
      postPayRequest,
      resetPayMethod,
      resetPayRequestError,
      setStep,
    },
  )(OrderPayment),
);
