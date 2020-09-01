import React from 'react';
import MAddressSelectPanel from './MAddressSelectPanel';
import AddressSelectPanel from './AddressSelectPanel';

export default function Panel(props) {
  if (props.isMobile) {
    return <MAddressSelectPanel {...props} />;
  }
  return <AddressSelectPanel {...props} />;
}
