import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import './style.scss';

export default function WeekdayWidget(props) {
  const { selected } = props;
  return (
    <div className="WeekdayWidget">
      {[...new Array(7)].map((_, i) => (
        <SvgIcon
          key={i}
          icon={`weekday-${i}`}
          className={classNames('WeekdayWidget__item', {
            'is-selected': selected && selected.indexOf(i) > -1,
          })}
        />
      ))}
    </div>
  );
}

WeekdayWidget.propTypes = {
  selected: PropTypes.array,
};
