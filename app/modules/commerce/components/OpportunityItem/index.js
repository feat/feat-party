import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { getGeoLatLng } from '@/utils/geo';
import { getUserWorkplaceLatLng } from '@/client/user';

import Button from '@feat/feat-ui/lib/button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ConsultButton from '@/modules/party/containers/ConsultButton';
import AvatarStamp from '@/containers/AvatarStamp';
import Clamp from '@feat/feat-ui/lib/clamp';

import DateCountDown from '../DateCountDown';
import ImagesPreview from '../ImagesPreview';
import MiniDirectionMap from '../MiniDirectionMap';
import OpportunityBidWidget from '../OpportunityBidWidget';

import {
  SERVICE_TYPE_ON_SITE,
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_WORKPLACE,
  DEMAND_STATUS_PUBLISHED,
  DEMAND_STATUS_CLOSED,
  PRICE_UNIT_CASE,
} from '../../constants';

import {
  serviceType as serviceTypeMessages,
  servicePriceUnit as priceUnitMessages,
  demandStatus as demandStatusMessages,
} from '../../messages';
import { demand as demandMessages } from '../../messages/demand';
import { selectUserExpertises } from '../../selectors';
import {
  joinChannel,
  asyncIgnoreDemand,
  asyncAbandonDemand,
  asyncPostBid,
} from '../../actions/opportunity';
import { asyncUserInfoForBidding } from '../../actions/user';

import './style.scss';

class OpportunityItem extends React.Component {
  componentDidMount() {
    const {
      data: { id, status },
    } = this.props;
    if ([DEMAND_STATUS_PUBLISHED, DEMAND_STATUS_CLOSED].indexOf(status) > -1) {
      this.props.joinChannel(id);
    }
    if (!this.props.expertises) {
      this.props.userInfoForBidding();
    }
  }

  handleQuit = () => {
    const { data } = this.props;
    this.props.abandonDemand({ demandId: data.id });
  };

  handleIgnore = () => {
    const { data } = this.props;
    this.props.ignoreDemand({ demandId: data.id });
  };

  renderPlaceInfo() {
    const { data } = this.props;
    if (data.delivery_mode === SERVICE_TYPE_ON_SITE) {
      if (!data.service_address) {
        logging.warn('On-Site demand should have address', data);
        return null;
      }
      return (
        <MiniDirectionMap
          key={data.id}
          className="cm-OpportunityItem__map"
          target={data.service_address}
          asyncOrigin={getGeoLatLng}
          provider={
            data.service_address.country_code === 'CHN' ? 'gaode' : 'google'
          }
        />
      );
    }
    if (data.delivery_mode === SERVICE_TYPE_WORKPLACE) {
      if (!data.geolocation.radius) {
        data.geolocation.radius = 5 * 1000;
      }
      return (
        <MiniDirectionMap
          key={data.id}
          className="cm-OpportunityItem__map"
          origin={data.geolocation}
          asyncTarget={getUserWorkplaceLatLng}
          provider={
            data.geolocation.country_code === 'CHN' ? 'gaode' : 'google'
          }
        />
      );
    }
    if (data.delivery_mode === SERVICE_TYPE_ONLINE) {
      if (!data.geolocation.radius) {
        data.geolocation.radius = 5 * 1000;
      }
      return (
        <MiniDirectionMap
          key={data.id}
          className="cm-OpportunityItem__map"
          provider={
            data.geolocation.country_code === 'CHN' ? 'gaode' : 'google'
          }
          target={data.geolocation}
          hasDirection={false}
        />
      );
    }
    return null;
  }

  renderLeadingBid() {
    const { data } = this.props;
    if (!data.lead_bid) {
      return <TranslatableMessage message={demandMessages.noBidPlaceholder} />;
    }
    return (
      <span>
        {data.lead_bid} /
        <TranslatableMessage
          message={priceUnitMessages[data.price_unit || PRICE_UNIT_CASE]}
        />
      </span>
    );
  }

