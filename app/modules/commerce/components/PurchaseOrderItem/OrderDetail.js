import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import moment from 'moment';

import { getAvatar } from '@/utils/user';
import { formatTimezone } from '@/utils/time';

import AvatarStamp from '@/containers/AvatarStamp';
import Button from '@feat/feat-ui/lib/button/Button';
import LiveClock from '@/components/LiveClock';

import ConsultButton from '@/modules/party/containers/ConsultButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import {
  ORDER_STATUS_CREATED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_TO_START,
  ORDER_STATUS_FOR_CONSUMER_TO_START,
  ORDER_STATUS_ON_AIR,
  ORDER_STATUS_FINISHED,
  ORDER_STATUS_WAITING_FOR_REFUND,
} from '../../constants';

import intlMessages, {
  serviceType as serviceTypeMessages,
  orderStatus as orderStatusMessages,
  orderAction as orderActionMessages,
} from '../../messages';

import OrderTransactionHistory from '../OrderTransactionHistory';

class PurchaseOrderDetail extends Component {
  handlePay = () => {
    const { data } = this.props;
    this.props.initPayment({
      orderId: data.id,
      data,
      trigger: 'payment',
    });
  };

  handleCancel = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'cancel',
      },
    });
  };

  handleStart = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'start',
      },
    });
  };

  handleConfirmStart = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'confirm-start',
      },
    });
  };

  handleConfirmFinished = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'fund',
      },
    });
  };

  handleRefund = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'refund',
      },
    });
  };

  handleCancelRefund = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'cancel-refund',
      },
    });
  };

  renderFooter() {
    const { data } = this.props;

    switch (data.status) {
      case ORDER_STATUS_CREATED:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleCancel}
            >
              <TranslatableMessage message={orderActionMessages.cancel} />
            </Button>
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handlePay}
            >
              <TranslatableMessage message={orderActionMessages.pay} />
            </Button>
          </div>
        );

      case ORDER_STATUS_PAID:
      case ORDER_STATUS_CONFIRMED:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleCancel}
            >
              <TranslatableMessage message={orderActionMessages.cancel} />
            </Button>
          </div>
        );
      case ORDER_STATUS_TO_START:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleStart}
            >
              <TranslatableMessage message={orderActionMessages.start} />
            </Button>
          </div>
        );
      case ORDER_STATUS_FOR_CONSUMER_TO_START:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleConfirmStart}
            >
              <TranslatableMessage message={orderActionMessages.start} />
            </Button>
          </div>
        );
      case ORDER_STATUS_ON_AIR:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleRefund}
            >
              <TranslatableMessage message={orderActionMessages.refund} />
            </Button>
          </div>
        );
      case ORDER_STATUS_FINISHED:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleConfirmFinished}
            >
              <TranslatableMessage
                message={orderActionMessages.confirmFinished}
              />
            </Button>
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleRefund}
            >
              <TranslatableMessage message={orderActionMessages.refund} />
            </Button>
          </div>
        );
      case ORDER_STATUS_WAITING_FOR_REFUND:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <Button
              className="cm-PurchaseOrderDetail__action"
              onClick={this.handleCancelRefund}
            >
              <TranslatableMessage message={orderActionMessages.cancelRefund} />
            </Button>
          </div>
        );
      default:
        return (
          <div className="cm-PurchaseOrderDetail__footer padding_x_12">
            <TranslatableMessage message={orderStatusMessages[data.status]} />
          </div>
        );
    }
  }

  renderPaymentInfo() {
    const {
      data: { payments },
    } = this.props;
    if (!payments || !payments.length) {
      return <TranslatableMessage message={intlMessages.emptyRecordHint} />;
    }
    return null;
  }

  render() {
    const { data } = this.props;
    const serviceType = data.service_type || data.service_item.type;
    return (
      <div className="cm-PurchaseOrderDetail">
        <div className="cm-PurchaseOrderDetail__main padding_x_12">
          <div className="cm-PurchaseOrderDetail__transactionHistory">
            <OrderTransactionHistory data={data.logs} />
          </div>
          <div className="cm-PurchaseOrderDetail__keyInfo od-KeyInfo">
            <div className="cm-PurchaseOrderDetail__info cm-PurchaseOrderDetail__info_user">
              <span className="cm-PurchaseOrderDetail__label">
                <TranslatableMessage message={intlMessages.providerLabel} />
              </span>
              <span>
                <AvatarStamp
                  uid={data.provider.uid}
                  avatar={getAvatar(data.provider, 'md')}
                  username={data.provider.username || `${data.provider.uid}`}
                  expertise={data.provider.expertise}
                  uiExtraMeta={['contactBtn', 'location', 'localTime']}
                  location={data.provider.location}
                  localTime={
                    <LiveClock
                      timezone={formatTimezone(
                        data.provider.timezone_utc_offset,
                      )}
                      ticking
                    />
                  }
                  contactBtn={
                    <ConsultButton user={data.provider} label="@" size="xs" />
                  }
                />
              </span>
            </div>
            <div className="cm-PurchaseOrderDetail__info">
              <span className="cm-PurchaseOrderDetail__label">
                <TranslatableMessage message={intlMessages.serviceTypeLabel} />
              </span>
              <span>
                <TranslatableMessage
                  message={serviceTypeMessages[serviceType]}
                />
              </span>
            </div>
            {data.address && (
              <div className="cm-PurchaseOrderDetail__info">
                <span className="cm-PurchaseOrderDetail__label">
                  <TranslatableMessage message={intlMessages.addressLabel} />
                </span>
                <span className="cm-PurchaseOrderDetail__address">
                  {data.address.formatted}
                </span>
              </div>
            )}
            <div className="cm-PurchaseOrderDetail__info">
              <span className="cm-PurchaseOrderDetail__label">P.O.Nos</span>
              {this.renderPaymentInfo()}
            </div>
          </div>
          <div className="cm-PurchaseOrderDetail__priceInfo od-PriceInfo">
            {/* <div className="od-PriceInfo__feeItem"> */}
            {/* <span className="od-PriceInfo__label">Feat Intermediary Fee</span> */}
            {/* <span className="od-PriceInfo__price">00.00</span> */}
            {/* </div> */}
            {/* <div className="od-PriceInfo__feeItem"> */}
            {/* <span className="od-PriceInfo__label">Local bank’s Fee</span> */}
            {/* <span className="od-PriceInfo__price">1.45</span> */}
            {/* </div> */}
            {/* <div className="od-PriceInfo__feeItem od-PriceInfo__feeItem_total"> */}
            {/* <span className="od-PriceInfo__label">Total Charge</span> */}
            {/* <span className="od-PriceInfo__price">{data.total_amount}</span> */}
            {/* </div> */}
          </div>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

PurchaseOrderDetail.propTypes = {
  data: PropTypes.object,
  initPayment: PropTypes.func.isRequired,
  applyTransition: PropTypes.func.isRequired,
};

export default PurchaseOrderDetail;
