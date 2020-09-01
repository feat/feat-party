import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Collapse } from 'react-collapse';
import notification from '@feat/feat-ui/lib/notification';

import OrderBasic from './OrderBasic';
import OrderDetail from './OrderDetail';
import { asyncMarkSalesOrderUpdateAsRead } from '../../actions/sales';
import { applyTransition } from '../../actions/order'
import './style.scss';

const OrderItem = ({ data, isActive, onBasicClick }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isActive && data.has_update) {
      dispatch(asyncMarkSalesOrderUpdateAsRead({
        orderId: data.id,
      }))
        .catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        });
    }
  }, [isActive]);

  return (
    <div className="cm-OrderItem">
      <OrderBasic isActive={isActive} onClick={onBasicClick} data={data} />
      <Collapse isOpened={isActive}>
        <div>
          <OrderDetail
            data={data} 
            applyTransition={(payload) => {
              dispatch(applyTransition(payload))
            }} 
          />
        </div>
      </Collapse>
    </div>
  )
}
OrderItem.propTypes = {
  data: PropTypes.object,
  isActive: PropTypes.bool,
  onBasicClick: PropTypes.func,
};

export default OrderItem;