  renderUserBid() {
    const { data } = this.props;
    if (!data.last_bid) {
      return <TranslatableMessage message={demandMessages.noBidPlaceholder} />;
    }
    return (
      <span>
        {data.last_bid} /
        <TranslatableMessage
          message={priceUnitMessages[data.price_unit || PRICE_UNIT_CASE]}
        />
      </span>
    );
  }

  handleBid = (data) => this.props.postBid(data);

  renderStatusLabel() {
    const {
      data: { status },
    } = this.props;
    return (
      <span>
        <TranslatableMessage message={demandStatusMessages[status]} />
      </span>
    );
  }

  renderFooter() {
    const { data, meta = {} } = this.props;
    if (data.hasAbandoned) {
      return <div className="cm-OpportunityItem__actions">Abandon Stamp</div>;
    }
    if (data.hasIgnored) {
      return <div className="cm-OpportunityItem__actions">Ignored</div>;
    }
    return (
      <div className="cm-OpportunityItem__actions">
        {data.last_bid &&
          data.status === DEMAND_STATUS_PUBLISHED && (
          <Button onClick={this.handleQuit} disabled={meta.isAbandoning}>
            <TranslatableMessage message={demandMessages.quitBiddingLabel} />
          </Button>
        )}
        {!data.last_bid &&
          data.status === DEMAND_STATUS_PUBLISHED && (
          <Button onClick={this.handleIgnore} disabled={meta.isIgnoring}>
            <TranslatableMessage message={demandMessages.ignoreLabel} />
          </Button>
        )}
        {data.status !== DEMAND_STATUS_PUBLISHED && this.renderStatusLabel()}
      </div>
    );
  }

