import React from 'react';
import CountdownBase from '@feat/feat-ui/lib/flip-counter/Base';

import './style.scss';

class DateCountDown extends CountdownBase {
  render() {
    const { diff } = this.state;
    return (
      <div className="cm-DateCountDown">
        {!!diff.days && (
          <div className="cm-DateCountDown__comp cm-DateCountDown__day">
            {diff.days} 天
          </div>
        )}
        <div className="cm-DateCountDown__comp cm-DateCountDown__hours">
          {this.getFormattedVal(diff.hours)}
        </div>
        :
        <div className="cm-DateCountDown__comp cm-DateCountDown__minutes">
          {this.getFormattedVal(diff.minutes)}
        </div>
        :
        <div className="cm-DateCountDown__comp cm-DateCountDown__seconds">
          {this.getFormattedVal(diff.seconds)}
        </div>
      </div>
    );
  }
}

export default DateCountDown;
