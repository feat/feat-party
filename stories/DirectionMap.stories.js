import React from 'react';
import DirectionMap from '@/components/DirectionMap';

export default {
  title: 'DirectionMap',
  component: DirectionMap,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}

const target = {
  lat: 23.451508,
  lng: 113.986024,
}

const origin = {
  lat: 22.950720, 
  lng: 113.863400,
}
export const Target = () => (
  <div style={style}>
    <DirectionMap
      target={target}
      provider="gaode"
    />
  </div>
)
export const Source_Target = () => (
  <div style={style}>
    <DirectionMap
      target={target}
      origin={origin}
      provider="gaode"
    />
  </div>
)