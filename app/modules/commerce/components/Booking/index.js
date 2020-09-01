import React from 'react';
import PropTypes from 'prop-types';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import TimeItem from './TimeItem';

import intlMessages from '../../messages';

// const getDateString = (start, end) => {
//   const startDate = new Date(start).toLocaleDateString();
//   const endDate = new Date(end).toLocaleDateString();
//   if (startDate === endDate) {
//     return ` on ${startDate}`;
//   }
//   return `start on ${startDate}`;
// };

const Booking = ({ start, end }) => {
  const message = end ? 'rangeBooking' : 'timeBooking';

  const startDate = new Date(start);

  return (
    <div className="BookingInfo">
      <TranslatableMessage
        message={intlMessages[message]}
        values={{
          startTime: <TimeItem date={startDate} />,
          endTime: end ? <TimeItem date={new Date(end)} /> : undefined,
          date: startDate.toLocaleDateString(),
        }}
      />
    </div>
  );
  // <div className="BookingInfo">
  //   <span className="BookingInfo__time">
  //     <TimeItem date={getDate(start)} />
  //     {end && <span className="padding_x_5">--</span>}
  //     {end && <TimeItem date={getDate(end)} />}
  //   </span>
  //   <span className="BookingInfo__date">{getDateString(start, end)}</span>
  // </div>
};

Booking.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
};

export default Booking;
