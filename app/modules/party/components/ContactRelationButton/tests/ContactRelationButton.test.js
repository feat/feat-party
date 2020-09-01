import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import LanguageProvider from '@/modules/language/containers/LanguageProvider';
import { IntlProvider } from 'react-intl';
import 'jest-dom/extend-expect';

import { configureStore } from '@/store';
import { setLocale } from '@/modules/language/actions';
import { setIntl } from '@/services/intl';
import ContactRelationButton from '../index';
import {
  CONTACT_LIST_STATUS_STRANGER,
  CONTACT_LIST_STATUS_RECALLED,
  CONTACT_LIST_STATUS_REJECTED,
  CONTACT_LIST_STATUS_APPLYING,
  CONTACT_LIST_STATUS_CREATING,
} from '../../../constants';

describe('Contact Relation Button', () => {
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
  describe('Stranger', () => {
    it('render', () => {
      const { getByText, getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_STRANGER}
              userId={2}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      expect(getByText('Build Relationship')).toBeInTheDocument();
      expect(
        getByText('Wanna to build friend relationship? Send request now.'),
      ).toBeInTheDocument();
    });
  });

  describe('Recalled', () => {
    it('render', () => {
      const postFriendRequest = jest.fn();
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_RECALLED}
              userId={2}
              postFriendRequest={postFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      expect(getByText('Build Relationship')).toBeInTheDocument();
      expect(
        getByText('Wanna to build friend relationship? Send request now.'),
      ).toBeInTheDocument();
    });
    it('confirm action', () => {
      const postFriendRequest = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_RECALLED}
              userId={2}
              postFriendRequest={postFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      const okBtn = getByLabelText('confirm');
      expect(okBtn).toBeInTheDocument();
      fireEvent.click(okBtn);
      expect(postFriendRequest).toHaveBeenCalled();
    });
    it('cancel action', () => {
      const postFriendRequest = jest.fn();
      const { getByText, getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_RECALLED}
              userId={2}
              postFriendRequest={postFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      const cancelBtn = getByLabelText('cancel');
      expect(cancelBtn).toBeInTheDocument();
      fireEvent.click(cancelBtn);
      expect(() => getByText('Build Relationship')).toThrow();
    });
  });

  describe('Rejected', () => {
    it('render', () => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_REJECTED}
              userId={2}
            />
          </LanguageProvider>
        </Provider>,
      );

      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      expect(getByText('Build Relationship')).toBeInTheDocument();
      expect(
        getByText(
          'Last friend request has been rejected. Wanna to send friendrequest again?',
        ),
      ).toBeInTheDocument();
    });

    it('confirm action', () => {
      const postFriendRequest = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_REJECTED}
              userId={2}
              postFriendRequest={postFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const confirmBtn = getByLabelText('confirm');
      fireEvent.click(confirmBtn);
      expect(postFriendRequest).toHaveBeenCalled();
      expect(postFriendRequest.mock.calls[0][0]).toEqual({ userId: 2 });
    });

    it('cancel action', () => {
      const postFriendRequest = jest.fn();
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_REJECTED}
              userId={2}
              postFriendRequest={postFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const cancelBtn = getByLabelText('cancel');
      fireEvent.click(cancelBtn);
      expect(() => getByText('Build Relationship')).toThrow();
    });
  });

  describe('Request Sent', () => {
    it('render', () => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_CREATING}
              userId={2}
            />
          </LanguageProvider>
        </Provider>,
      );

      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      expect(getByText('Friend Request Has Sent')).toBeInTheDocument();
      expect(
        getByText('Do you want to cancel friend request?'),
      ).toBeInTheDocument();
    });
    it('confirm action, (recall request)', () => {
      const recallFriendRequest = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_CREATING}
              userId={2}
              recallFriendRequest={recallFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const confirmBtn = getByLabelText('confirm');
      fireEvent.click(confirmBtn);
      expect(recallFriendRequest).toHaveBeenCalled();
      expect(recallFriendRequest.mock.calls[0][0]).toEqual({ userId: 2 });
    });

    it('cancel action', () => {
      const recallFriendRequest = jest.fn();
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_CREATING}
              userId={2}
              recallFriendRequest={recallFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const cancelBtn = getByLabelText('cancel');
      fireEvent.click(cancelBtn);
      expect(() =>
        getByText('Do you want to cancel friend request?'),
      ).toThrow();
    });
  });

  describe('Request Received', () => {
    it('render', () => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_APPLYING}
              userId={2}
            />
          </LanguageProvider>
        </Provider>,
      );

      const button = getByLabelText('relation-button');
      expect(button).not.toBe(null);
      fireEvent.click(button);
      expect(getByText('Friend Request Received')).toBeInTheDocument();
      expect(
        getByText('Confirmed to build friend relationship?'),
      ).toBeInTheDocument();
    });

    it('accept friend request', () => {
      const acceptFriendRequest = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_APPLYING}
              userId={2}
              acceptFriendRequest={acceptFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const acceptBtn = getByLabelText('accept');
      fireEvent.click(acceptBtn);
      expect(acceptFriendRequest).toHaveBeenCalled();
      expect(acceptFriendRequest.mock.calls[0][0]).toEqual({ userId: 2 });
    });

    it('reject firend request', () => {
      const rejectFriendRequest = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <LanguageProvider locale="en" lastUpdatedAt="_TMP_" messages={{}}>
            <ContactRelationButton
              status={CONTACT_LIST_STATUS_APPLYING}
              userId={2}
              rejectFriendRequest={rejectFriendRequest}
            />
          </LanguageProvider>
        </Provider>,
      );
      const button = getByLabelText('relation-button');
      fireEvent.click(button);
      const rejectBtn = getByLabelText('reject');
      fireEvent.click(rejectBtn);
      expect(rejectFriendRequest).toHaveBeenCalled();
      expect(rejectFriendRequest.mock.calls[0][0]).toEqual({ userId: 2 });
    });
  });
});
