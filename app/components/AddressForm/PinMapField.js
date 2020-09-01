import React from 'react';
import PropTypes from 'prop-types';

// import { FieldProps } from 'formik';

import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import PinMap from '@/components/PinMap';
import { FALLBACK_BOUNDS } from './constants';

class PinMapField extends React.PureComponent {
  handleChange = (data) => {
    const {
      field: { name },
      form: { setFieldValue, setFieldTouched },
    } = this.props;
    setFieldTouched(name);
    setFieldValue(name, data);
  };

  render() {
    const {
      field,
      form,
      autoGeocode,
      label,
      boundsInfo,
      mapProvider,
    } = this.props;
    const { value } = field;

    const shouldRenderMap =
      value || autoGeocode || boundsInfo || form.submitCount;

    const isAutoFill = !form.initialValues.id && form.initialValues.geo;

    const error = form.errors[field.name];
    const touched = form.touched[field.name];
    let point;
    if (isAutoFill) {
      point = value;
    } else {
      point = touched ? value : autoGeocode || value;
    }

    return (
      <div style={this.props.style}>
        {label && <FormLabel>{label}</FormLabel>}
        {shouldRenderMap ? (
          <PinMap
            boundsInfo={boundsInfo || FALLBACK_BOUNDS}
            initialValue={point}
            onChange={this.handleChange}
            provider={mapProvider}
            zoom={point ? 15 : undefined}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f3f3',
            }}
          />
        )}
        {error &&
          !!form.submitCount && (
          <div
            style={{ position: 'absolute', top: 6, right: 18, zIndex: 410 }}
          >
            <FormHelp validateStatus="error" data={error} />
          </div>
        )}
      </div>
    );
  }
}

PinMapField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  style: PropTypes.object,
  boundsInfo: PropTypes.object,
  autoGeocode: PropTypes.object,
  label: PropTypes.node,
  mapProvider: PropTypes.string,
};

export default PinMapField;
