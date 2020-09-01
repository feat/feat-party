import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { stringify } from 'query-string';
import { denormalize } from 'normalizr';

import { archiveMessage as archiveMessageSchema } from '@/schema';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectEntities } from '@/modules/entity/selectors';

import IMArchiveViewer from '../../components/IMArchiveViewer';

import Message from '../Message';

import { fetchArchiveMessages, queryArchiveMessages } from '../../actions';

import {
  selectContacts,
  selectRoomArchive,
  selectRoomContact,
  selectRoomActiveFilter,
} from '../../selectors';
import { initialQueryState } from '../../reducers/roomArchive';

class ArchiveMessageViewer extends Component {
  componentDidMount() {
    this.tryToFetchData();
  }

  componentDidUpdate() {
    this.tryToFetchData();
  }

  getListState() {
    const {
      roomActiveFilter,
      roomArchive,
    } = this.props;
    if (roomActiveFilter) {
      const key = stringify(roomActiveFilter);
      return roomArchive.queries[key] || initialQueryState;
    }
    return roomArchive;
  }

  tryToFetchData() {
    const listState = this.getListState();
    if (!listState.initFetched && !listState.fetching) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { roomId, roomActiveFilter } = this.props;
    if (roomActiveFilter) {
      this.props.queryArchiveMessages({
        roomId,
        filter: roomActiveFilter,
      })
    } else {
      this.props.fetchArchiveMessages({
        roomId,
      });
    }
  }

  loadMore = () => {
    const listState = this.getListState();
    if (listState.reachEnd) {
      return;
    }
    this.fetchData();
  };

  renderActiveFilter() {
    const { roomActiveFilter } = this.props;
    if (!roomActiveFilter) {
      return null;
    }
    if (
      roomActiveFilter.keywords && 
      roomActiveFilter.from_date
    ) {
      return (
        <div style={{ marginTop: 24, paddingLeft: 12 }}>
          Keyword: {roomActiveFilter.keywords}, From: {roomActiveFilter.from_date.format('YYYY MM DD')}
        </div>
      )
    }
    if (roomActiveFilter.keywords) {
      return (
        <div style={{ marginTop: 24, paddingLeft: 12 }}>
          Keyword: {roomActiveFilter.keywords}
        </div>
      )
    }
    if (roomActiveFilter.from_date) {
      return (
        <div style={{ marginTop: 24, paddingLeft: 12 }}>
          From: {roomActiveFilter.from_date.format('YYYY MM DD')}
        </div>
      )
    }
    return null;
  }

  render() {
    const {
      roomId,
      // tabState: { messages, initFetched, fetching, error, reachEnd },
      contacts,
      currentUser,
      roomContact,
      entities,
    } = this.props;
    const listState = this.getListState();

    return (
      <>
        {this.renderActiveFilter()}
        <IMArchiveViewer
          key={`${roomId}_ARCHIVE`}
          messages={denormalize(listState.messages, [archiveMessageSchema], entities)}
          initFetched={listState.initFetched}
          fetching={listState.fetching}
          hasMore={!listState.reachEnd}
          error={listState.error}
          messageComponent={Message}
          loadMore={this.loadMore}
          tabItem="archive"
          contacts={contacts}
          currentUser={currentUser}
          contact={roomContact}
        />
      </>
    );
  }
}

ArchiveMessageViewer.propTypes = {
  roomId: PropTypes.string,
  roomArchive: PropTypes.shape({
    messages: PropTypes.array,
    initFetched: PropTypes.bool,
    fetching: PropTypes.bool,
    reachEnd: PropTypes.bool,
    error: PropTypes.object,
    queries: PropTypes.object,
  }),
  roomContact: PropTypes.object,
  roomActiveFilter: PropTypes.object,
  contacts: PropTypes.object,
  fetchArchiveMessages: PropTypes.func.isRequired,
  queryArchiveMessages: PropTypes.func,
  currentUser: PropTypes.object,
  entities: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  roomActiveFilter: selectRoomActiveFilter,
  roomContact: selectRoomContact,
  roomArchive: selectRoomArchive,
  contacts: selectContacts,
  entities: selectEntities,
});

export default connect(
  mapStateToProps,
  {
    fetchArchiveMessages,
    queryArchiveMessages,
  },
)(ArchiveMessageViewer);
