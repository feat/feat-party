import React from 'react';
import WeekdayWidget from '@/components/WeekdayWidget';

export default {
  title: 'WeekdayWidget',
  component: WeekdayWidget,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}

export const Example = () => (
  <div style={style}>
    <WeekdayWidget selected={[3, 5]} />
  </div>
)