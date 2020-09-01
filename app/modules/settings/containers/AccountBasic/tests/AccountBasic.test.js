import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { normalize } from 'normalizr';

import 'jest-dom/extend-expect';

import LanguageProvider from '@/modules/language/containers/LanguageProvider';

import { configureStore } from '@/store';
import { setIntl } from '@/services/intl';


import { profile as profileSchema } from '@/schema';
import {
  fetchProfile,
} from '@/modules/settings/actions/profile';
import {
  setCurrentUser,
} from '@/modules/auth/actions';

import { profile } from '@mock/profile';

import AccountBasic from '../index';

const getStore = () => {
  const store = configureStore({
    language: {
      locale: 'en',
    },
  });
  const intlProvider = new IntlProvider({ locale: 'en', messages: {} });
  const { intl } = intlProvider.getChildContext();
  setIntl(intl);
  return store;
}

describe('AccountBasic', () => {
  let store;
  beforeEach(() => {
    store = getStore();
    store.dispatch(setCurrentUser({
      user: profile.uid,
      entities: {
        users: {
          [profile.uid]: {
            uid: profile.uid,
            username: "Kyra Wolff",
          },
        },
      },
    }))
  })
  afterEach(() => {
    cleanup();
    store = undefined;
  });
  describe('Block Render', () => { 
    it('render', async () => {
      const normalized = normalize(profile, profileSchema);
      
      store.dispatch(fetchProfile.success({
        entities: normalized.entities,
      }))
      const { getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <AccountBasic  />
          </LanguageProvider>
        </Provider>,
      );
      expect(getByText('User ID')).toBeInTheDocument();
      expect(getByText('Basic')).toBeInTheDocument();
    });
    it('can set home domain if has not set before', async () => {
      const normalized = normalize({
        ...profile,
        home_domain: profile.uid,
      }, profileSchema);
      store.dispatch(fetchProfile.success({
        entities: normalized.entities,
      }))

      const { container } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <AccountBasic  />
          </LanguageProvider>
        </Provider>,
      );
      const inputDom = container.querySelector('[name="home_domain"]');
      expect(inputDom).not.toHaveAttribute('disabled')
      fireEvent.change(inputDom, { target: { value: 'demo'}});
      expect(inputDom.value).toBe('demo');
      // const submitBtn = container.querySelector('[type="submit"]');
      // expect(submitBtn).not.toHaveAttribute('disabled');
    
      // TODO: mock axios request and test submit
    });
  });
});
