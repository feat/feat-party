import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMessage } from '@/services/intl';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Button from '@feat/feat-ui/lib/button/Button';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import Loader from '@feat/feat-ui/lib/loader';
import message from '@feat/feat-ui/lib/message';

import PinMap from '@/components/PinMap';
import AddressForm from '@/components/AddressForm';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import OptionSymbol from './OptionSymbol';

import intlMessages from './messages';

import './style.scss';

const MOMENT_PLACE = 'momentPlace';
const ADDRESS_TYPE_WORKPLACE = 100;

/**
 * AddressSelect Panel
 *
 * onConfirm: (data) => { }
 * 数据情况：
 * 1. 更新已有地址 data.id && data.is_update
 * 2. 创建新地址  !data.id
 * 3. 选择已有地址： data.id && !data.is_update
 *
 */
class AddressSelectPanel extends React.PureComponent {
  state = {
    mode: 'select', // select | edit
    selected: undefined, // MOMENT_PLACE | addressObject
    initialValues: null,
    cachedData: {}, // mainly for latlng update.
  };

  getSelected() {
    if (this.state.selected) {
      return this.state.selected;
    }
    if (this.props.getCurrentLocationError && this.props.addresses) {
      return this.props.addresses[0] || '';
    }
    if (this.props.currentLocation) {
      return MOMENT_PLACE;
    }
    return '';
  }

  selectAddress = (address) => {
    this.setState({
      selected: address,
    });
  };

  setDefaultAddress = () => {
    // TODO
  };

  exitEditMode = () => {
    this.setState({
      mode: 'select',
      initialValues: null,
    });
  };

  intiEditMode = (initialValues) => {
    const { lat, lng, formatted, ...data } = initialValues;
    if (lat && lng) {
      data.geo = { lat, lng };
    }

    this.setState({
      mode: 'edit',
      initialValues: data,
    });
  };

  initNewAddressEdit = () => {
    if (this.props.selected && !this.props.selected.id) {
      this.intiEditMode(this.props.selected);
    } else {
      this.intiEditMode({
        country_code: 'CHN',
      });
    }
  };

  updateGeoLocation = (value) => {
    const selected = this.getSelected();
    // if (!selected) {
    //   return;
    // }
    const key = selected.id || selected;
    this.setState({
      cachedData: {
        ...this.state.cachedData,
        [key]: value,
      },
    });
  };

  handleMomentPlaceClick = () => {
    if (this.props.getCurrentLocationError) {
      if (!this.props.geoLocation) {
        this.intiEditMode({});
      } else {
        this.intiEditMode({
          lat: this.props.geoLocation.coords.latitude,
          lng: this.props.geoLocation.coords.longitude,
        });
      }
    } else {
      this.selectAddress(MOMENT_PLACE);
    }
  };

  handleAddressFormConfirm = () => {
    this.addressForm.formProps.submitForm();
  };

