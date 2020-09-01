import React from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';

import intlMessages from './messages';
import './style.scss';

const IMCover = (props) => (
  <div className="IM-Cover">
    <div className="IM-Cover__title">{formatMessage(intlMessages.welcome)}</div>
    {props.loading && (
      <div className="IM-Cover__loading">
        {formatMessage(intlMessages.loadingHint)}
      </div>
    )}
  </div>
);

IMCover.propTypes = {
  loading: PropTypes.bool,
};

export default IMCover;
