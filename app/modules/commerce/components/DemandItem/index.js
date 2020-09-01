import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Textfit } from 'react-textfit';
import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';
import Modal from '@feat/feat-ui/lib/modal';
import Loader from '@feat/feat-ui/lib/loader';

import ConsultButton from '@/modules/party/containers/ConsultButton';

import AvatarStamp from '@/containers/AvatarStamp';
import LiveClock from '@/components/LiveClock';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import DateCountDown from '../DateCountDown';
import ImagesPreview from '../ImagesPreview';

import {
  // DEMAND_STATUS_DRAFT,
  DEMAND_STATUS_PUBLISHED,
  // DEMAND_STATUS_CLOSED,
  // DEMAND_STATUS_PROVIDER_SELECTED,
  SERVICE_TYPE_WORKPLACE,
  PRICE_UNIT_CASE,
  DEMAND_STATUS_CLOSED,
  DEMAND_STATUS_CANCELED,
} from '../../constants';

import {
  servicePriceUnit as servicePriceUnitMessages,
  serviceType as serviceTypeMessages,
  demandStatus as demandStatusMessages,
} from '../../messages';
import { demand as demandMessages } from '../../messages/demand';
import intlMessages from './messages';
import { 
  joinChannel, 
  asyncCloseDemand, 
  asyncCancelDemand, 
  asyncBlackUser, 
  asyncGetDemandBids,
  asyncSelectWinner,
} from '../../actions/demand'

import './style.scss';