  handleAddressFormSubmit = (values, actions) => {
    const data = { ...values };
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        delete data[key];
      }
    });
    if (data.id) {
      data.is_update = true;
    }
    this.props.onConfirm(data, actions);
  };

  removeAddress = (address) => {
    this.props.deleteAddress({
      addressId: address.id,
    });
  };

  handleConfirm = () => {
    const selected = this.getSelected();
    if (
      selected === MOMENT_PLACE &&
      !this.props.currentLocation &&
      this.props.geoLocation
    ) {
      this.intiEditMode({
        lat: this.props.geoLocation.coords.latitude,
        lng: this.props.geoLocation.coords.longitude,
      });
      return;
    }
    const addressInfo =
      selected === MOMENT_PLACE ? this.props.currentLocation : selected;
    if (!addressInfo) {
      message.error(formatMessage(intlMessages.pleaseSetAnAddress));
      return;
    }
    this.props.onConfirm(addressInfo);
  };

  renderAddressEditPanel() {
    const { initialValues } = this.state;
    const isCreate = !initialValues.id;
    const isAddressFormReady = true;
    const { isSubmitting, isMobile } = this.props;
    return (
      <FeatModal
        className={classNames('MAddressSelectPanel', {
          'is-mobile': isMobile,
        })}
      >
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              {isCreate ? (
                <TranslatableMessage message={intlMessages.newAddressLabel} />
              ) : (
                <TranslatableMessage message={intlMessages.editAddressLabel} />
              )}
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <AddressForm
              ref={(n) => {
                this.addressForm = n;
              }}
              isMobile={isMobile}
              className="margin_t_12"
              initialValues={initialValues}
              fetchGeocode={this.props.fetchGeocode}
              onSubmit={this.handleAddressFormSubmit}
              remoteSubmit
              shouldHasContactInfo
            />
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              disabled={isSubmitting}
              onClick={this.exitEditMode}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              disabled={!isAddressFormReady || isSubmitting}
              className="margin_r_12"
              onClick={this.handleAddressFormConfirm}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  renderCurrentLocationOption() {
    const {
      isGettingCurrentLocation,
      currentLocation,
      getCurrentLocationError,
    } = this.props;

    const selected = this.getSelected();

    return (
      <div
        className={classNames('MAddressSelectOption', {
          'is-disabled': isGettingCurrentLocation,
        })}
        onClick={this.handleMomentPlaceClick}
      >
        <div className="MAddressSelectOption__label">
          <OptionSymbol selected={selected === MOMENT_PLACE} />
          <TranslatableMessage message={intlMessages.momentPlace} />

          {isGettingCurrentLocation && <Loader size="sm" />}
          {!isGettingCurrentLocation &&
            !getCurrentLocationError && (
            <Button
              className="margin_l_12"
              onClick={(e) => {
                e.stopPropagation();
                this.intiEditMode(currentLocation);
              }}
              type="link"
            >
              <TranslatableMessage message={intlMessages.editLabel} />
            </Button>
          )}
        </div>
        {currentLocation && (
          <div className="MAddressSelectOption__content">
            <div className="MAddressSelectOption__address">
              <div className="MAddressSelectOption__line">
                {currentLocation.level_1} {currentLocation.level_2}{' '}
                {currentLocation.level_3}
              </div>

              <div className="MAddressSelectOption__line">
                {currentLocation.level_4} {currentLocation.address}
              </div>
              {currentLocation.name && (
                <div className="MAddressSelectOption__line">
                  {currentLocation.name}
                </div>
              )}
            </div>
            <div className="MAddressSelectOption__phone">
              <span className="MAddressSelectOption__contentLabel">
                <TranslatableMessage message={intlMessages.phoneLabel} />
              </span>
              {currentLocation.phone}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderSelectedAddressInfo() {
    const selected = this.getSelected();
    const addressInfo =
      selected === MOMENT_PLACE ? this.props.currentLocation : selected;
    const { cachedData } = this.state;
    const key = selected ? selected.id || selected : undefined;
    // TODO: get default locale;
    return (
      <div className="ft-AddressPanelSelectedInfo">
        {addressInfo ? (
          <div className="ft-AddressPanelSelectedInfo__map">
            <PinMap
              initialValue={cachedData[key] || addressInfo}
              key={key}
              onChange={this.updateGeoLocation}
            />
          </div>
        ) : (
          <div className="ft-AddressPanelSelectedInfo__mapPlaceholder" />
        )}
        <div className="ft-AddressPanelSelectedInfo__label">
          {addressInfo && addressInfo.formatted}
        </div>
      </div>
    );
  }

  renderUserAddressesOption() {
    const { isFetchingAddresses, addresses } = this.props;
    const selected = this.getSelected();
    return (
      <div className="MAddressSelectPanel__list">
        {isFetchingAddresses && <MaskLoader />}
        {addresses &&
          addresses.map((address) => (
            <div
              className="MAddressSelectOption MAddressSelectOption_card"
              key={address.id}
              onClick={() => {
                this.selectAddress(address);
              }}
            >
              <div className="MAddressSelectOption__label">
                <OptionSymbol
                  selected={selected ? selected.id === address.id : false}
                />
                {address.contact_name}
              </div>
              <div className="MAddressSelectOption__content">
                <div className="MAddressSelectOption__address">
                  <div className="MAddressSelectOption__line">
                    {address.level_1} {address.level_2} {address.level_3}
                  </div>

                  <div className="MAddressSelectOption__line">
                    {address.level_4} {address.address}
                  </div>
                  {address.name && (
                    <div className="MAddressSelectOption__line">
                      {address.name}
                    </div>
                  )}
                </div>
                <div className="MAddressSelectOption__phone">
                  <span className="MAddressSelectOption__contentLabel">
                    <TranslatableMessage message={intlMessages.phoneLabel} />
                  </span>
                  {address.phone}
                </div>
              </div>
              <div className="MAddressSelectOption__footer">
                <div className="MAddressSelectOption__action">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      this.intiEditMode(address);
                    }}
                    type="link"
                  >
                    <TranslatableMessage message={intlMessages.editLabel} />
                  </Button>
                </div>
                {address.address_type !== ADDRESS_TYPE_WORKPLACE && (
                  <div className="MAddressSelectOption__action">
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.preventDefault();
                        this.removeAddress(address);
                      }}
                    >
                      <TranslatableMessage message={intlMessages.deleteLabel} />
                    </Button>
                  </div>
                )}
                {!address.is_default && (
                  <div className="MAddressSelectOption__action">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        this.setDefaultAddress(address);
                      }}
                      type="link"
                    >
                      <TranslatableMessage
                        message={intlMessages.setAsDefaultLabel}
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  renderAddressSelectPanel() {
    const {
      isFetchingAddresses,
      isGettingCurrentLocation,
      isMobile,
    } = this.props;
    return (
      <FeatModal
        className={classNames('MAddressSelectPanel', {
          'is-mobile': isMobile,
        })}
      >
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage
                message={intlMessages.selectAnAddressLabel}
              />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content className="MAddressSelectPanel__content">
            <div
              className="MAddressSelectOption"
              onClick={this.initNewAddressEdit}
            >
              <div className="MAddressSelectOption__label">
                <OptionSymbol />
                <TranslatableMessage message={intlMessages.newAddressLabel} />
              </div>
            </div>
            {this.renderCurrentLocationOption()}
            {this.renderUserAddressesOption()}
          </FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              svgIcon="no-btn"
              size="md"
              className="margin_r_24"
              onClick={this.props.onCancel}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              disabled={isGettingCurrentLocation || isFetchingAddresses}
              className="margin_r_12"
              onClick={this.handleConfirm}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  render() {
    const { mode } = this.state;
    switch (mode) {
      case 'edit':
        return this.renderAddressEditPanel();
      case 'select':
        return this.renderAddressSelectPanel();
      default:
        return <div>Unknown mode</div>;
    }
  }
}

AddressSelectPanel.propTypes = {
  addresses: PropTypes.array,
  selected: PropTypes.object,

  getCurrentLocationError: PropTypes.object,
  currentLocation: PropTypes.object,

  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,

  isFetchingAddresses: PropTypes.bool,
  fetchGeocode: PropTypes.func,

  isSubmitting: PropTypes.bool,

  isGettingCurrentLocation: PropTypes.bool,
  geoLocation: PropTypes.object,

  deleteAddress: PropTypes.func,

  isMobile: PropTypes.bool,
};

export default AddressSelectPanel;
