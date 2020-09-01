import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Loader from '@feat/feat-ui/lib/loader';

import './style.scss';

export default function Loading({ size = 'xs', modifier }) {
  return (
    <div
      className={classNames('IM-Loading', `IM-Loading_${size}`, {
        [`IM-Loading_${modifier}`]: modifier,
      })}
    >
      <Loader size={size} />
    </div>
  );
}

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'xs']),
  modifier: PropTypes.string,
};
