import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { dateCompos } from '@/messages/common';

import FlatSelect from '@feat/feat-ui/lib/flat-select';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from './messges';

import './style.scss';

const MIN_DURATION = 60;

class MonthView extends React.Component {
  state = {
    day: '',
    hour: '',
    minute: '',
    MM: this.props.month,
  };

  monthView = (month) => {
    const { freePeriods } = this.props;
    const monthStart = moment(month);
    const monthEnd = moment(month).add(30, 'day');
    const monthStartDay = monthStart.days();
    const monthEndDay = monthEnd.days();
    const viewDateBegin = monthStart.add(-monthStartDay, 'day');
    const viewDateEnd = monthEnd.add(7 - monthEndDay, 'day');

    const dateList = [];
    const day = viewDateBegin;
    do {
      dateList.push({
        label: day.format('D'),
        value: day.format('YYYYMMDD'),
        disabled:
          day < moment(month) ||
          !freePeriods.some(
            (item) => (
              moment(item.start_time).format('MMDD') === day.format('MMDD') &&
              item.duration >= MIN_DURATION
            ),
          ),
      });
      day.add(1, 'day');
    } while (day.format('YYYYMMDD') !== viewDateEnd.format('YYYYMMDD'));
    return dateList;
  };

  hourView = (date) => {
    const hoursList = [];
    const { freePeriods } = this.props;
    const openDay = freePeriods.filter(
      (item) => (
        moment(item.start_time).format('YYYYMMDD') === date && 
        item.duration >= MIN_DURATION
        // moment(item.end_time).diff(item.start_time) >= 3600000 // period is at least one hour.
      ),
    );
    const day = !date ? moment() : moment(date);
    for (let i = 0; i < 24; i += 1) {
      const startHour = day.hour(i);
      hoursList.push({
        label: moment()
          .hour(i)
          .format('HH'),
        value: moment()
          .hour(i)
          .format('HH'),
        disabled:
          openDay.length !== 0 &&
          openDay.filter(
            (item) =>
              startHour >= new Date(moment(item.start_time).subtract(59, 'minutes')) &&
              startHour < new Date(moment(item.end_time).subtract(59, 'minute')) &&
              startHour > moment(),
          ).length !== 0,
      });
    }
    return hoursList;
  };

  minuteView = () => {
    const hoursList = [];
    const { freePeriods } = this.props;
    const openDay = freePeriods.filter(
      (item) => moment(item.start_time).format('YYYYMMDD') === this.state.day,
    );
    const day = !this.state.day ? moment() : moment(this.state.day);
    const hour = !this.state.hour ? day.hour(0) : day.hour(this.state.hour);
    for (let i = 0; i < 60; i += 5) {
      const startMinute = hour.minute(i);
      hoursList.push({
        label: moment()
          .minute(i)
          .format('mm'),
        value: moment()
          .minute(i)
          .format('mm'),
        disabled:
          openDay.length !== 0 &&
          openDay.filter(
            (item) =>
              startMinute >= new Date(item.start_time) &&
              startMinute < new Date(moment(item.end_time).subtract(59, 'minute')),
          ).length !== 0,
      });
    }
    return hoursList;
  };

  handleDayChange = (day) => {
    // const { freePeriods } = this.props;
    if (this.state.hour && this.state.minute) {
      this.props.onChange({
        date: moment(day)
          .hour(this.state.hour)
          .minute(this.state.minute),
      });
    }
    // const disableDay = freePeriods.find(
    //   (item) => moment(item.start_time).format('YYYYMMDD') === day,
    // );
    this.setState({ day });
  };

  handleHourChange = (hour) => {
    if (this.state.day && this.state.minute) {
      this.props.onChange({
        date: moment(this.state.day)
          .hour(hour)
          .minute(this.state.minute),
      });
    }
    this.setState({ hour });
  };

  handleMinuteChange = (minute) => {
    if (this.state.day && this.state.hour) {
      this.props.onChange({
        date: moment(this.state.day)
          .hour(this.state.hour)
          .minute(minute),
      });
    }
    this.setState({ minute });
  };

  handleSubtractMonth = () => {
    const M = moment(this.state.MM).subtract('month', 1);
    this.setState({
      MM: M.format('YYYY-MM-DD'),
    });
  };

  handleAddMonth = () => {
    const M = moment(this.state.MM).add('month', 1);
    this.setState({
      MM: M.format('YYYY-MM-DD'),
    });
  };

  disableTime = (day) => {
    const points = [];
    const disTime = [];
    const startHour = moment(day).hour(0);
    const endHour = moment(day)
      .hour(23)
      .minute(59)
      .second(59);
    const { freePeriods } = this.props;
    const disDay = freePeriods.filter(
      (item) =>
        moment(item.start_time).format('YYYYMMDD') === day ||
        moment(item.end_time).format('YYYYMMDD') === day,
    );
    disDay.forEach((item) => {
      points.push(moment(item.start_time));
      points.push(moment(item.end_time));
    });
    if (points[0] > startHour) {
      points.unshift(startHour);
    } else {
      points.shift();
    }
    if (points[points.length - 1] < endHour) {
      points.push(endHour);
    } else {
      points.pop();
    }
    for (let i = 0; i < points.length; i += 2) {
      disTime.push({
        start_time: points[i],
        end_time: points[i + 1],
      });
    }
    return disTime;
  };

