import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { minFormatDate } from '@/utils/time';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { formatTimeInfo, formatSN } from '../../utils';
import { orderStatus as orderStatusMessages } from '../../messages';

const PurchaseOrderBasic = ({ data, isActive, onClick }) => (
  <div
    className={classNames('cm-PurchaseOrderBasic', 'padding_x_12', {
      'is-active': isActive,
      'has-update': data.has_update,
    })}
    onClick={() => {
      onClick(data);
    }}
  >
    <span className="cm-PurchaseOrderBasic__lot">{formatSN(data.sn)}</span>
    <span className="cm-PurchaseOrderBasic__date">
      {minFormatDate(data.created_at || data.create_time)}
    </span>
    <span className="cm-PurchaseOrderBasic__description">
      {data.title} {formatTimeInfo(data)}
    </span>
    <span className="cm-PurchaseOrderBasic__quantity">{data.count}</span>
    <span className="cm-PurchaseOrderBasic__remark">
      <TranslatableMessage
        message={orderStatusMessages[data.status]}
      />
    </span>
    <span className="cm-PurchaseOrderBasic__expense padding_r_5">{`${data.currency} ${
      data.total_amount
    }`}</span>
  </div>
);

PurchaseOrderBasic.propTypes = {
  data: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default PurchaseOrderBasic;
