import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { Formik, Field } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import { Row, Col } from '@feat/feat-ui/lib/grid';
import IconButton from '@feat/feat-ui/lib/button/IconButton';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import TextField from '@/components/Formik/TextField';

import AddressLevelField from './AddressLevelField';
import CountrySelectField from './CountrySelectField';
import PinMapField from './PinMapField';

import intlMessages from './messages';
import countryOptions from './countries';
import { FALLBACK_BOUNDS } from './constants';

import './style.scss';

export const defaultInitialValues = {
  country_code: 'CHN',
  level_1: '',
  level_2: '',
  level_3: '',
  level_4: '',
  level_5: '',
  level_6: '',
  address: '',
  name: '',
  contact_name: '',
  phone: '',
  auto_geo: null,
  geo: null,
};

class AddressForm extends React.PureComponent {
  state = {
    autoBound: null,
    isAutoFilling: false,
  };

  componentWillUnmount() {
    this.formProps = null;
  }

  handleAddressChange = (value) => {
    this.formProps.setFieldValue('address', value);
    this.debouncedFetchGeocode();
  };

  handleAutoFill = (e) => {
    e.preventDefault();
    this.setState({
      isAutoFilling: true,
    });
    this.props
      .autoFill()
      .then(() => {
        this.formProps && this.formProps.resetForm();
      })
      .catch((err) => {
        logging.debug(err);
      })
      .finally(() => {
        this.setState({
          isAutoFilling: false,
        });
      });
  };

  validate = (values) => {
    const errors = {};
    if (!values.country_code) {
      errors.country_code = formatMessage(formMessages.shortRequired);
    }
    if (!values.level_2) {
      errors.level_2 = formatMessage(formMessages.shortRequired);
    }
    if (!values.level_3) {
      errors.level_3 = formatMessage(formMessages.shortRequired);
    }
    if (!values.level_4) {
      errors.level_4 = formatMessage(formMessages.shortRequired);
    }
    if (!values.address) {
      errors.address = formatMessage(formMessages.shortRequired);
    }
    if (this.props.shouldHasContactInfo && !values.contact_name) {
      errors.contact_name = formatMessage(formMessages.shortRequired);
    }
    if (this.props.shouldHasContactInfo && !values.phone) {
      errors.phone = formatMessage(formMessages.shortRequired);
    }
    if (!values.geo && !values.auto_geo) {
      errors.geo = formatMessage(intlMessages.pleasePinAddressOnMap)
    }

    return errors;
  };

  fetchGeocode = () => {
    if (!this.formProps) {
      return;
    }
    const { values } = this.formProps;
    if (!values.level_4 || !values.level_3 || !values.address) {
      return;
    }

    this.props
      .fetchGeocode({
        country_code: values.country_code,
        level_2: values.level_2,
        level_3: values.level_3,
        level_4: values.level_4,
        address: values.address,
      })
      .then((res) => {
        this.updateAutoGeocode(res);
      })
      .catch((err) => {
        this.updateAutoGeocode({
          params: err.params,
          data: {
            bounds: FALLBACK_BOUNDS,
          },
        });
      });
  };

  debouncedFetchGeocode = debounce(this.fetchGeocode, 400);

  updateAutoGeocode = (data) => {
    const {
      data: { point, bounds },
    } = data;
    if (point) {
      this.formProps.setFieldValue('auto_geo', point);
    } else {
      this.setState({
        autoBound: bounds,
      });
    }
  };

