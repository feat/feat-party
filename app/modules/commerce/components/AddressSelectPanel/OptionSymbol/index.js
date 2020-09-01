import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

function OptionSymbol(props) {
  return (
    <div
      className={classNames('ft-OptionSymbol', {
        'is-selected': props.selected,
      })}
    />
  );
}

OptionSymbol.propTypes = {
  selected: PropTypes.bool,
};

export default OptionSymbol;
