import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
// import SvgIcon from '@feat/feat-ui/lib/svg-icon';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormValueStatic from '@feat/feat-ui/lib/form/FormValueStatic';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
// import WeekdayWidget from '@/components/WeekdayWidget';
import FieldItem from '@/components/FieldItem';

import { openTimeField } from '../../../messages';

export default function OpenTimeSection(props) {
  // const {
  //   data: { weekdays, periods },
  // } = props;
  const { data } = props;
  // 合并星期数
  const weeks =
    data.length !== 0
      ? data.map((d) => d.weekdays).reduce((acc, cur) => acc.concat(cur))
      : [];

  // 设置初始的星期数
  const [periodIndex, setPeriodIndex] = useState(Math.min(...weeks));
  // 设置初始的大时间段
  const [weekday, setWeekday] = useState(
    data.length !== 0
      ? data.find((d) => d.weekdays.includes(periodIndex)).weekdays
      : [],
  );

  return (
    <div className="OpenTimeSection">
      <FieldItem
        modifier="dashed"
        label={
          <FormLabel>
            <TranslatableMessage
              message={openTimeField.openTimeWeekdaysLabel}
            />
          </FormLabel>
        }
        // content={<WeekdayWidget selected={weekdays} />}
        content={
          <div className="OpenTimeWeekday">
            {[...new Array(7)].map((_, i) => (
              <IconButton
                key={i}
                svgIcon={`weekday-${i}`}
                className={classNames('OpenTimeWeekday__item', {
                  'is-selected': weeks && weeks.indexOf(i) > -1,
                  'is-show': weekday.includes(i),
                })}
                disabled={weeks && weeks.indexOf(i) === -1}
                onClick={() => {
                  setPeriodIndex(i);
                  setWeekday(data.find((d) => d.weekdays.includes(i)).weekdays);
                }}
              />
            ))}
          </div>
        }
      />
      {data.map(
        (item) =>
          item.weekdays.includes(periodIndex) && (
            <FieldItem
              modifier="solid"
              label={
                <FormLabel>
                  <TranslatableMessage
                    message={openTimeField.openTimePeriodsLabel}
                  />
                </FormLabel>
              }
              content={item.periods.map((period, index) => (
                <FormValueStatic
                  className="margin_r_5 margin_b_5"
                  size="sm"
                  key={index}
                >
                  {`${period.start.format('HH:mm')} -- ${period.until.format(
                    'HH:mm',
                  )}`}
                </FormValueStatic>
              ))}
            />
          ),
      )}
    </div>
  );
}

OpenTimeSection.propTypes = {
  data: PropTypes.array,
};
