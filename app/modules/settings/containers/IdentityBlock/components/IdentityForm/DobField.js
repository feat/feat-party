import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatMessage } from '@/services/intl';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import Button from '@feat/feat-ui/lib/button';
import Popover from '@feat/feat-ui/lib/popover';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';

import intlMessages from './messages';

class DobField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isActive: !this.props.field.value,
    }
  }

  handleChange = (value) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    setFieldValue(name, value);
    if (this.popover) {
      this.popover.closePortal();
    }
  };

  render() {
    const { field, label, form, ...custom } = this.props;
    // const validateStatus = getValidateStatus(meta);
    const error = form.errors[field.name];
    const validateStatus = (form.submitCount || 
      form.touched[field.name]) && error ? 'error' : undefined;
    const age = field.value && -1 * moment(field.value).diff(moment(), 'years');
    return (
      <FormItem
        className={custom.className}
        label={<FormLabel>{label}</FormLabel>}
        labelCol={custom.labelCol}
        wrapperCol={custom.wrapperCol}
        help={
          validateStatus ? (
            <FormHelp data={error} />
          ) : (
            custom.help && <FormHelp data={custom.help} />
          )
        }
        validateStatus={validateStatus}
        modifier={custom.modifier}
      >
        {({ handleFocus, handleBlur }) => (
          <Popover
            placement="bottom"
            trigger="click"
            ref={(n) => {
              this.popover = n;
            }}
            content={
              <div style={custom.popStyle}>
                <FlatDatePicker
                  defaultValue={field.value}
                  originYear={moment().year() - custom.minAge}
                  pickerMode="history"
                  yearRange={72}
                  onChange={this.handleChange}
                />
              </div>
            }
            onOpen={() => {
              handleFocus();
              this.setState({ isActive: true })
            }}
            onClose={() => {
              handleBlur();
              this.setState({ isActive: false })
            }}
          >
            <Button
              role="button"
              block
              className="t-left"
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {!field.value || this.state.isActive
                ? formatMessage(intlMessages.dobLabel)
                : formatMessage(intlMessages.ageLabel, { age })}
            </Button>
          </Popover>
        )}
      </FormItem>
    );
  }
}

DobField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  beforeChange: PropTypes.func,
  onChange: PropTypes.func,
  size: PropTypes.string,
  popStyle: PropTypes.object,
  minAge: PropTypes.number,
};

export default DobField;