class DemandItem extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const {
      data: { id, activeBids, status },
    } = this.props;
    if (!activeBids) {
      this.props.getDemandBids({
        demandId: id,
      });
    }
    // can join
    if ([DEMAND_STATUS_PUBLISHED, DEMAND_STATUS_CLOSED].indexOf(status) > -1) {
      this.props.joinChannel(id);
    }
  }

  handleCancelDemand = () => {
    const {
      data: { id },
    } = this.props;
    this.props.cancelDemand({ demandId: id });
  };

  handleCloseDemand = () => {
    const {
      data: { id },
    } = this.props;
    this.props.closeDemand({ demandId: id });
  };

  handleSelectWinner = (item) => {
    const {
      data: { id, status },
    } = this.props;
    if (status !== DEMAND_STATUS_CLOSED) {
      Modal.confirm({
        title: formatMessage(intlMessages.closeConfirmTitle),
        content: formatMessage(intlMessages.closeConfirmContent),
        onCancel: () => {},
        onConfirm: () => {
          this.props.selectWinner({
            demandId: id,
            demandStatus: status,
            data: item,
          });
        },
      });
    } else {
      this.props.selectWinner({
        demandId: id,
        demandStatus: status,
        data: { user: item.user },
      });
    }
  };

  handleBlackUser = (item) => {
    const {
      data: { id },
    } = this.props;
    this.props.blackUser({ demandId: id, data: { user: item.user } });
  };

  render() {
    const { data, closeDemandSubmitting } = this.props;
    const { activeBids } = data;
    const metaArray = data.winner
      ? ['expertise', 'winnerTag']
      : ['expertise', 'winnerBtn'];
    return (
      <div
        className={classNames('cm-DemandItem', {
          'has-canceled': data.status === DEMAND_STATUS_CANCELED,
        })}
      >
        <div className="cm-DemandItem__main">
          <div className="cm-DemandItem__info">
            <h2 className="cm-DemandItem__title">
              <Textfit style={{ height: 48 }}>{data.title}</Textfit>
            </h2>
            <div className="cm-DemandItem__fields">
              <div className="cm-DemandItem__field cm-DemandItem__field_date">
                <span className="cm-DemandItem__fieldLabel">
                  {formatMessage(demandMessages.deliveryModeLabel)}
                </span>
                <span className={classNames('cm-DemandItem__fieldValue')}>
                  {formatMessage(serviceTypeMessages[data.delivery_mode])}
                </span>
              </div>
              <div className="cm-DemandItem__field cm-DemandItem__field_delivery">
                <span className="cm-DemandItem__fieldLabel">
                  {formatMessage(demandMessages.requiredDateLabel)}
                </span>
                <span className="cm-DemandItem__fieldValue">
                  {moment(data.start_time).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              {data.service_address && (
                <div className="cm-DemandItem__field cm-DemandItem__field_address">
                  <span className="cm-DemandItem__fieldLabel">
                    {formatMessage(demandMessages.addressLabel)}
                  </span>
                  <span className="cm-DemandItem__fieldValue">
                    {data.service_address.formatted}
                  </span>
                </div>
              )}
            </div>
            <div className="cm-DemandItem__content">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
            <div className="cm-DemandItem__images">
              <ImagesPreview data={data.attachments} />
            </div>
          </div>
          <div className="cm-DemandItem__biddingInfo">
            <div className="cm-DemandBiddings">
              <div className="cm-DemandBiddings__header">
                <div className="cm-DemandBiddings__cell cm-DemandBiddings__cell_user">
                  {formatMessage(demandMessages.participantLabel)}
                </div>
                <div className="cm-DemandBiddings__cell cm-DemandBiddings__cell_locale">
                  {formatMessage(demandMessages.locationLabel)}
                </div>
                <div className="cm-DemandBiddings__cell cm-DemandBiddings__cell_price">
                  {formatMessage(demandMessages.costLabel)}
                </div>
              </div>
              {activeBids &&
                activeBids.map((item, index) => (
                  <div
                    className={classNames('cm-DemandBiddingRecord', {
                      'has-quit': item.hasQuit,
                    })}
                    key={item.id || item.user.uid}
                  >
                    <div className="cm-DemandBiddingRecord__cell cm-DemandBiddingRecord__cell_no">
                      {index + 1}
                    </div>
                    <div className="cm-DemandBiddingRecord__cell cm-DemandBiddingRecord__cell_user">
                      <AvatarStamp
                        archived={data.status !== DEMAND_STATUS_PUBLISHED}
                        avatar={item.user.avatar}
                        username={item.user.username}
                        uid={item.user.uid}
                        expertise={item.user.expertise}
                        uiMeta={metaArray}
                        uiExtraMeta={['contactBtn']}
                        winnerTag={
                          data.winner &&
                          item.user.uid === data.winner.uid && (
                            <span className="cm-DemandBiddingRecord__winnerTag">
                              {formatMessage(intlMessages.winnerLabel)}
                            </span>
                          )
                        }
                        winnerBtn={
                          !item.hasQuit &&
                          data.status !== DEMAND_STATUS_CANCELED && (
                            <Button
                              size="xs"
                              onClick={() => {
                                this.handleSelectWinner(item);
                              }}
                            >
                              {formatMessage(intlMessages.selectWinnerLabel)}
                            </Button>
                          )
                        }
                        blackBtn={
                          !item.hasQuit && (
                            <Button
                              size="xs"
                              onClick={() => {
                                this.handleBlackUser(item);
                              }}
                            >
                              {formatMessage(intlMessages.blackUserLabel)}
                            </Button>
                          )
                        }
                        contactBtn={
                          <ConsultButton user={item.user} label="@" size="xs" />
                        }
                      />
                    </div>
                    <div className="cm-DemandBiddingRecord__cell cm-DemandBiddingRecord__cell_locale">
                      <span
                        title={
                          data.delivery_mode === SERVICE_TYPE_WORKPLACE
                            ? `${item.workplace.formatted}`
                            : `${item.user_location}`
                        }
                        className="cm-DemandBiddingRecord__userLocation"
                      >
                        {data.delivery_mode === SERVICE_TYPE_WORKPLACE
                          ? `${item.workplace.formatted}`
                          : `${item.user.location || ''}`}
                      </span>
                      <LiveClock
                        className="cm-DemandBiddingRecord__liveClock"
                        timezone={item.user.timezone}
                        ticking
                      />
                    </div>
                    <div className="cm-DemandBiddingRecord__cell cm-DemandBiddingRecord__cell_price">
                      {`${item.current_bid}/${formatMessage(
                        servicePriceUnitMessages[PRICE_UNIT_CASE],
                      )}`}
                    </div>
                  </div>
                ))}
            </div>
            <div className="cm-DemandItem__statusInfo">
              <div className="cm-DemandItem__status">
                <div className="cm-DemandItem__field">
                  <span className="cm-DemandItem__fieldLabel">
                    {formatMessage(demandMessages.statusLabel)}
                  </span>
                  <span className={classNames('cm-DemandItem__subContent')}>
                    <TranslatableMessage
                      message={demandStatusMessages[data.status]}
                    />
                  </span>
                </div>
                {data.status === DEMAND_STATUS_PUBLISHED && (
                  <div className="cm-DemandItem__field">
                    <span className="cm-DemandItem__fieldLabel">
                      {formatMessage(demandMessages.timeRemainLabel)}
                    </span>
                    <span className={classNames('cm-DemandItem__fieldValue')}>
                      <DateCountDown stop={new Date(data.closed_time)} />
                    </span>
                  </div>
                )}
              </div>
              <div className="cm-DemandItem__actions">
                {data.status === DEMAND_STATUS_PUBLISHED &&
                  data.activeBids &&
                  data.activeBids.length === 0 && (
                  <Button onClick={this.handleCancelDemand}>
                    {formatMessage(intlMessages.cancelLabel)}
                  </Button>
                )}
                {data.status === DEMAND_STATUS_PUBLISHED &&
                  data.activeBids &&
                  data.activeBids.length !== 0 && (
                  <Button onClick={this.handleCloseDemand}>
                    {formatMessage(intlMessages.closeLabel)}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {data.status === DEMAND_STATUS_PUBLISHED &&
          closeDemandSubmitting &&
          this.state.loading && (
          <div className="cm-DemandItem__closeLoading">
            <Loader size="lg" />
          </div>
        )}
      </div>
    );
  }
}

DemandItem.propTypes = {
  closeDemandSubmitting: PropTypes.bool,
  data: PropTypes.object,
  getDemandBids: PropTypes.func,
  joinChannel: PropTypes.func,
  closeDemand: PropTypes.func,
  cancelDemand: PropTypes.func,
  selectWinner: PropTypes.func,
  blackUser: PropTypes.func,
};

export default connect(null, {
  joinChannel,
  getDemandBids: asyncGetDemandBids,
  closeDemand: asyncCloseDemand,
  cancelDemand: asyncCancelDemand,
  selectWinner: asyncSelectWinner,
  blackUser: asyncBlackUser,
})(DemandItem);
