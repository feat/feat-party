import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Collapse } from 'react-collapse';
import notification from '@feat/feat-ui/lib/notification';

import OrderBasic from './OrderBasic';
import OrderDetail from './OrderDetail';
import { asyncMarkPurchaseOrderUpdateAsRead } from '../../actions/purchase';
import { initOrderPayment } from '../../actions/payment';
import { applyTransition } from '../../actions/order';

import './style.scss';

const PurchaseOrderItem = ({
  data,
  isActive,
  onBasicClick,
  loading,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isActive && data.has_update) {
      dispatch(asyncMarkPurchaseOrderUpdateAsRead({
        orderId: data.id,
      })).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      })
    }
  }, [isActive]);

  return (
    <div className="cm-OrderItem">
      <OrderBasic isActive={isActive} onClick={onBasicClick} data={data} />
      <Collapse isOpened={isActive}>
        <div>
          <OrderDetail
            data={data}
            loading={loading}
            applyTransition={(payload) => {
              dispatch(applyTransition(payload));
            }}
            initPayment={(payload) => {
              dispatch(initOrderPayment(payload));
            }}
          />
        </div>
      </Collapse>
    </div>
  )
};

PurchaseOrderItem.propTypes = {
  data: PropTypes.object,
  isActive: PropTypes.bool,
  loading: PropTypes.bool,
  onBasicClick: PropTypes.func,
}

export default PurchaseOrderItem;
