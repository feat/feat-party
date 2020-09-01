import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getAvatar } from '@/utils/user';
import { formatTimezone } from '@/utils/time';

import Button from '@feat/feat-ui/lib/button/Button';
import LiveClock from '@/components/LiveClock';
import AvatarStamp from '@/containers/AvatarStamp';
import ConsultButton from '@/modules/party/containers/ConsultButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import OrderTransactionHistory from '../OrderTransactionHistory';

import {
  ORDER_STATUS_PAID,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_TO_START,
  ORDER_STATUS_WAITING_FOR_REFUND,
  ORDER_STATUS_FOR_PROVIDER_TO_START,
} from '../../constants';

import intlMessages, {
  serviceType as serviceTypeMessages,
  orderStatus as orderStatusMessages,
  orderAction as orderActionMessages,
} from '../../messages';

class SalesOrderDetail extends Component {
  handleAccept = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'accept',
      },
    });
  };

  handleReject = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'reject',
      },
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

  handleAcceptRefund = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'confirm-refund',
      },
    });
  };

  handleRejectRefund = () => {
    const { data } = this.props;
    this.props.applyTransition({
      orderId: data.id,
      data: {
        action: 'reject-refund',
      },
    });
  };

  renderFooter() {
    const { data } = this.props;
    switch (data.status) {
      case ORDER_STATUS_PAID:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleAccept}
            >
              <TranslatableMessage message={orderActionMessages.accept} />
            </Button>
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleReject}
            >
              <TranslatableMessage message={orderActionMessages.reject} />
            </Button>
          </div>
        );
      case ORDER_STATUS_CONFIRMED:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleCancel}
            >
              <TranslatableMessage message={orderActionMessages.cancel} />
            </Button>
          </div>
        );
      case ORDER_STATUS_TO_START:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleStart}
            >
              <TranslatableMessage message={orderActionMessages.start} />
            </Button>
          </div>
        );
      case ORDER_STATUS_FOR_PROVIDER_TO_START:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleConfirmStart}
            >
              <TranslatableMessage message={orderActionMessages.confirmStart} />
            </Button>
          </div>
        );
      case ORDER_STATUS_WAITING_FOR_REFUND:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleAcceptRefund}
            >
              <TranslatableMessage
                message={orderActionMessages.agreeToRefund}
              />
            </Button>
            <Button
              className="cm-SalesOrderDetail__action"
              onClick={this.handleRejectRefund}
            >
              <TranslatableMessage
                message={orderActionMessages.rejectToRefund}
              />
            </Button>
          </div>
        );
      default:
        return (
          <div className="cm-SalesOrderDetail__footer padding_x_12">
            <TranslatableMessage message={orderStatusMessages[data.status]} />
          </div>
        );
    }
  }

  render() {
    const { data } = this.props;
    const serviceType = data.service_type || data.service_item.type;
    return (
      <div className="cm-SalesOrderDetail">
        <div className="cm-SalesOrderDetail__main padding_x_12">
          <div className="cm-SalesOrderDetail__transactionHistory">
            <OrderTransactionHistory data={data.logs} />
          </div>
          <div className="cm-SalesOrderDetail__keyInfo">
            <div className="cm-SalesOrderDetail__info cm-SalesOrderDetail__info_user">
              <span className="cm-SalesOrderDetail__label">
                <TranslatableMessage message={intlMessages.buyerLabel} />
              </span>
              <span>
                <AvatarStamp
                  uid={data.consumer.uid}
                  avatar={getAvatar(data.consumer, 'md')}
                  username={data.consumer.username}
                  uiExtraMeta={['contactBtn', 'location', 'localTime']}
                  expertise={data.consumer.expertise}
                  location={data.consumer.location}
                  localTime={
                    <LiveClock
                      timezone={formatTimezone(
                        data.consumer.timezone_utc_offset,
                      )}
                      ticking
                    />
                  }
                  contactBtn={
                    <ConsultButton user={data.consumer} label="@" size="xs" />
                  }
                />
              </span>
            </div>
            <div className="cm-SalesOrderDetail__info">
              <span className="cm-SalesOrderDetail__label">
                <TranslatableMessage message={intlMessages.serviceTypeLabel} />
              </span>
              <span>
                <TranslatableMessage
                  message={serviceTypeMessages[serviceType]}
                />
              </span>
            </div>
            {data.address && (
              <div className="cm-SalesOrderDetail__info">
                <span className="cm-SalesOrderDetail__label">
                  <TranslatableMessage message={intlMessages.addressLabel} />
                </span>
                <span className="cm-SalesOrderDetail__address">
                  {data.address.formatted}
                </span>
              </div>
            )}
            <div className="cm-SalesOrderDetail__info">
              <span className="cm-SalesOrderDetail__label">P.O.Nos</span>
            </div>
          </div>
          <div className="cm-SalesOrderDetail__priceInfo od-PriceInfo">
            {/* <div className="od-PriceInfo__feeItem">
              <span className="od-PriceInfo__label">Feat Intermediary Fee</span>
              <span className="od-PriceInfo__price">00.00</span>
            </div>
            <div className="od-PriceInfo__feeItem">
              <span className="od-PriceInfo__label">Local bank’s Fee</span>
              <span className="od-PriceInfo__price">1.45</span>
            </div> */}
            {/* <div className="od-PriceInfo__feeItem od-PriceInfo__feeItem_total">
              <span className="od-PriceInfo__label">Total Charge</span>
              <span className="od-PriceInfo__price">{data.totalAmount}</span>
            </div> */}
          </div>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

SalesOrderDetail.propTypes = {
  data: PropTypes.object,
  applyTransition: PropTypes.func.isRequired,
};

export default SalesOrderDetail;
