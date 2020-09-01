import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { Field } from 'formik';
// import { FieldProps } from 'formik';

// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

// import PeriodsField from './PeriodsField';

// import intlMessages from './messages';

const options = [0, 1, 2, 3, 4, 5, 6];

const weekdayWidgetStyle = {
  display: 'flex',
  paddingLeft: '0.3125rem',
  justifyContent: 'space-around',
};

class WeekdayField extends React.PureComponent {
  state = {
    index: null,
  };

  render() {
    const {
      field,
      form,
      iconStyle,

      notAllowed,
      label,
      timeIndex,
    } = this.props;
    const error = form.errors[field.name];
    const touched = form.touched[field.name];
    const { value } = field;
    const {
      values: { records },
    } = form;
    const validateStatus = touched && error ? 'error' : undefined;
    if (value.length === 0 && this.state.index !== null) {
      form.setFieldValue(field.name, value.concat(this.state.index));
    }
    return (
      <>
        <FormItem
          modifier="dashed"
          label={<FormLabel>{label}</FormLabel>}
          validateStatus={validateStatus}
        >
          {({ handleFocus, handleBlur }) => (
            <div style={weekdayWidgetStyle}>
              {options.map((option, index) => {
                const isSelected = value && value.indexOf(option) > -1;
                const isDisabled =
                  !isSelected && notAllowed && notAllowed.indexOf(option) > -1;
                return (
                  <IconButton
                    className={classNames('st-WeekdayButton', {
                      'is-selected': isSelected,
                      'is-disabled': isDisabled,
                    })}
                    // disabled={isDisabled}
                    key={option}
                    svgIcon={`weekday-${option}`}
                    style={iconStyle}
                    onFocus={handleFocus}
                    onBlur={() => {
                      handleBlur();
                      form.setFieldTouched(field.name);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isSelected) {
                        form.setFieldValue(
                          field.name,
                          value.filter((v) => v !== option),
                        );
                        this.setState({ index: null });
                      } else if (isDisabled) {
                        const timeIndex = records.findIndex((item) =>
                          item.weekdays.includes(index),
                        );
                        this.props.changeTimeIndex({
                          type: 'isDisabled',
                          index: timeIndex,
                        });
                      } else {
                        this.props.changeTimeIndex({ index });
                        this.setState({ index: option });
                        if (records[timeIndex].periods.length === 0) {
                          form.setFieldValue(
                            field.name,
                            value.concat(option).sort(),
                          );
                        }
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </FormItem>
      </>
    );
  }
}

WeekdayField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  iconStyle: PropTypes.object,
  notAllowed: PropTypes.array,
  label: PropTypes.node,
  changeTimeIndex: PropTypes.func,
  timeIndex: PropTypes.number,
};

export default WeekdayField;
