import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '@/modules/auth/selectors';

import IMMessageViewer from '../../components/IMMessageViewer';

import Message from '../Message';

import {
  fetchInboxMessages,
  roomMarkAsRead,
  syncBroadcastMessages,
  sendMessage,
} from '../../actions';

import {
  selectRoomInfo,
  selectRoomContact,
  selectRoomInboxState,
  selectContacts,
} from '../../selectors';
import { GLOBAL_ROOM } from '../../constants';
import IMCover from '../../components/IMCover';

class InboxMessageViewer extends Component {
  componentDidMount() {
    // this.mayNeedMarkAsRead = true;
    if (
      this.props.tabState &&
      this.props.tabState.shouldFetchBroadcastMessage
    ) {
      this.fetchBroadcastMessage();
    }
    this.tryToFetchData();
    window.addEventListener('focus', this.handlePageFocus);
  }

  // componentWillUpdate(nextProps) {
  //   if (nextProps.roomId !== this.props.roomId) {
  //     this.mayNeedMarkAsRead = true;
  //   }
  // }

  componentDidUpdate() {
    this.tryToFetchData();
    // if (this.shouldMarkAsRead()) {
    //   this.props.roomMarkAsRead({
    //     roomId: this.props.roomId,
    //   });
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.handlePageFocus);
  }

  handlePageFocus = () => {
    const unreadCount = get(this.props, 'roomContact.unread_count');
    if (unreadCount) {
      this.props.roomMarkAsRead({
        roomId: this.props.roomId,
      });
    }
  };

  // shouldMarkAsRead() {
  //   if (!this.mayNeedMarkAsRead) return false;
  //   const unreadCount = get(this.props, 'roomContact.unread_count');
  //   const messageLength = get(this.props, 'tabState.messages.length');
  //   if (unreadCount && messageLength) {
  //     this.mayNeedMarkAsRead = false;
  //     return true;
  //   }
  //   return false;
  // }

  tryToFetchData() {
    const {
      roomId,
      tabState: { initFetched, fetching },
    } = this.props;
    if (!initFetched && !fetching) {
      this.props.fetchInboxMessages({
        roomId,
      });
    }
  }

  fetchBroadcastMessage() {
    const { roomId } = this.props;
    this.props.syncBroadcastMessages({ roomId });
  }

  loadMore = () => {
    const {
      roomId,
      tabState: { reachEnd },
    } = this.props;
    if (reachEnd) {
      return;
    }
    this.props.fetchInboxMessages({
      roomId,
    });
  };

  render() {
    const {
      roomId,
      tabState: { messages, initFetched, fetching, error, reachEnd, loading },
      currentUser,
      roomContact,
      contacts,
      roomInfo,
      sendMessage,
      partyUsed,
    } = this.props;

    if (roomId === GLOBAL_ROOM) {
      if (!initFetched) {
        return <IMCover loading />;
      }
      if (!partyUsed) {
        return <IMCover />
      }
      // if (!messages.length) {
      //   return <IMCover />;
      // }
    }

    return (
      <IMMessageViewer
        key={`${roomId}_INBOX`}
        messages={messages}
        messageComponent={Message}
        initFetched={initFetched}
        fetching={fetching}
        hasMore={!reachEnd}
        error={error}
        contact={roomContact}
        loadMore={this.loadMore}
        currentUser={currentUser}
        contacts={contacts}
        roomInfo={roomInfo}
        sendMessage={sendMessage}
        loading={loading}
      />
    );
  }
}

InboxMessageViewer.propTypes = {
  roomId: PropTypes.string,
  roomContact: PropTypes.object,
  contacts: PropTypes.object,
  currentUser: PropTypes.object,
  tabState: PropTypes.shape({
    messages: PropTypes.array,
    shouldFetchBroadcastMessage: PropTypes.bool,
    initFetched: PropTypes.bool,
    fetching: PropTypes.bool,
    reachEnd: PropTypes.bool,
    error: PropTypes.object,
    loading: PropTypes.bool,
  }),
  fetchInboxMessages: PropTypes.func.isRequired,
  syncBroadcastMessages: PropTypes.func,
  roomMarkAsRead: PropTypes.func.isRequired,
  roomInfo: PropTypes.object,
  sendMessage: PropTypes.func,
  partyUsed: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  roomInfo: selectRoomInfo,
  roomContact: selectRoomContact,
  tabState: selectRoomInboxState,
  contacts: selectContacts,
  partyUsed: (state) => get(state, 'auth.userMeta.party_used', false),
});

export default connect(
  mapStateToProps,
  {
    fetchInboxMessages,
    roomMarkAsRead,
    syncBroadcastMessages,
    sendMessage,
  },
)(InboxMessageViewer);
