import React from 'react';
import { action } from '@storybook/addon-actions';
import PinMap from '@/components/PinMap';

export default {
  title: 'PinMap',
  component: PinMap,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}

const latlng = {
  lat: 22.964770, 
  lng: 113.307405,
}


export const Example = () => (
  <div style={style}>
    <PinMap
      initialValue={latlng}
      provider='google'
      onChange={action('onChange')}
    />
  </div>
)
