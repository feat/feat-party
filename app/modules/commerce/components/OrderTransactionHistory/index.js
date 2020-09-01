import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatDate } from '@/utils/time';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from '../../messages';
import { getOrderLogMessage } from '../../utils';

import './style.scss';

function OrderTransactionHistory(props) {
  const { data, isMobile } = props;
  return (
    <div
      className={classNames('cm-OrderTransactionHistory', {
        'is-mobile': isMobile,
      })}
    >
      <span className="cm-SalesOrderDetail__label cm-OrderTransactionHistory__label">
        <TranslatableMessage message={intlMessages.transactionHistoryLabel} />
      </span>
      <div className="cm-OrderTransactionHistory__content">
        {data &&
          data.map((log, index) => (
            <div
              className={classNames('cm-OrderTransactionRecord', {
                'is-mobile': isMobile,
              })}
              key={log.id || index}
            >
              <div className="cm-OrderTransactionRecord__date">
                {formatDate(
                  log.created_at || log.time,
                  isMobile ? 'yy MM dd HH:mm' : undefined,
                )}
              </div>
              <div className="cm-OrderTransactionRecord__step">{index + 1}</div>
              <div className="cm-OrderTransactionRecord__message">
                <TranslatableMessage message={getOrderLogMessage(log)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

OrderTransactionHistory.propTypes = {
  data: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default OrderTransactionHistory;
