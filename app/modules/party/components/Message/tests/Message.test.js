import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import LanguageProvider from '@/modules/language/containers/LanguageProvider';
import { IntlProvider } from 'react-intl';
import 'jest-dom/extend-expect';

import { configureStore } from '@/store';
import { setLocale } from '@/modules/language/actions';
import { setIntl } from '@/services/intl';

import BaseMessage from '../BaseMessage';
import TextMessage from '../TextMessage';

import { messages, currentUser, groupContact } from './data';
import {
  MESSAGE_TYPE_FRIEND_IM,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_GROUP_PM,
} from '../../../constants';

describe('Party Messages', () => {
  let store;

  beforeAll(() => {
    store = configureStore({});
    store.dispatch(setLocale({ locale: 'en' }));
    const intlProvider = new IntlProvider({ locale: 'en', messages: {} });
    const { intl } = intlProvider.getChildContext();
    setIntl(intl);
    global.FEAT_PARTY = {};
  });
  afterEach(cleanup);
  describe('Base Message', () => {
    it('render', () => {
      const message = {
        content: 'Base Message',
      };
      const { getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <BaseMessage message={message} />
          </LanguageProvider>
        </Provider>,
      );

      const content = getByText('Base Message');
      expect(content).toBeInTheDocument();
    });
  });

  describe('TextMessage', () => {
    it('Friend IM', () => {
      const message = messages[MESSAGE_TYPE_FRIEND_IM];
      const { getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <TextMessage currentUser={currentUser} message={message} />
          </LanguageProvider>
        </Provider>,
      );

      const content = getByText(message.content);
      expect(content).toBeInTheDocument();
      // TODO: test message desc
    });

    it('Group IM', () => {
      const message = messages[MESSAGE_TYPE_GROUP_IM];
      const { getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <TextMessage
              contact={groupContact}
              currentUser={currentUser}
              isToCurreont
              message={message}
            />
          </LanguageProvider>
        </Provider>,
      );

      const content = getByText(message.content);
      expect(content).toBeInTheDocument();
    });

    it('Group PM', () => {
      const message = messages[MESSAGE_TYPE_GROUP_PM];
      const { getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <TextMessage
              contact={groupContact}
              currentUser={currentUser}
              isToCurreont
              message={message}
            />
          </LanguageProvider>
        </Provider>,
      );

      const content = getByText(message.content);
      expect(content).toBeInTheDocument();
    });
  });
});
