import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { minFormatDate } from '@/utils/time';
import { orderStatus as orderStatusMessages } from '@/modules/commerce/messages';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { formatTimeInfo, formatSN } from '../../utils';

const SalesOrderBasic = ({ data, isActive, onClick }) => (
  <div
    className={classNames('cm-SalesOrderBasic', 'padding_x_12', {
      'is-active': isActive,
      'has-update': data.has_update,
    })}
    onClick={() => {
      onClick(data);
    }}
  >
    <span className="cm-SalesOrderBasic__lot">{formatSN(data.sn)}</span>
    <span className="cm-SalesOrderBasic__date">
      {minFormatDate(data.created_at || data.create_time)}
    </span>
    <span className="cm-SalesOrderBasic__description">
      {data.title} {formatTimeInfo(data)}
    </span>
    <span className="cm-SalesOrderBasic__quantity">{data.count}</span>
    <span className="cm-SalesOrderBasic__remark">
      <TranslatableMessage message={orderStatusMessages[data.status]} />
    </span>
    <span className="cm-SalesOrderBasic__expense padding_r_5">{`${
      data.currency
    } ${data.total_amount}`}</span>
  </div>
);

SalesOrderBasic.propTypes = {
  data: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default SalesOrderBasic;
