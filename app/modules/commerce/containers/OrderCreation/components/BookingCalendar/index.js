import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MonthView from '../MonthView';

class BookingCalendar extends Component {
  state = {};

  handleChange = (value) => {
    /* eslint-disable */
    this.setState({
      start: value.date
        .clone()
        .startOf('minute')
        .toDate(),
      end: value.date
        .clone()
        .startOf('minute')
        .add(1, 'hour')
        .toDate(),
    });
    /* eslint-enable */
  };

  render() {
    const { freePeriods, isMobile } = this.props;
    return (
      <MonthView
        isMobile={isMobile}
        freePeriods={freePeriods}
        month={new Date()}
        onChange={this.handleChange}
      />
    );
  }
}

BookingCalendar.propTypes = {
  freePeriods: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string,
      end_time: PropTypes.string,
    }),
  ),
  isMobile: PropTypes.bool,
};

export default BookingCalendar;
