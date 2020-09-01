import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import { Field } from 'formik';

// import Button from '@feat/feat-ui/lib/button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import WeekdayField from './WeekdayField';
import PeriodsField from './PeriodsField';

import intlMessages from './messages';

export default function PeriodRecordField({ form }) {
  const { records } = form.values;
  const selectedWeekdays = records
    ? uniq(records.reduce((a, b) => [...a, ...b.weekdays], []))
    : [];

  const [timeIndex, setTimeIndex] = useState(0);
  const [weekIndex, setWeekIndex] = useState(0);
  const handleClick = () => {
    const recordSelected = records.filter(
      (item) => item.weekdays.length && item.periods.length,
    );
    if (recordSelected.length < 7) {
      setTimeIndex(recordSelected.length);
      setWeekIndex(recordSelected.length);
    } else {
      setTimeIndex(0);
    }
  };
  return (
    <div>
      {/* {records.map((record, index) => (
        <div key={index}>
          <Field
            name={`records.${index}.weekdays`}
            label={<TranslatableMessage message={intlMessages.weekdaysLabel} />}
            component={WeekdayField}
            notAllowed={selectedWeekdays}
          />
          <Field
            name={`records.${index}.periods`}
            label={<TranslatableMessage message={intlMessages.periodsLabel} />}
            component={PeriodsField}
            placeholder={
              <TranslatableMessage message={intlMessages.periodsPlaceholder} />
            }
          />
        </div>
      ))} */}
      {[...new Array(1)].map((record, index) => (
        <div key={index}>
          <Field
            name={`records.${weekIndex}.weekdays`}
            label={<TranslatableMessage message={intlMessages.weekdaysLabel} />}
            changeTimeIndex={({ type, index }) => {
              if (type) {
                setTimeIndex(index);
                setWeekIndex(index);
              } else if (
                records[timeIndex].weekdays.length &&
                records[timeIndex].periods.length
              ) {
                handleClick();
              }
            }}
            timeIndex={timeIndex}
            component={WeekdayField}
            notAllowed={selectedWeekdays}
          />
          <Field
            name={`records.${timeIndex}.periods`}
            label={<TranslatableMessage message={intlMessages.periodsLabel} />}
            component={PeriodsField}
            placeholder={
              <TranslatableMessage message={intlMessages.periodsPlaceholder} />
            }
          />
        </div>
      ))}
      {/* <Button
        block
        onClick={handleClick}
        disabled={
          !(
            records[timeIndex].weekdays.length &&
            records[timeIndex].periods.length
          )
        }
      >
        OK
      </Button> */}
    </div>
  );
}

PeriodRecordField.propTypes = {
  form: PropTypes.object,
};
