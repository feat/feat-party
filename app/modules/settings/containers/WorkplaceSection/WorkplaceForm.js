import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { Formik, Field } from 'formik';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import FtBlock from '@feat/feat-ui/lib/block';
import Loader from '@feat/feat-ui/lib/loader';
import notification from '@feat/feat-ui/lib/notification';
import Button from '@feat/feat-ui/lib/button/Button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import TextField from '@/components/Formik/TextField';

import AddressLevelField from '@/components/AddressForm/AddressLevelField';
import CountrySelectField from '@/components/AddressForm/CountrySelectField';
import PinMapField from '@/components/AddressForm/PinMapField';
import addressFormMessages from '@/components/AddressForm/messages';
import countryOptions from '@/components/AddressForm/countries';
import { FALLBACK_BOUNDS } from '@/components/AddressForm/constants';
import intlMessages from './messages';
import { blockAction } from '../../messages';

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

const MAX_LEVEL = 5;
class WorkplaceForm extends React.PureComponent {
  state = {
    autoBound: null,
    isAutoFilling: false,
    autoFilled: false,
  };

  componentWillUnmount() {
    this.formProps = null;
  }

  delaySubmit = (timeout = 3000) => {
    clearTimeout(this.delaySubmitTimer);
    this.delaySubmitTimer = setTimeout(() => {
      if ((!this.formProps || !this.formProps.dirty) && !this.state.autoFilled) {
        return;
      }
      this.setState({ autoFilled: false });
      this.formProps.setSubmitting(true);
      this.props.onSubmit(this.formProps.values, {
        setSubmitting: this.formProps.setSubmitting,
        setErrors: this.formProps.setErrors,
      });
    }, this.hasFocus ? 10000 : timeout);
  }

  cancelSubmit = () => {
    this.hasFocus = true;
    clearTimeout(this.delaySubmitTimer);
  }

  handleLevelBlur = (e) => {
    if (!this.formProps) {
      return;
    }
    const { name } = e.target;
    const { values } = this.formProps;
    const level = parseInt(name.replace('level_'), 10);
    let shouldFetch = true;
    if (values.address.trim()) {
      shouldFetch = false;
    } else {
      for (let i = 1; i < MAX_LEVEL - level; i += 1) {
        if (values[`level_${level + i}`].trim()) {
          shouldFetch = false;
          break;
        }
      }
    }
    logging.debug('shouldFetch');
    if (shouldFetch) {
      this.debouncedFetchGeocode();
    }
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
        // this.formProps && this.formProps.resetForm();
        this.setState({
          autoFilled: true,
        })
        this.delaySubmit(3000);
      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
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
    if (!values.geo && !values.auto_geo) {
      errors.geo = formatMessage(addressFormMessages.pleasePinAddressOnMap)
    }
    return errors;
  };

  fetchGeocode = () => {
    if (!this.formProps) {
      return;
    }
    const { values } = this.formProps;

    const preData = {
      country_code: values.country_code,
      level_2: values.level_2,
      level_3: values.level_3,
      level_4: values.level_4,
      level_5: values.level_5,
      level_6: values.level_6,
      address: values.address,
    };
    Object.keys(preData).forEach((key) => {
      if (!preData[key]) {
        delete preData[key];
      }
    })

    this.props
      .fetchGeocode(preData)
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
      canCancel,
      onCancel,
      formRef,
    } = this.props;
    const { isAutoFilling } = this.state;

