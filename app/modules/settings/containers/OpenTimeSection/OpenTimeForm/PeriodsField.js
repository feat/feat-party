import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { FieldProps } from 'formik';

import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';
import Popover from '@feat/feat-ui/lib/popover';
import Button from '@feat/feat-ui/lib/button';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

// const formatTime = (m) => m.format('HH:mm');
const parseValue = (a) => a;

class PeriodsField extends Component {
  addPeriod = (moments) => {
    const { field, form } = this.props;
    const newPeriod = { start: moments[0], until: moments[1] };

    const newPeriodStart = moments[0];
    const newPeriodEnd = moments[1];
    const newPeriods = [];

    let tempPeriods = field.value;

    // replace conflict period;
    tempPeriods = tempPeriods.filter((period) => {
      const periodStart = moment(period.start, 'HH:mm');
      const periodEnd = moment(period.until, 'HH:mm');
      return !(
        (newPeriodStart.isBefore(periodEnd) &&
          newPeriodEnd.isAfter(periodEnd)) ||
        (newPeriodStart.isSameOrAfter(periodStart) &&
          newPeriodEnd.isSameOrBefore(periodEnd)) ||
        (newPeriodStart.isBefore(periodStart) &&
          newPeriodEnd.isAfter(periodStart))
      );
    });

    tempPeriods.push(newPeriod);
    const sorted = tempPeriods.sort(
      (a, b) => parseValue(a.start) - parseValue(b.until),
    );

    // merge
    newPeriods.push(sorted[0]);
    sorted.forEach((period) => {
      const lastPeriod = newPeriods[newPeriods.length - 1];
      const lastEnd = parseValue(lastPeriod.until);

      const periodBegin = parseValue(period.start);
      const periodEnd = parseValue(period.until);

      if (lastEnd < periodBegin) {
        newPeriods.push(period);
      } else if (lastEnd < periodEnd) {
        // merge period;
        lastPeriod.until = period.until;
      } else if (lastEnd >= periodEnd) {
        // TODO:
      }
    });

    form.setFieldValue(field.name, newPeriods);

    if (this[`popover_${this.popoverKey}`]) {
      this[`popover_${this.popoverKey}`].closePortal();
    }
    // this.picker && this.picker.reset();
  };

  removePeriod(index) {
    const {
      field: { value, name },
      form: { setFieldValue },
    } = this.props;
    const newValue = [...value.slice(0, index), ...value.slice(index + 1)];
    setFieldValue(name, newValue);
  }

  renderPeriodString() {
    const { field, placeholder } = this.props;
    if (field.value.length === 0) {
      return placeholder;
    }
    return field.value
      .map(
        (period) =>
          `${period.start
            .local()
            .format('HH:mm')}--${period.until.local().format('HH:mm')}`,
      )
      .join('; ');
  }

  renderPeriodButton(key, fns = {}) {
    const {
      field: { value },
      placeholder,
    } = this.props;
    const period = value[key];
    return (
      <Popover
        key={key}
        placement="bottomLeft"
        trigger="click"
        ref={(n) => {
          this[`popover_${key}`] = n;
        }}
        onOpen={() => {
          this.popoverKey = key;
          if (fns.handleFocus) {
            fns.handleFocus();
          }
        }}
        onClose={fns.handleBlur}
        content={
          <div style={{ minWidth: 300, maxWidth: 400 }}>
            <FlatDatePicker.RangePicker
              pickerMode="normal"
              viewMode="Hm"
              viewDate={new Date()}
              format="HH:mm"
              onChange={this.addPeriod}
            />
          </div>
        }
      >
        <div style={{ display: 'flex', marginBottom: 4 }}>
          <Button className="t-left" block>
            {period
              ? `${period.start
                .local()
                .format('HH:mm')}--${period.until.local().format('HH:mm')}`
              : placeholder}
          </Button>
          {period && (
            <SquareButton
              onClick={(e) => {
                e.stopPropagation();
                this.removePeriod(key);
              }}
            >
              &times;
            </SquareButton>
          )}
        </div>
      </Popover>
    );
  }

  render() {
    const { label, form, field } = this.props;
    const touched = form.touched[field.name];
    const error = form.errors[field.name];

    const validateStatus = touched && error ? 'error' : undefined;

    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        validateStatus={validateStatus}
        // modifier="solid"
      >
        {(fns) => [0, 1, 2].map((key) => this.renderPeriodButton(key, fns))}
      </FormItem>
    );
  }
}

PeriodsField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  placeholder: PropTypes.node,
};

export default PeriodsField;
