import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';

import { formatMessage } from '@/services/intl';
import { withDeviceInfo } from '@/modules/device-info';

import IconButton from '@feat/feat-ui/lib/button/IconButton';

import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import FeatModal from '@feat/feat-ui/lib/feat-modal';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import message from '@feat/feat-ui/lib/message';

import BookingCalendar from './components/BookingCalendar';
import AddressSelectPanel from '../../components/AddressSelectPanel';

import OrderInfo from '../../components/OrderInfo';

import {
  selectOrderCreationState,
  selectUserCommerceInfo,
} from '../../selectors';

import {
  setOrderReservation,
  setOrderAddress,
  createReviewOrder,
  createOrder,
  exitOrderCreation,
  setCreationStep,
  submitAddressForm,
} from '../../actions/creation';

import { initOrderPayment } from '../../actions/payment';

import {
  fetchUserAddresses,
  deleteUserAddress,
  setDefaultAddress,
  fetchGeocodePromiseCreator,
} from '../../actions/user';

import './index.scss';

import {
  ORDER_STEP_SELECT_TIME,
  // ORDER_STEP_ADD_ADDRESS,
  ORDER_STEP_SELECT_ADDRESS,
  ORDER_STEP_SET_PAY_METHOD,
  ORDER_STEP_CREATED,
  PRICE_UNIT_HOUR,
  ORDER_STEP_PAID,
} from '../../constants';

import intlMessages from '../../messages';

class OrderCreation extends Component {
  exitOrderCreation = () => {
    const { creation } = this.props;
    this.props.exitOrderCreation({
      expertiseId: creation.expertiseId,
      serviceType: creation.serviceType,
    });
  };

  exitAddAddress = () => {
    const { creation } = this.props;
    this.props.setCreationStep({
      expertiseId: creation.expertiseId,
      serviceType: creation.serviceType,
      data: ORDER_STEP_SELECT_ADDRESS,
    });
  };

  setOrderReservation = () => {
    const {
      creation: { expertiseId, serviceType },
    } = this.props;
    const bookingState = this.bookingCalendar.state;
    if (!bookingState.start) {
      message.error(formatMessage(intlMessages.serviceTimeRequired));
      return;
    }
    // const period = freePeriods[0];
    // const startTime = new Date(period.start_time);
    // const endTime = new Date(period.start_time);
    // endTime.setHours(endTime.getHours() + 1);

    this.props.setOrderReservation({
      expertiseId,
      serviceType,
      data: {
        startTime: bookingState.start,
        endTime: bookingState.end,
      },
    });
  };

  setOrderAddress = (address, actions) => {
    // const address = this.addressList.state.value;
    const {
      creation: { expertiseId, serviceType },
    } = this.props;
    return this.props.setOrderAddress({
      expertiseId,
      serviceType,
      data: address,
      actions,
    });
  };

  initPaymentFlow = () => {
    const {
      creation: { order, expertiseId, serviceType, payMethodInfo },
    } = this.props;

    if (payMethodInfo) {
      // init pay with method info
    } else {
      // open account binding settings.
    }

    this.props.initOrderPayment({
      expertiseId,
      serviceType,
      orderId: order.id,
      data: order,
    });
  };

  createReviewOrder = () => {
    const { creation } = this.props;
    this.props.createReviewOrder({
      expertiseId: creation.expertiseId,
      serviceType: creation.serviceType,
      period: creation.reservation,
      address: creation.address,
    });
  };

  createOrder = () => {
    const {
      creation: { expertiseId, serviceType, reviewOrderParams },
    } = this.props;

    this.props.createOrder({
      expertiseId,
      serviceType,
      data: reviewOrderParams,
    });
  };

