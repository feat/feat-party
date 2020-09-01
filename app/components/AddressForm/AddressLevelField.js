import React from 'react';
import PropTypes from 'prop-types';
// import { FieldProps } from 'formik';

import Input from '@feat/feat-ui/lib/text-input';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

class AddressLevelField extends React.PureComponent {
  handleChange = (e) => {
    const { value } = e.target;
    this.props.onChange(value);
  };

  render() {
    const {
      label,
      modifier,
      className,
      help,
      placeholder,
      autoFocus,
      field,
      form,
      onBlur,
      onFocus,
    } = this.props;

    const { name, value } = field;
    const error = form.errors[name];
    const validateStatus = (
      form.submitCount || form.touched[name]
    ) && error ? 'error' : undefined;

    return (
      <FormItem
        className={className}
        label={<FormLabel>{label}</FormLabel>}
        help={
          validateStatus ? (
            <FormHelp data={error} />
          ) : (
            help && <FormHelp data={help} />
          )
        }
        validateStatus={validateStatus}
        modifier={modifier}
      >
        {({ handleBlur, handleFocus, bindWidget }) => (
          <Input
            ref={(n) => {
              bindWidget(n);
            }}
            name={name}
            value={value}
            block
            placeholder={placeholder}
            onChange={this.handleChange}
            onBlur={(e) => {
              handleBlur();
              field.onBlur(e);
              if (onBlur) {
                onBlur(e);
              }
            }}
            autoFocus={autoFocus}
            onFocus={(e) => {
              handleFocus();
              if (onFocus) {
                onFocus(e);
              }
            }}
          />
        )}
      </FormItem>
    );
  }
}

AddressLevelField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  label: PropTypes.node,
  modifier: PropTypes.string,
  className: PropTypes.string,
  help: PropTypes.any,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default AddressLevelField;
