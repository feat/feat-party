import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatSelect from '@feat/feat-ui/lib/flat-select';
import Button from '@feat/feat-ui/lib/button';

import moment from 'moment';

import './index.scss';

class PeriodSelect extends Component {
  state = {
    event: this.props.value,
    dateStart: new Date(),
    date: '',
    time: '',
  };

  getRanges = (date) => {
    const start = new Date(moment(date).format('YYYY MM DD'));
    const end = new Date(
      moment(start)
        .add(12, 'day')
        .format('YYYY MM DD'),
    );
    let current = start;
    const range = [];
    while (!moment(current).isSame(end)) {
      range.push(current);
      current = new Date(
        moment(current)
          .add(1, 'day')
          .format('YYYY MM DD'),
      );
    }

    return range;
  };

  getDate = () => {
    const { freePeriods } = this.props;
    const userDate = [];
    freePeriods.forEach((item) => {
      const date = moment(item.start_time).format('YYYYMMDD');
      userDate.push(date);
    });
    return userDate;
  };

  getHours = (date) => {
    const { freePeriods } = this.props;
    const opentime = freePeriods.filter(
      (item) => moment(item.start_time).format('YYYY MM DD') === date,
    );
    const hours = [];
    const day = !date ? new Date() : new Date(date);
    for (let i = 0; i < 24; i += 1) {
      const startHour = moment(day).set({ hour: i, minute: 0 });
      hours.push({
        disabled: startHour < new Date(),
        notime:
          opentime.length !== 0 &&
          opentime.filter(
            (item) =>
              startHour >= new Date(item.start_time) &&
              startHour < new Date(item.end_time),
          ).length !== 0,
        startHour: startHour.format('HH'),
        endHour: startHour.add(1, 'hours').format('HH'),
      });
    }
    return hours;
  };

  handleDateChange = (date) => {
    this.setState({
      date,
      time: '',
      event: { start: new Date(date), end: new Date(date) },
    });
    this.props.onChange && this.props.onChange({});
  };

  handleTimeChange = (time) => {
    const hour = time.split('-');
    this.setState(
      {
        time,
        event: {
          start: new Date(this.state.event.start.setHours(hour[0])),
          end: new Date(this.state.event.end.setHours(hour[1])),
        },
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.event);
      },
    );
  };

  render() {
    const { mode } = this.props;
    const time = this.getRanges(this.state.dateStart);
    const hours = this.getHours(this.state.date);
    const userdate = this.getDate();
    return (
      <div className="PeriodSelect">
        <div className="PeriodSelect__inner">
          <div className="PeriodSelect__column PeriodSelect__column_date">
            <h4 className="PeriodSelect__header">Date</h4>
            <FlatSelect
              gridSpan={12}
              className="PeriodSelect__date"
              value={this.state.date}
              onChange={this.handleDateChange}
            >
              {time.map((date) => (
                <Button
                  value={moment(date).format('YYYY MM DD')}
                  className="PeriodSelect__option PeriodSelect__option_date"
                  disabled={
                    userdate.indexOf(moment(date).format('YYYYMMDD')) === -1
                  }
                >
                  <div className="PeriodSelectOption__date">
                    {moment(date).format('YYYY MM DD')}
                  </div>
                  <div className="PeriodSelectOption__day">
                    {moment(date).format('dddd')}
                  </div>
                </Button>
              ))}
            </FlatSelect>
          </div>
          <div className="PeriodSelect__column PeriodSelect__column_time">
            <h4 className="PeriodSelect__header">Time</h4>
            <FlatSelect
              gridSpan={6}
              className="PeriodSelect__time"
              value={this.state.time}
              onChange={this.handleTimeChange}
            >
              {hours.map((hour) => (
                <Button
                  className="PeriodSelect__option PeriodSelect__option_time"
                  value={`${hour.startHour}-${hour.endHour}`}
                  disabled={!this.state.event || hour.disabled || !hour.notime}
                >
                  {mode === 'range' &&
                    `${hour.startHour}:00 - ${hour.endHour}:00`}
                  {mode === 'point' && `${hour.startHour}:00`}
                </Button>
              ))}
            </FlatSelect>
          </div>
        </div>
      </div>
    );
  }
}

PeriodSelect.propTypes = {
  value: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
  onChange: PropTypes.func,
  freePeriods: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string,
      end_time: PropTypes.string,
    }),
  ),
  mode: PropTypes.oneOf(['range', 'point']),
};

export default PeriodSelect;
