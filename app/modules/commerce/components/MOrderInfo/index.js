import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { Textfit } from 'react-textfit';

import AvatarStamp from '@feat/feat-ui/lib/avatar/AvatarStamp';

import { getAvatar } from '@/utils/user';
import NoticeWell from '@/components/NoticeWell';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import commerceMessages, {
  serviceType as serviceTypeMessages,
} from '../../messages';

import Booking from '../Booking';
import AddressItem from '../AddressItem';

import './style.scss';

class OrderInfo extends React.PureComponent {
  render() {
    const { className, data } = this.props;

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
      <div className={classNames(className, 'MOrderInfo')}>
        <div className="MOrderInfo__field MOrderInfo__title">
          [<TranslatableMessage message={serviceTypeMessages[serviceType]} />]
          {serviceItem.name}
        </div>
        <div className="MOrderInfo__field MOrderInfo__field_date">
          <NoticeWell>
            <Booking start={startTime} end={endTime} />
          </NoticeWell>
          <div className="MOrderInfo__meta">
            <TranslatableMessage message={commerceMessages.localTimeHint} />
          </div>
        </div>
        {address && (
          <div className="MOrderInfo__field">
            <div>
              <TranslatableMessage message={commerceMessages.addressLabel} />
            </div>
            <AddressItem data={address} />
          </div>
        )}
        <div className="MOrderInfo__separator" />
        <div className="MOrderInfo__field MOrderInfo__field_inline">
          <div style={{ flexBasis: '40%' }}>
            <TranslatableMessage message={commerceMessages.beneficiary} />
          </div>
          <div>
            <AvatarStamp
              username={provider.username || `${provider.uid}`}
              uiMeta={['expertise']}
              expertise={provider.expertise}
              uiExtraMeta={['location']}
              location={provider.location}
              avatar={getAvatar(provider, 'md')}
              type="II"
            />
          </div>
        </div>
        <div className="MOrderInfo__separator" />
        <div className="MOrderInfo__priceInfo">
          <div className="MOrderInfo__priceItem">
            <div className="MOrderInfo__priceItemLabel">
              <TranslatableMessage message={commerceMessages.serviceFeeLabel} />
            </div>
            <div className="MOrderInfo__priceItemValue">
              {data.currency} XXXXXX
            </div>
          </div>
          <div className="MOrderInfo__priceItem">
            <div className="MOrderInfo__priceItemLabel">
              <TranslatableMessage message={commerceMessages.bankChargeLabel} />
            </div>
            <div className="MOrderInfo__priceItemValue">
              {data.currency} XXXXXX
            </div>
          </div>
          <div className="MOrderInfo__priceSeparator" />
          <div className="MOrderInfo__priceItem">
            <div className="MOrderInfo__priceItemLabel">
              <TranslatableMessage
                message={commerceMessages.totalAmountLabel}
              />
            </div>
            <span className="MOrderInfo__priceItemValue">
              {data.currency} {data.total_amount}
            </span>
          </div>
        </div>
        <div className="MOrderInfo__notice">
          <TranslatableMessage message={commerceMessages.feeWarning} />
        </div>
      </div>
    );
  }
}

OrderInfo.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  // payMethodInfo: PropTypes.node,
};

export default OrderInfo;
