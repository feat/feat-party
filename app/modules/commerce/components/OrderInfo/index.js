import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Textfit } from 'react-textfit';

import AvatarStamp from '@feat/feat-ui/lib/avatar/AvatarStamp';

import { getAvatar } from '@/utils/user';
import NoticeWell from '@/components/NoticeWell';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import commerceMessages, {
  serviceType as serviceTypeMessages,
} from '../../messages';

import Booking from '../Booking';
import AddressItem from '../AddressItem';
import Temp from './Temp';

import './index.scss';

class OrderInfo extends React.PureComponent {
  render() {
    const { className, data, payMethodInfo } = this.props;

    const {
      provider,
      address,
      service_item: serviceItem,
      start_time: startTime,
      end_time: endTime,
    } = data;

    const serviceType = data.service_type || serviceItem.type;
    // TODO: TextFit + deviceInfo
    return (
      <Temp className={classNames(className)}>
        <Temp.Main>
          <Temp.Left>
            <Temp.Row>
              <Textfit style={{ height: 160 }} className="ft-OrderInfo__title">
                <TranslatableMessage
                  message={serviceTypeMessages[serviceType]}
                />
                <br />
                {serviceItem.name}
              </Textfit>
            </Temp.Row>
            <Temp.Row>
              <NoticeWell>
                <Booking start={startTime} end={endTime} />
              </NoticeWell>
              <div className="ft-OrderInfo__hint margin_t_5">
                <TranslatableMessage message={commerceMessages.localTimeHint} />
              </div>
            </Temp.Row>
            {address && (
              <Temp.Row modifier="address">
                <Temp.Label>
                  <TranslatableMessage
                    message={commerceMessages.addressLabel}
                  />
                </Temp.Label>
                <AddressItem data={address} />
              </Temp.Row>
            )}
          </Temp.Left>
          <Temp.Right>
            <Temp.Row inline>
              <Temp.Label>
                <TranslatableMessage message={commerceMessages.payWith} />
              </Temp.Label>
              <Temp.Content>{payMethodInfo}</Temp.Content>
            </Temp.Row>
            <Temp.Row inline>
              <Temp.Label>
                <TranslatableMessage message={commerceMessages.payThrough} />
              </Temp.Label>
              <Temp.Content>
                <span>Feat Dot Com Technologies</span>
              </Temp.Content>
            </Temp.Row>
            <Temp.Row inline>
              <Temp.Label>
                <TranslatableMessage message={commerceMessages.beneficiary} />
              </Temp.Label>
              <Temp.Content>
                <AvatarStamp
                  username={provider.username || `${provider.uid}`}
                  uiMeta={['expertise']}
                  expertise={provider.expertise}
                  uiExtraMeta={['location']}
                  location={provider.location}
                  avatar={getAvatar(provider, 'md')}
                  type="II"
                />
              </Temp.Content>
            </Temp.Row>
          </Temp.Right>
        </Temp.Main>
        <Temp.Row
          className={classNames('ft-OrderInfo__row_price', {
            'has-address': address,
          })}
        >
          <div className="ft-OrderInfo__notice">
            <TranslatableMessage message={commerceMessages.feeWarning} />
          </div>
          <div className="ft-OrderInfo__priceInfo ft-OrderPriceInfo">
            <div className="ft-OrderPriceInfo__item">
              <div className="ft-OrderPriceInfo__Label">
                <TranslatableMessage
                  message={commerceMessages.serviceFeeLabel}
                />
              </div>
              <div className="ft-OrderPriceInfo__value">
                {data.currency} XXXXXX
              </div>
            </div>
            <div className="ft-OrderPriceInfo__item">
              <div className="ft-OrderPriceInfo__label">
                <TranslatableMessage
                  message={commerceMessages.bankChargeLabel}
                />
              </div>
              <div className="ft-OrderPriceInfo__value">
                {data.currency} XXXXXX
              </div>
            </div>
            <div className="ft-OrderPriceInfo__separator" />
            <div className="ft-OrderPriceInfo__item">
              <div className="ft-OrderPriceInfo__label">
                <TranslatableMessage
                  message={commerceMessages.totalAmountLabel}
                />
              </div>
              <span className="ft-OrderPriceInfo__value">
                {data.currency} {data.total_amount}
              </span>
            </div>
          </div>
        </Temp.Row>
      </Temp>
    );
  }
}

OrderInfo.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  payMethodInfo: PropTypes.node,
};

export default OrderInfo;
