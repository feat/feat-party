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

import './style.scss';

class OrderBrief extends React.PureComponent {
  render() {
    const { className, data } = this.props;

    const {

      sn,
      provider,
      address,
      service_item: serviceItem,
      start_time: startTime,
      end_time: endTime,
    } = data;

    const serviceType = data.service_type || serviceItem.type;

    return (
      <div className={classNames('ft-OrderBrief', className)}>
        <div className='ft-OrderBrief__main'>
          <div className='ft-OrderBrief__row'>
            SN: {sn}
          </div>
          <div className='ft-OrderBrief__row'>
            <Textfit style={{ height: 160 }} className="ft-OrderBrief__title">
              <TranslatableMessage
                message={serviceTypeMessages[serviceType]}
              />
              <br />
              {serviceItem.name}
            </Textfit>
          </div>
          <div className='ft-OrderBrief__row'>
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
          <div className='ft-OrderBrief__row'>
            <NoticeWell>
              <Booking start={startTime} end={endTime} />
            </NoticeWell>
            <div className="ft-OrderBrief__hint margin_t_5">
              <TranslatableMessage message={commerceMessages.localTimeHint} />
            </div>
          </div>
          {address && (
            <div className='ft-OrderBrief__row'>
              <TranslatableMessage
                message={commerceMessages.addressLabel}
              />
              <AddressItem data={address} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

OrderBrief.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
};

export default OrderBrief;
