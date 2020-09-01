import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import 'jest-dom/extend-expect';

import { configureStore } from '@/store';
import AddressSelectPanel from '../index';

describe('AddressPanel', () => {
  let store;
  const addresses = [
    {
      id: 1,
      contact_name: 'Contact User',
      phone: '+86-13427559900',
    },
  ];
  beforeAll(() => {
    store = configureStore({});
  });
  afterEach(cleanup);
  describe('render', () => {
    it('should render properly, no user_addresses, no current location', () => {
      const { getByText } = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <AddressSelectPanel
              addresses={[]}
              getCurrentLocationError={new Error()}
              geoLocation={{
                coords: {
                  latitude: 23.9329877,
                  longitude: 114.059957,
                },
              }}
            />
          </IntlProvider>
        </Provider>,
      );
      expect(getByText('Select an address')).toBeInTheDocument();
      expect(getByText('New Address')).toBeInTheDocument();
    });
    it('should render properly, no current location, has user addresses', () => {
      const { getByText } = render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <AddressSelectPanel
              addresses={addresses}
              geoLocation={{
                coords: {
                  latitude: 23.9329877,
                  longitude: 114.059957,
                },
              }}
            />
          </IntlProvider>
        </Provider>,
      );
      expect(getByText('Select an address')).toBeInTheDocument();
      expect(getByText('Contact User')).toBeInTheDocument();
      expect(getByText('+86-13427559900')).toBeInTheDocument();
    });
  });
});
