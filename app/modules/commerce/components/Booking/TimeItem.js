import React from 'react';
import PropTypes from 'prop-types';

const TimeItem = ({ date }) => {
  const hours = `0${date.getHours()}`.substr(-2);
  const minutes = `0${date.getMinutes()}`.substr(-2);
  // const isPM = hours > 11;
  return (
    <span className="BookingTimeItem">
      {/* <span className="BookingTimeItem__symbol">{isPM ? 'PM' : 'AM'}</span> */}
      <span className="BookingTimeItem__compo">{hours}</span>
      <span className="BookingTimeItem__separator">:</span>
      <span className="BookingTimeItem__compo">{minutes}</span>
    </span>
  );
};

TimeItem.propTypes = {
  date: PropTypes.instanceOf(Date),
};

export default TimeItem;
