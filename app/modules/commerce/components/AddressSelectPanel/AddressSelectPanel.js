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
const initialAddress = { 
  country_code: 'CHN',
}

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
      return this.props.addresses.find((item) => item.is_default) || this.props.addresses[0] || '';
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

  exitEditMode = () => {
    this.setState({
      mode: 'select',
      initialValues: null,
    });
  };

  intiEditMode = (initialValues = initialAddress) => {
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
      this.intiEditMode();
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
        this.intiEditMode();
      } else {
        this.intiEditMode({
          country_code: initialAddress,
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

  setDefaultAddress = (address) => {
    this.props.setDefaultAddress({
      addressId: address.id,
    })
  }

  handleConfirm = () => {
    const selected = this.getSelected();
    if (
      selected === MOMENT_PLACE &&
      !this.props.currentLocation &&
      this.props.geoLocation
    ) {
      this.intiEditMode({
        country_code: initialAddress.country_code,
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
    const { isSubmitting } = this.props;
    return (
      <FeatModal className={classNames('ft-AddressSelectPanel')}>
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
              disabled={isSubmitting}
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
        className={classNames(
          'ft-AddressSelectOption ft-AddressSelectOption_momentPlace',
          {
            'is-disabled': isGettingCurrentLocation,
          },
        )}
        onClick={this.handleMomentPlaceClick}
      >
        <div className="ft-AddressSelectOption__label">
          <OptionSymbol selected={selected === MOMENT_PLACE} />
          <TranslatableMessage message={intlMessages.momentPlace} />
        </div>
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
      <div className="ft-AddressSelectPanel__list">
        {isFetchingAddresses && <MaskLoader />}
        {addresses &&
          addresses.map((address) => (
            <div
              className="ft-AddressSelectOption ft-AddressSelectOption_card"
              key={address.id}
              onClick={() => {
                this.selectAddress(address);
              }}
            >
              <div className="ft-AddressSelectOption__label">
                <OptionSymbol
                  selected={selected ? selected.id === address.id : false}
                />
                {address.contact_name}
              </div>
              <div className="ft-AddressSelectOption__content">
                <div className="ft-AddressSelectOption__address">
                  <div className="ft-AddressSelectOption__line">
                    {address.address_type === ADDRESS_TYPE_WORKPLACE && (
                      <span className="ft-AddressSelectOption__meta">
                        {formatMessage(intlMessages.workplaceLabel)}
                      </span>
                    )}
                    {address.is_default && (
                      <span className="ft-AddressSelectOption__meta">
                        {formatMessage(intlMessages.defaultLabel)}
                      </span>
                    )}
                    {address.level_1} {address.level_2} {address.level_3}
                  </div>

                  <div className="ft-AddressSelectOption__line">
                    {address.level_4} {address.address}
                  </div>
                  {address.name && (
                    <div className="ft-AddressSelectOption__line">
                      {address.name}
                    </div>
                  )}
                </div>
                <div className="ft-AddressSelectOption__phone">
                  <span className="ft-AddressSelectOption__contentLabel">
                    <TranslatableMessage message={intlMessages.phoneLabel} />
                  </span>
                  {address.phone}
                </div>
              </div>
              <div 
                className="ft-AddressSelectOption__footer"
              >
                {address.address_type !== ADDRESS_TYPE_WORKPLACE && (
                  <div className="ft-AddressSelectOption__action">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        this.intiEditMode(address);
                      }}
                      type="link"
                    >
                      <TranslatableMessage message={intlMessages.editLabel} />
                    </Button>
                  </div>
                )}
                {address.address_type !== ADDRESS_TYPE_WORKPLACE && (
                  <div className="ft-AddressSelectOption__action">
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeAddress(address);
                      }}
                    >
                      <TranslatableMessage message={intlMessages.deleteLabel} />
                    </Button>
                  </div>
                )}
                {!address.is_default && 
                  <div className="ft-AddressSelectOption__action">
                    <Button 
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.setDefaultAddress(address);
                      }}
                    >
                      <TranslatableMessage
                        message={intlMessages.setAsDefaultLabel}
                      />
                    </Button>
                  </div>
                }
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
        className={classNames('ft-AddressSelectPanel', {
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
          <FeatModal.Content className="ft-AddressSelectPanel__content">
            <div className="ft-AddressSelectPanel__col1">
              {this.renderCurrentLocationOption()}
              {this.renderSelectedAddressInfo()}
            </div>
            <div className="ft-AddressSelectPanel__col2">
              {this.renderUserAddressesOption()}
              <div className="ft-AddressSelectPanel__addBtn">
                <div
                  className="ft-AddressSelectOption"
                  onClick={this.initNewAddressEdit}
                >
                  <div className="ft-AddressSelectOption__label">
                    <OptionSymbol />
                    <TranslatableMessage
                      message={intlMessages.newAddressLabel}
                    />
                  </div>
                </div>
              </div>
            </div>
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
              disabled={(isGettingCurrentLocation || isFetchingAddresses) && !this.getSelected()}
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
  setDefaultAddress: PropTypes.func,

  isMobile: PropTypes.bool,
};

export default AddressSelectPanel;
