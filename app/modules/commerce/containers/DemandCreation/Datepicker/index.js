import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { formatMessage } from '@/services/intl';
import { dateCompos } from '@/messages/common';

import './style.scss';

const prefix = (num) => `0${num}`.slice(-2);

class Datepicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultDate = moment()
      .add(8, 'days')
      .startOf('minute');
    this.minDate = this.defaultDate.clone().startOf('day');
    const date = props.value ? moment(props.value) : undefined;
    this.state = {
      date,
      startPointer: date ? date.get('hours') + date.get('minutes') / 60 : new Date().getHours() + 1,
    }
  }

  triggerChange = () => {
    if (!this.state.date) {
      this.state.date = this.minDate.clone();
    }
    const date = this.state.date.clone();
    // const minutes = this.state.startPointer * 60;
    const hour = Math.floor(this.state.startPointer);
    date.set('hour', hour).set('minute', (this.state.startPointer - hour) * 60);
    this.props.onChange && this.props.onChange(date.isAfter(this.minDate) ? date : undefined);
  };

  handlePointerInput = (e) => {
    this.setState({
      startPointer: e.target.value,
    }, this.triggerChange);
  };

  updateDateCompo = (compo, val) => {
    const m = (this.state.date || this.defaultDate).clone();
    m.set(compo, val);
    if (compo === 'month') {
      if (val < this.defaultDate.get('month')) {
        m.set('year', this.defaultDate.get('year') + 1)
      } else {
        m.set('year', this.defaultDate.get('year'))
      }
    }
    this.setState({
      date: m,
    }, this.triggerChange);
  }

  formatTime() {
    const { startPointer } = this.state;
    const hour = Math.floor(startPointer);
    const minute = (startPointer - hour) * 60;
    return `${prefix(hour)}:${prefix(minute)}`;
  }

  renderMonths() {
    const m = this.defaultDate.clone();
    return (
      <div className="cm-DemandDateTimePicker__options cm-DemandDateTimePicker__options_m">
        {[...new Array(12)].map((_, i) => {
          const month = m.get('month')
          const el = <button
            type="button"
            key={i}
            className={classNames("cm-DemandDateTimePicker__option cm-DemandDateTimePicker__option_m", {
              'is-selected': this.state.date && this.state.date.get('month') === month,
            })}
            onClick={() => {
              this.updateDateCompo('month', month)
            }}
          >
            {m.format('MMM')}
          </button>
          m.add(1, 'month')
          return el
        })}
      </div>
    )
  }

  renderDates() {
    const m = (this.state.date || this.defaultDate).clone();
    const daysCount = m.daysInMonth();
    const currentDate = m.get('date');
    return (
      <div className="cm-DemandDateTimePicker__options cm-DemandDateTimePicker__options_d">
        {[...new Array(daysCount)].map((_, i) => {
          const val = i + 1;
          m.set('date', val);
          const el = (
            <button
              type="button"
              key={i}
              className={classNames("cm-DemandDateTimePicker__option cm-DemandDateTimePicker__option_d", {
                'is-selected': this.state.date && this.state.date.isAfter(this.minDate) && currentDate === val,
              })}
              disabled={m.isBefore(this.minDate)}
              onClick={() => {
                this.updateDateCompo('date', val);
              }}
            >
              {val}
            </button>
          )
          return el
        })}
      </div>
    )
  }

  renderHours() {
    const items = [...new Array(12)];
    return (
      <div className="cm-DemandDateTimePicker__compo cm-DemandDateTimePicker__compo_hour">
        {items.map((_, index) => (
          <div
            key={index}
            className={classNames('cm-DemandDateTimePicker__hour', {
              'cm-DemandDateTimePicker__hour_notime':
                index * 2 < this.state.startPointer,
            })}
          >
            {index * 2}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="cm-DemandDateTimePicker" style={{ position: 'relative' }}>
        <div className="cm-DemandDateTimePicker__month">
          <div className="cm-DemandDateTimePicker__label">
            {formatMessage(dateCompos.month)}
          </div>
          <div className="cm-DemandDateTimePicker__compo">
            {this.renderMonths()}
          </div>
        </div>
        <div className="cm-DemandDateTimePicker__day">
          <div className="cm-DemandDateTimePicker__label">
            {formatMessage(dateCompos.date)}
          </div>
          <div className="cm-DemandDateTimePicker__compo">
            {this.renderDates()}
          </div>
        </div>
        <div className="cm-DemandDateTimePicker__time">
          <div className="cm-DemandDateTimePicker__label">
            {formatMessage(dateCompos.time)}
          </div>
          {this.renderHours()}
          <input
            ref={(n) => {
              this.startPointer = n;
            }}
            className="cm-DemandDateTimePicker__timeLine"
            type="range"
            min="0"
            max="24"
            value={this.state.startPointer}
            onChange={this.handlePointerInput}
            step={0.25}
            onMouseDown={() => {
              this.timeHint.style.display = 'block';
            }}
            onMouseUp={() => {
              this.timeHint.style.display = 'none';
              this.triggerChange();
            }}
          />
        </div>
        <div
          ref={(n) => {
            this.timeHint = n;
          }}
          className="cm-DemandDateTimePicker__timeHint"
          style={{ display: 'none' }}
        >
          {this.formatTime()}
        </div>
      </div>
    );
  }
}

Datepicker.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export default Datepicker;
