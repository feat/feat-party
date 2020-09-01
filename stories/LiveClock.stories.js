import React from 'react';
import LiveClock from '@/components/LiveClock';

export default {
  title: 'LiveClock',
  component: LiveClock,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}


export const Ticking = () => (
  <div style={style}>
    <LiveClock
      ticking
    />
  </div>
)
