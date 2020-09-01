import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import { DAEMON } from '@/utils/constants';

import Modal from '@feat/feat-ui/lib/modal';

import OrderCreation from '../OrderCreation';
import OrderPayment from '../OrderPayment';
import DemandCreation from '../DemandCreation';
import { selectCommerceUiState } from '../../selectors';

function CommerceServiceLoader(props) {
  return (
    <div id="commerce-service">
      {props.isOrderCreationPanelOpened && (
        <Modal isOpen={props.isOrderCreationPanelOpened}>
          <OrderCreation
            expertiseId={props.creationExpertiseId}
            serviceType={props.creationServiceType}
          />
        </Modal>
      )}
      {props.isOrderPaymentPanelOpened && (
        <Modal isOpen={props.isOrderPaymentPanelOpened}>
          <OrderPayment orderId={props.orderPaymentTarget} />
        </Modal>
      )}
      {props.isDemandCreationPanelOpened && (
        <Modal isOpen={props.isDemandCreationPanelOpened}>
          <DemandCreation />
        </Modal>
      )}
    </div>
  );
}

CommerceServiceLoader.propTypes = {
  isOrderCreationPanelOpened: PropTypes.bool,
  isOrderPaymentPanelOpened: PropTypes.bool,
  isDemandCreationPanelOpened: PropTypes.bool,
  creationExpertiseId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  creationServiceType: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  orderPaymentTarget: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

// const withSaga = injectSaga({ key: REDUCER_KEY, saga, mode: DAEMON });
const withConnect = connect(selectCommerceUiState);

export default compose(
  withConnect,
)(CommerceServiceLoader);
