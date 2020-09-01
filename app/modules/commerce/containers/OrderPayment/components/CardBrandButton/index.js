import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@feat/feat-ui/lib/button';

import CardIcon from '../../../../components/CardIcon';

import './style.scss';

function CardBrandButton(props) {
  return (
    <Button
      className={classNames('cm-CardBrandButton', props.className, {
        'is-selected': props.selected,
      })}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <CardIcon icon={props.icon} />
    </Button>
  );
}

CardBrandButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
};

export default CardBrandButton;