  render() {
    const {
      initialValues,
      onSubmit,
      remoteSubmit,
      shouldHasContactInfo,
      cancelable,
      onCancel,
      isMobile,
    } = this.props;
    const { isAutoFilling } = this.state;

    return (
      <Formik
        initialValues={initialValues}
        validate={this.validate}
        onSubmit={onSubmit}
        innerRef={(n) => {
          this.formProps = n;
        }}
      >
        {(props) => {
          const { handleSubmit, setValues, values, dirty } = props;
          const countryCode = values.country_code || countryOptions[0].value;
          const mapProvider = countryCode === 'CHN' ? 'gaode' : 'google';
          return (
            <form
              className={classNames('ft-AddressForm', {
                'is-mobile': isMobile,
              })}
              onSubmit={dirty ? handleSubmit : onCancel}
            >
              <div
                className={classNames({
                  'ft-AddressForm__col1': !isMobile,
                })}
              >
                <Field
                  name="geo"
                  component={PinMapField}
                  autoGeocode={values.auto_geo}
                  boundsInfo={this.state.autoBound}
                  style={{ width: '100%', height: '100%' }}
                  mapProvider={mapProvider}
                />
              </div>
              <div
                className={classNames({
                  'ft-AddressForm__col2': !isMobile,
                })}
              >
                <Field
                  name="country_code"
                  label={
                    <TranslatableMessage
                      message={intlMessages.addressRegionLabel}
                    />
                  }
                  options={countryOptions}
                  canAutoFill={this.props.canAutoFill}
                  component={CountrySelectField}
                  isAutoFilling={isAutoFilling}
                  onChange={(option) => {
                    setValues({
                      ...values,
                      country_code: option.value,
                      level_1: option.label,
                      level_2: '',
                      level_3: '',
                      level_4: '',
                      level_5: '',
                    });
                  }}
                  onAutoFillClicked={this.handleAutoFill}
                />
                <Row gutter={12} flex>
                  <Col span={12}>
                    <Field
                      name="level_2"
                      label={
                        <TranslatableMessage
                          message={intlMessages.addressLevel2Label}
                        />
                      }
                      onChange={(value) => {
                        setValues({
                          ...values,
                          level_2: value,
                          level_3: '',
                          level_4: '',
                          level_5: '',
                        });
                      }}
                      component={AddressLevelField}
                    />
                  </Col>
                  <Col span={12}>
                    <Field
                      name="level_3"
                      label={
                        <TranslatableMessage
                          message={intlMessages.addressLevel3Label}
                        />
                      }
                      onChange={(value) => {
                        setValues({
                          ...values,
                          level_3: value,
                          level_4: '',
                          level_5: '',
                        });
                      }}
                      component={AddressLevelField}
                    />
                  </Col>
                </Row>
                <Field
                  name="level_4"
                  label={
                    <TranslatableMessage
                      message={intlMessages.addressLevel4Label}
                    />
                  }
                  onChange={(value) => {
                    setValues({
                      ...values,
                      level_4: value,
                      level_5: '',
                    });
                  }}
                  component={AddressLevelField}
                />
                <Field
                  name="level_5"
                  label={
                    <TranslatableMessage
                      message={intlMessages.addressLevel5Label}
                    />
                  }
                  onChange={(value) => {
                    setValues({
                      ...values,
                      level_5: value,
                    });
                  }}
                  component={AddressLevelField}
                />
                <Field
                  name="address"
                  label={
                    <TranslatableMessage
                      message={intlMessages.addressLineLabel}
                    />
                  }
                  component={TextField}
                  onChange={this.handleAddressChange}
                />
                <Field
                  name="name"
                  label={
                    <TranslatableMessage
                      message={intlMessages.addressNameLabel}
                    />
                  }
                  component={TextField}
                />
                {shouldHasContactInfo && (
                  <Row gutter={12} flex>
                    <Col span={12}>
                      <Field
                        name="contact_name"
                        label={
                          <TranslatableMessage
                            message={intlMessages.contactNameLabel}
                          />
                        }
                        component={TextField}
                      />
                    </Col>
                    <Col span={12}>
                      <Field
                        name="phone"
                        label={
                          <TranslatableMessage
                            message={intlMessages.phoneLabel}
                          />
                        }
                        component={TextField}
                      />
                    </Col>
                  </Row>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 'auto',
                  }}
                >
                  {props.dirty &&
                    cancelable && (
                    <IconButton
                      className="margin_r_12"
                      onClick={onCancel}
                      size="sm"
                      svgIcon="no-btn"
                    />
                  )}
                  {!remoteSubmit && (
                    <IconButton size="sm" svgIcon="ok-btn" htmlType="submit" />
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    );
  }
}

AddressForm.propTypes = {
  // className: PropTypes.string,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  remoteSubmit: PropTypes.bool,
  canAutoFill: PropTypes.bool,
  // initialBounds: PropTypes.object,
  fetchGeocode: PropTypes.func,
  shouldHasContactInfo: PropTypes.bool,
  cancelable: PropTypes.bool,
  isMobile: PropTypes.bool,
  onCancel: PropTypes.func,
  autoFill: PropTypes.func,
};

AddressForm.defaultProps = {
  initialValues: defaultInitialValues,
};

export default AddressForm;
