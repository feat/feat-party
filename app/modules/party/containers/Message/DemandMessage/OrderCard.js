import React from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';
import { formatDate } from '@/utils/time';

import { messages as partyMessages } from '../../../messages';
import './style.scss';

function OrderCard(props) {
  const { title, startTime, endTime, provider, consumer, role, sn } = props;
  return (
    <div className="IM-OrderCard">
      <div className="IM-OrderCard__header">
        {title}
        {role === 'provider' &&
          <svg
            className="IM-OrderCard__provider_icon"
            style={{ width: "0.9em", height: "0.9em", verticalAlign: "middle", fill: "currentColor", overflow: "hidden" }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M372.363467 302.545782C372.363467 366.638844 320.092945 418.909366 255.999884 418.909366A116.596311 116.596311 0 0 1 139.6363 302.545782C139.6363 238.452721 191.906822 186.182199 255.999884 186.182199S372.363467 238.452721 372.363467 302.545782z m-77.637783 0a38.725801 38.725801 0 1 0-77.451601 0 38.725801 38.725801 0 0 0 77.451601 0zM631.01644 136.93713l357.003475 363.333654A122.879944 122.879944 0 0 1 1023.999535 588.148562c0 33.512712-12.986176 65.210152-35.560712 87.086506l-323.770034 316.043492c-44.823252 43.566526-130.141032 43.752707-175.197011-0.186181l-402.385272-394.472548C17.73381 529.035861 0 502.03951 0 410.438097v-173.614466C0 73.123341 33.233439 0.000465 229.980986 0.000465H392.378003c99.8865-0.186182 158.068292 57.343974 238.638437 136.936665z m-21.224717 797.602547l323.770034-315.857311c7.447269-7.261088 11.636358-18.292355 11.636359-30.533804a43.426889 43.426889 0 0 0-12.799994-31.930168l-323.956217-330.798395-32.861076-32.116349c-80.197782-79.406509-118.504673-114.501766-183.389007-114.501766H229.794805c-140.939572 0-151.179568 21.876354-151.179568 157.835565v173.614466c0 62.417426 1.768726 69.911241 63.301789 129.629032l402.431817 394.705275c7.866178 7.633451 19.642173 11.962176 32.581804 11.962177 13.032721 0 24.994898-4.328725 32.861076-12.008722z" p-id="2413"></path>
          </svg>}
      </div>
      <div className="IM-OrderCard__info">
        <div className="IM-OrderCard__sn">{sn}</div>
        {/* {role === 'provider' && (
          <div className="IM-OrderCard__provider">{provider}</div>
        )}
        {role === 'consumer' && (
          <div className="IM-OrderCard__consumer">{consumer}</div>
        )} */}
        <div className="IM-OrderCard__user">
          <span className="IM-OrderCard__user_label">{formatMessage(partyMessages.provider)}</span>
          {provider}
        </div>
        <div className="IM-OrderCard__user">
          <span className="IM-OrderCard__user_label">{formatMessage(partyMessages.consumer)}</span>
          {consumer}
        </div>
      </div>
      <div className="IM-OrderCard__time">
        {formatDate(startTime)} -- {formatDate(endTime)}
      </div>
      <div className="IM-OrderCard__footer" />
    </div>
  );
}

OrderCard.propTypes = {
  sn: PropTypes.string,
  title: PropTypes.node,
  role: PropTypes.oneOf(['provider', 'consumer']),
  startTime: PropTypes.node,
  endTime: PropTypes.node,
  provider: PropTypes.node,
  consumer: PropTypes.node,
};

export default OrderCard;