    return (
      <Formik
        initialValues={initialValues}
        validate={this.validate}
        onSubmit={onSubmit}
        innerRef={(n) => {
          this.formProps = n;
          if (formRef) {
            formRef(n);
          }
        }}
        enableReinitialize
      >
        {(props) => {
          const { handleSubmit, setValues, values, dirty, isValid, isSubmitting } = props;
          const countryCode = values.country_code || countryOptions[0].value;
          const mapProvider = countryCode === 'CHN' ? 'gaode' : 'google';
          let subHeader = null;
          useEffect(this.delaySubmit, [values]);

          if (isSubmitting) {
            subHeader = (
              <div style={{float: 'right'}}>
                <Button
                  type="link"
                  disabled
                >
                  <Loader size='xs' />
                </Button>
              </div>
            );
          } else if (canCancel && dirty && isValid) {
            subHeader = (
              <div style={{float: 'right'}}>
                <Button
                  key="cancel"
                  type="merge"
                  onClick={onCancel}
                  style={{ marginRight: '.5em', opacity: '.6' }}
                >
                  {formatMessage(blockAction.cancel)}
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    props.submitForm();
                  }}
                  disabled={isSubmitting}
                >
                  {formatMessage(blockAction.save)}
                </Button>
              </div>
            )
          } else if (dirty && isValid) {
            subHeader = null;
            // subHeader = (
            //   <div style={{float: 'right'}}>
            //     <Button
            //       type="link"
            //       onClick={() => {
            //         props.submitForm();
            //       }}
            //       disabled={isSubmitting}
            //     >
            //       {formatMessage(blockAction.save)}
            //     </Button>
            //   </div>
            // )
          } else if (canCancel) {
            subHeader = (
              <div style={{float: 'right'}}>
                <Button
                  key="cancel"
                  type="link"
                  onClick={onCancel}
                >
                  {formatMessage(blockAction.cancel)}
                </Button>
              </div>
            )
          }

          return (
            <FtBlock
              title={<TranslatableMessage message={intlMessages.blockTitle} />}
              subHeader={subHeader}
            >
              <form
                className={classNames('WorkplaceForm')}
                onSubmit={handleSubmit}
              >
                <div
                  className="WorkplaceForm__col1"
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
                  className='WorkplaceForm__col2'
                >
                  
                  <Field
                    name="country_code"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressRegionLabel}
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
                        level_6: '',
                      });
                    }}
                    onAutoFillClicked={this.handleAutoFill}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="level_2"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLevel2Label}
                      />
                    }
                    onChange={(value) => {
                      setValues({
                        ...values,
                        level_2: value,
                        level_3: '',
                        level_4: '',
                        level_5: '',
                        level_6: '',
                      });
                    }}
                    onBlur={(e) => {
                      this.handleLevelBlur(e);
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    component={AddressLevelField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="level_3"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLevel3Label}
                      />
                    }
                    onChange={(value) => {
                      setValues({
                        ...values,
                        level_3: value,
                        level_4: '',
                        level_5: '',
                        level_6: '',
                      });
                    }}
                    onBlur={(e) => {
                      this.handleLevelBlur(e);
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    component={AddressLevelField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="level_4"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLevel4Label}
                      />
                    }
                    onChange={(value) => {
                      setValues({
                        ...values,
                        level_4: value,
                        level_5: '',
                        level_6: '',
                      });
                    }}
                    onBlur={(e) => {
                      this.handleLevelBlur(e);
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    component={AddressLevelField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="level_5"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLevel5Label}
                      />
                    }
                    onChange={(value) => {
                      setValues({
                        ...values,
                        level_5: value,
                        level_6: '',
                      });
                    }}
                    onBlur={(e) => {
                      this.handleLevelBlur(e);
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    component={AddressLevelField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="level_6"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLevel6Label}
                      />
                    }
                    onChange={(value) => {
                      setValues({
                        ...values,
                        level_6: value,
                      });
                    }}
                    onBlur={(e) => {
                      this.handleLevelBlur(e);
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    component={AddressLevelField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="address"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressLineLabel}
                      />
                    }
                    component={TextField}
                    onChange={this.handleAddressChange}
                    onBlur={() => {
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                    autoFocus={canCancel}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                  />
                  <Field
                    name="name"
                    label={
                      <TranslatableMessage
                        message={addressFormMessages.addressNameLabel}
                      />
                    }
                    component={TextField}
                    className="ft-FormItem_inline"
                    modifier="dashed"
                    onBlur={() => {
                      this.hasFocus = false;
                      this.delaySubmit(500);
                    }}
                    onFocus={this.cancelSubmit}
                  />
                </div>
              </form>
            </FtBlock>
          );
        }}
      </Formik>
    );
  }
}

WorkplaceForm.propTypes = {
  // className: PropTypes.string,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  canAutoFill: PropTypes.bool,
  // initialBounds: PropTypes.object,
  fetchGeocode: PropTypes.func,
  canCancel: PropTypes.bool,
  onCancel: PropTypes.func,
  autoFill: PropTypes.func,
  formRef: PropTypes.func,
};

WorkplaceForm.defaultProps = {
  initialValues: defaultInitialValues,
};

export default WorkplaceForm;