  render() {
    const { data, expertises } = this.props;
    const { owner = {}, is_winner } = data;
    return (
      <div
        className={classNames('cm-OpportunityItem', {
          'has-abandoned': data.hasAbandoned,
          'has-ignored': data.hasIgnored,
        })}
      >
        <div className="cm-OpportunityItem__main">
          <div className="cm-OpportunityItem__info">
            <h2 className="cm-OpportunityItem__title">
              <Clamp lines={2} ellipsis>
                {data.title}
              </Clamp>
            </h2>
            <div className="cm-OpportunityItem__fields">
              <div className="cm-OpportunityItem__field">
                <span className="cm-OpportunityItem__fieldLabel">
                  <TranslatableMessage
                    message={demandMessages.deliveryModeLabel}
                  />
                </span>
                <span className="cm-OpportunityItem__fieldValue">
                  <TranslatableMessage
                    message={serviceTypeMessages[data.delivery_mode]}
                  />
                </span>
              </div>
              <div className="cm-OpportunityItem__field">
                <span className="cm-OpportunityItem__fieldLabel">
                  <TranslatableMessage
                    message={demandMessages.requiredDateLabel}
                  />
                </span>
                <span className="cm-OpportunityItem__fieldValue">
                  {moment(data.start_time).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
              {data.service_address && (
                <div className="cm-OpportunityItem__field">
                  <span className="cm-OpportunityItem__fieldLabel">
                    <TranslatableMessage
                      message={demandMessages.addressLabel}
                    />
                  </span>
                  <span className="cm-OpportunityItem__fieldValue">
                    {data.service_address.formatted}
                  </span>
                </div>
              )}
            </div>
            <div className="cm-OpportunityItem__publisher">
              <AvatarStamp
                avatar={owner.avatar}
                username={owner.username || `${owner.uid}`}
                uid={owner.uid}
                expertise={owner.expertise}
                location={data.user_location}
                uiExtraMeta={['location', 'contactBtn']}
                contactBtn={<ConsultButton user={owner} label="@" size="xs" />}
              />
            </div>
            <div className="cm-OpportunityItem__desc">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
            <div className="cm-OpportunityItem__images">
              <ImagesPreview data={data.attachments} />
            </div>
          </div>
          <div className="cm-OpportunityItem__biddingInfo">
            <div className="cm-OpportunityItem__col cm-OpportunityItem__col_place">
              <div className="cm-OpportunityItem__colHeader">
                <TranslatableMessage
                  message={demandMessages.demandTransactionLabel}
                />
              </div>
              <div className="cm-OpportunityItem__colContent">
                {this.renderPlaceInfo()}
              </div>
            </div>
            <div className="cm-OpportunityItem__col cm-OpportunityItem__col_party">
              <div className="cm-OpportunityItem__colHeader">
                <TranslatableMessage
                  message={demandMessages.demandStatusLabel}
                />
              </div>
              <div className="cm-OpportunityItem__colContent">
                <div className="cm-OpportunityItem__field">
                  <span className="cm-OpportunityItem__fieldLabel">
                    <TranslatableMessage
                      message={demandMessages.closeDateLabel}
                    />
                  </span>
                  <span className="cm-OpportunityItem__fieldValue">
                    {moment(data.closed_time).format('YYYY-MM-DD HH:mm')}
                  </span>
                </div>
                <div className="cm-OpportunityItem__field cm-OpportunityItem__field_remain">
                  <span className="cm-OpportunityItem__fieldLabel">
                    <TranslatableMessage
                      message={demandMessages.timeRemainLabel}
                    />
                  </span>
                  <span className="cm-OpportunityItem__fieldValue">
                    {data.status === DEMAND_STATUS_PUBLISHED ? (
                      <DateCountDown
                        stop={new Date(data.closed_time)}
                        onStop={this.checkOpportunityStatus}
                      />
                    ) : (
                      <span />
                    )}
                  </span>
                </div>

                <div className="cm-OpportunityItem__field">
                  <span className="cm-OpportunityItem__fieldLabel">
                    <TranslatableMessage
                      message={demandMessages.leadingBidLabel}
                    />
                  </span>
                  <span className="cm-OpportunityItem__fieldValue">
                    {this.renderLeadingBid()}
                  </span>
                </div>
                <div className="cm-OpportunityItem__field">
                  <span className="cm-OpportunityItem__fieldLabel">
                    <TranslatableMessage
                      message={demandMessages.currentBidLabel}
                    />
                  </span>
                  <span className="cm-OpportunityItem__fieldValue">
                    {this.renderUserBid()}
                  </span>
                </div>
                {/* result */}
                {is_winner && (
                  <div className="cm-OpportunityItem__field">
                    <span className="cm-OpportunityItem__fieldLabel">
                      <TranslatableMessage
                        message={demandMessages.whetherToWin}
                      />
                    </span>
                    <span className="cm-OpportunityItem__fieldValue">
                      <TranslatableMessage
                        message={demandMessages.winningBid}
                      />
                    </span>
                  </div>
                )}
                {!is_winner &&
                  is_winner !== null && (
                  <div className="cm-OpportunityItem__field">
                    <span className="cm-OpportunityItem__fieldLabel">
                      <TranslatableMessage
                        message={demandMessages.whetherToWin}
                      />
                    </span>
                    <span className="cm-OpportunityItem__fieldValue">
                      <TranslatableMessage
                        message={demandMessages.losingBid}
                      />
                    </span>
                  </div>
                )}
                {data.status === DEMAND_STATUS_PUBLISHED &&
                  !data.hasAbandoned &&
                  expertises && (
                  <div className="cm-OpportunityItem__field">
                    <OpportunityBidWidget
                      lastBid={data.last_bid}
                      leadingBid={data.leading_bid}
                      matchedExpertises={data.match_expertises}
                      expertises={expertises}
                      demandId={data.id}
                      onSubmit={this.handleBid}
                    />
                  </div>
                )}
              </div>
              {this.renderFooter()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OpportunityItem.propTypes = {
  data: PropTypes.object,
  meta: PropTypes.object,
  postBid: PropTypes.func, // promise
  abandonDemand: PropTypes.func,
  ignoreDemand: PropTypes.func,
  joinChannel: PropTypes.func,
  expertises: PropTypes.array,
  userInfoForBidding: PropTypes.func,
};
export default connect(
  selectUserExpertises,
  {
    joinChannel,
    ignoreDemand: asyncIgnoreDemand,
    abandonDemand: asyncAbandonDemand,
    postBid: asyncPostBid,
    userInfoForBidding: asyncUserInfoForBidding,
  },
)(OpportunityItem);
