import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '@feat/feat-ui/lib/text-input';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

function HomeDomainWidget(props) {
  const { form, field } = props;
  const error = form.errors[field.name];
  const touched = form.touched[field.name];
  
  return (
    <FormItem
      label={props.label}
      modifier="dashed"
      help={error ? <FormHelp data={error} /> : undefined}
      validateStatus={error && touched ? 'error' : undefined}
    >
      <div
        className={classNames('HomeDomainWidget', {
          'is-disabled': props.disabled,
        })}
      >
        <Tooltip
          title={props.tooltip}
          placement="top"
          trigger="click"
        >
          <Input
            name={field.name}
            className="HomeDomainWidget__input"
            disabled={props.disabled}
            value={field.value}
            placeholder="Homepage link"
            onChange={field.onChange}
            onBlur={field.onBlur}
            prefix={
              <span className="HomeDomainWidget__prefix">{props.prefix}</span>
            }
          />
        </Tooltip>
        {/* {!props.disabled && (
          <span className="HomeDomainWidget__btn">
            <IconButton
              htmlType="submit"
              svgIcon="ok-btn"
              size="sm"
              disabled={!form.dirty || form.isSubmitting}
            />
          </span>
        )} */}
      </div>
    </FormItem>
  );
}

HomeDomainWidget.propTypes = {
  disabled: PropTypes.bool,
  prefix: PropTypes.node,
  label: PropTypes.node,
  tooltip: PropTypes.node,
  form: PropTypes.object,
  field: PropTypes.object,
};

export default HomeDomainWidget;