  render() {
    const monthDate = this.monthView(this.state.MM);
    const weekdaysShort = moment.weekdaysShort();
    const hours = this.hourView(this.state.day);
    const minutes = this.minuteView();
    const disableTime = this.disableTime(this.state.day);
    return (
      <div
        className={classNames('MonthView margin_t_12', {
          'is-mobile': this.props.isMobile,
        })}
      >
        {/* <div className="MonthView__month">
          <div>
            <Button onClick={this.handleSubtractMonth}>&lt;</Button>
            <span>{`${moment(this.state.MM).format('M')} 月`}</span>
            <Button onClick={this.handleAddMonth}>&gt;</Button>
          </div>
        </div> */}
        <div className="MonthView__left">
          {/* date */}
          <div className="MonthView__compo MonthView__compo_date">
            <div className="MonthView__label">
              <TranslatableMessage message={dateCompos.date} />
            </div>
            <div className="MonthView__weekdays">
              {weekdaysShort.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>
            <FlatSelect
              onChange={this.handleDayChange}
              value={this.state.day}
              className="MonthView__optionSelect"
            >
              {monthDate.map((item) => (
                <Button
                  value={item.value}
                  disabled={item.disabled}
                  key={item.value}
                >
                  <div
                    style={{
                      textAlign: 'right',
                      width: '1rem',
                      margin: ' 0 auto',
                    }}
                  >
                    {item.label}
                  </div>
                </Button>
              ))}
            </FlatSelect>
          </div>
          <div className="MonthView__compo MonthView__compo_hour">
            <div className="MonthView__label">
              <TranslatableMessage message={dateCompos.hour} />
            </div>
            <FlatSelect
              onChange={this.handleHourChange}
              value={this.state.hour}
              className="MonthView__optionSelect"
            >
              {hours.map((hour) => (
                <Button
                  value={hour.value}
                  disabled={this.state.day ? !hour.disabled : true}
                  key={hour.value}
                >
                  {hour.label}
                </Button>
              ))}
            </FlatSelect>
          </div>
          <div className="MonthView__compo MonthView__compo_minute">
            <div className="MonthView__label">
              <TranslatableMessage message={dateCompos.minute} />
            </div>
            <FlatSelect
              onChange={this.handleMinuteChange}
              value={this.state.minute}
              className="MonthView__optionSelect"
            >
              {minutes.map((minute) => (
                <Button
                  value={minute.value}
                  disabled={this.state.hour ? !minute.disabled : true}
                  key={minute.value}
                >
                  {minute.label}
                </Button>
              ))}
            </FlatSelect>
          </div>
        </div>
        <div className="MonthView__right">
          <div className="DatePicker__disableTime">
            <div className="DatePicker__disable_prompt">
              {this.state.day ? (
                <TranslatableMessage
                  message={intlMessages.followingIsNotAvailable}
                />
              ) : (
                <TranslatableMessage message={intlMessages.allAreAvailable} />
              )}
            </div>
            {this.state.day &&
              disableTime.map((item, index) => (
                <div key={index} className="DatePicker__disable">
                  <span className="DatePicker__disable_box">
                    {item.start_time.format('HH')}
                  </span>
                  <span className="DatePicker__disable_dot">:</span>
                  <span className="DatePicker__disable_box">
                    {item.start_time.format('mm')}
                  </span>
                  <span className="DatePicker__disable_dot">-</span>
                  <span className="DatePicker__disable_box">
                    {item.end_time.format('HH')}
                  </span>
                  <span className="DatePicker__disable_dot">:</span>
                  <span className="DatePicker__disable_box">
                    {item.end_time.format('mm')}
                  </span>
                </div>
              ))}
          </div>
          <div className="MonthView__show">
            <div className="MonthView__prompt">
              <TranslatableMessage
                message={intlMessages.selectedDurationDesc}
              />
            </div>
            {this.state.hour && this.state.minute ? (
              <div className="DatePicker__show">
                <TranslatableMessage
                  message={intlMessages.durationInfo}
                  values={{
                    startHour: (
                      <span className="DatePicker__show_box">
                        {this.state.hour}
                      </span>
                    ),
                    startMinute: (
                      <span className="DatePicker__show_box">
                        {this.state.minute}
                      </span>
                    ),
                    endHour: (
                      <span className="DatePicker__show_box">
                        {moment()
                          .hour(this.state.hour)
                          .add(1, 'hour')
                          .format('HH')}
                      </span>
                    ),
                    endMinute: (
                      <span className="DatePicker__show_box">
                        {this.state.minute}
                      </span>
                    ),
                    date: (
                      <span className="DatePicker__show_date">
                        {moment(this.state.day).format('dddd MMMM D')}
                      </span>
                    ),
                  }}
                />
              </div>
            ) : (
              <div className="DatePicker__show">
                <TranslatableMessage
                  message={intlMessages.selectStartTimeHint}
                />
                {/* <TranslatableMessage
                  message={intlMessages.dateInfo}
                  values={{
                    date: (
                      <span className="DatePicker__show_date">
                        {moment(this.state.month).format('dddd MMMM D')}
                      </span>
                    ),
                  }}
                /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

MonthView.propTypes = {
  month: PropTypes.object,
  freePeriods: PropTypes.array,
  onChange: PropTypes.func,
  isMobile: PropTypes.bool,
};

MonthView.defaultProps = {
  month: new Date(),
};

export default MonthView;