  renderPeriodStep() {
    const { creation, isMobile } = this.props;
    const {
      serviceItem: { unit },
    } = creation;

    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.selectServiceTime} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <BookingCalendar
              isMobile={isMobile}
              ref={(n) => {
                this.bookingCalendar = n;
              }}
              freePeriods={creation.freePeriods}
              mode={unit === PRICE_UNIT_HOUR ? 'range' : 'point'}
            />
            {creation.isCreatingOrder && (
              <MaskLoader
                loaderSize="md"
                loaderLabel={
                  <TranslatableMessage
                    message={intlMessages.creatingOrderHint}
                  />
                }
              />
            )}
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              disabled={
                creation.isCreatingReservation || creation.isCreatingOrder
              }
              onClick={this.exitOrderCreation}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              disabled={
                creation.isCreatingReservation || creation.isCreatingOrder
              }
              className="margin_r_12"
              onClick={this.setOrderReservation}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  renderAddressSelectPanel() {
    const {
      creation: { isSettingAddress },
      userInfo: {
        addresses,
        deletingAddress,
        currentLocation,
        getCurrentLocationError,
        isFetchingUserAddresses,
        isGettingCurrentLocation,
        // userAddressesFetched,
        geoLocation,
      },
      isMobile,
    } = this.props;
    return (
      <AddressSelectPanel
        isMobile={isMobile}
        addresses={addresses}
        deletingAddress={deletingAddress}
        currentLocation={currentLocation}
        geoLocation={geoLocation}
        getCurrentLocationError={getCurrentLocationError}
        isGettingCurrentLocation={isGettingCurrentLocation}
        isFetchingAddresses={isFetchingUserAddresses}
        isSubmitting={isSettingAddress}
        onCancel={this.exitOrderCreation}
        onConfirm={this.setOrderAddress}
        fetchGeocode={this.props.fetchGeocode}
        deleteAddress={this.props.deleteUserAddress}
        setDefaultAddress={this.props.setDefaultAddress}
      />
    );
  }

  renderCreated() {
    const {
      creation: { order },
    } = this.props;

    return (
      <FeatModal className="OrderCreation">
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.purchaseOrder} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <OrderInfo data={order} />
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              onClick={this.exitOrderCreation}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              onClick={this.initPaymentFlow}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  renderPayMethodPanel() {
    const { creation } = this.props;
    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.purchaseOrder} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>Panel</FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              onClick={this.exitOrderCreation}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              disabled={!creation.userPayInfo}
              onClick={this.initPaymentFlow}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  renderPaidPanel() {
    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.thanksForOrder} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>Panel</FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_r_12"
              onClick={this.exitOrderCreation}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  render() {
    const {
      creation: { step },
    } = this.props;
    switch (step) {
      case ORDER_STEP_SELECT_TIME:
        return this.renderPeriodStep();
      case ORDER_STEP_SELECT_ADDRESS:
        return this.renderAddressSelectPanel();
      // case ORDER_STEP_REVIEW_INFO:
      //   return this.renderReview();
      case ORDER_STEP_CREATED:
        return this.renderCreated();
      case ORDER_STEP_SET_PAY_METHOD:
        return this.renderPayMethodPanel();
      case ORDER_STEP_PAID:
        return this.renderPaidPanel();
      default:
        return <div>TOOD STEP {step}</div>;
    }
  }
}

OrderCreation.propTypes = {
  creation: PropTypes.shape({
    serviceItemId: PropTypes.number,
    service: PropTypes.object,
    reversationPeriod: PropTypes.object,
    reviewOrder: PropTypes.object,
    address: PropTypes.object,
    requestingReversation: PropTypes.bool,
  }),
  userInfo: PropTypes.shape({
    defaultAddress: PropTypes.number,
    addresses: PropTypes.array,
    isFetchingAddresses: PropTypes.bool,
  }),
  exitOrderCreation: PropTypes.func,
  setOrderReservation: PropTypes.func,
  setOrderAddress: PropTypes.func,
  setCreationStep: PropTypes.func,
  initOrderPayment: PropTypes.func,
  createOrder: PropTypes.func,
  createReviewOrder: PropTypes.func,
  fetchGeocode: PropTypes.func,
  deleteUserAddress: PropTypes.func,
  setDefaultAddress: PropTypes.func,
  isMobile: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  creation: selectOrderCreationState,
  userInfo: selectUserCommerceInfo,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindPromiseCreators(
    {
      fetchGeocode: fetchGeocodePromiseCreator,
    },
    dispatch,
  ),
  ...bindActionCreators(
    {
      exitOrderCreation,
      setCreationStep,
      setOrderReservation,
      setOrderAddress,
      createOrder,
      fetchUserAddresses,
      initOrderPayment,
      createReviewOrder,
      submitAddressForm,
      deleteUserAddress,
      setDefaultAddress,
    },
    dispatch,
  ),
});

export default withDeviceInfo(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    // userOpenTimeState,
  )(OrderCreation),
);
