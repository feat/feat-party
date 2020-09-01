import React from 'react';
import StaticMap from '@/components/StaticMap';

export default {
  title: 'StaticMap',
  component: StaticMap,
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
  <StaticMap
    style={style}
    data={latlng}
  />
)
