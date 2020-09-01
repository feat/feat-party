import React from 'react';
import PropTypes from 'prop-types';
// import { FieldProps } from 'formik';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import Button from '@feat/feat-ui/lib/button';

class CountrySelectField extends React.PureComponent {
  handleChange = (e) => {
    const { value } = e.target;
    const { options, onChange } = this.props;
    const option = options.find((item) => String(item.value) === value);
    onChange(option);
  };

  render() {
    const {
      field,
      form,
      label,
      options,
      canAutoFill,
      isAutoFilling,
      onAutoFillClicked,
      className,
      modifier,
    } = this.props;

    const error = form.errors[field.name];
    const touched = form.touched[field.name];
    const validateStatus = touched && error ? 'error' : undefined;

    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        validateStatus={validateStatus}
        className={className}
        modifier={modifier}
      >
        {({ handleFocus, handleBlur }) => (
          <div className="CountrySelectWidget" style={{ display: 'flex' }}>
            <select
              className="CountrySelectWidget__select"
              name={field.name}
              value={field.value}
              onChange={this.handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={(n) => {
                this.select = n;
              }}
            >
              {options &&
                options.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
            </select>
            {canAutoFill && (
              <Button
                onClick={onAutoFillClicked}
                type="merge"
                className="CountrySelectWidget__autoFillBtn"
                disabled={isAutoFilling}
              >
                {isAutoFilling ? (
                  <span>...</span>
                ) : (
                  <svg height="16" width="16">
                    <circle
                      cx="8"
                      cy="8"
                      r="8"
                      stroke="#aaa"
                      strokeWidth="1"
                      fill="transparent"
                    />
                    <circle cx="8" cy="8" r="5" fill="#333" />
                  </svg>
                )}
              </Button>
            )}
          </div>
        )}
      </FormItem>
    );
  }
}

CountrySelectField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  options: PropTypes.array,
  onChange: PropTypes.func,
  isAutoFilling: PropTypes.bool,
  canAutoFill: PropTypes.bool,
  onAutoFillClicked: PropTypes.func,
  className: PropTypes.string,
  modifier: PropTypes.string,
};

export default CountrySelectField;
