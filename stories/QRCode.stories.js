import React from 'react';
import QRCode from '@/components/QRCode';

export default {
  title: 'QRCode',
  component: QRCode,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}

export const Example = () => (
  <div style={style}>
    <QRCode
      text="https://www.feat.com"
    />
  </div>
)
