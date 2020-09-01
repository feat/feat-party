import React from 'react';
import { storiesOf } from '@storybook/react';

import { Provider } from 'react-redux';

import partyMessage from './partyMessage.json';
import LanguageProvider from '@/modules/language/containers/LanguageProvider';
import { configureStore } from '@/store';

import '@/styles/main.scss';
import '@/modules/party/components/ChatView/style.scss';
import Message from '@/modules/party/containers/Message';
import en from '@/translations/en.json';

const { data, messageType, currentUser } = partyMessage;


const store = configureStore({
  language: {
    locale: 'en',
    localeLabel: 'English',
    translations: {
      en,
    },
    useTranslations: {
      en: {},
    },
    fetched: {
      en: true,
    },
  },
});

const withProvider = (story) => (
  <Provider store={store}>
    <LanguageProvider>{story()}</LanguageProvider>
  </Provider>
);

const stories = storiesOf('Party Message', module).addDecorator(withProvider);
Object.keys(messageType).forEach((typeDes) => {
  stories.add(`[${messageType[typeDes]}] ${typeDes}`, () => {
    const type = messageType[typeDes];
    const mData = data.filter((item) => item.message_type === type);
    return (
      <div style={{ width: '80%', padding: 24 }}>
        <div>{`${typeDes}: ${type}`}</div>
        <div
          className="IM-ChatView__Content IM-ChatView__Content_inbox" style={{
            width: 345,
            minHeight: 500,
            paddingTop: 14,
          }}>
          {mData.map((message) => (
            <Message
              key={message.id}
              message={message}
              currentUser={currentUser}
              tabItem="archive"
            />
          ))}
        </div>
      </div>
    );
  });
});
