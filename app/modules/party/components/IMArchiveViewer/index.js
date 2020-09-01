import React from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';
import Button from '@feat/feat-ui/lib/button';

import Loading from '../Loading';
import intlMessages from './messages';

const DELTA = 50;

class ArchiveViewer extends React.PureComponent {
  componentDidMount() {
    if (this.containerDom) {
      this.containerDom.addEventListener('scroll', this.onScroll, true);
      this.containerDom.addEventListener('mousedown', this.handleMouseDown);
      this.containerDom.addEventListener('mousewheel', this.onMouseWheel);
    }
  }

  componentWillUnmount() {
    if (this.containerDom) {
      this.containerDom.removeEventListener('scroll', this.onScroll, true);
      this.containerDom.removeEventListener('mousedown', this.handleMouseDown);
      this.containerDom.removeEventListener('mousewheel', this.onMouseWheel);
    }
  }

  onMouseWheel = (e) => {
    if (!this.containerDom) {
      return;
    }
    if (this.containerDom.scrollTop === 0 && e.deltaY < 0) {
      e.preventDefault();
    }
    if (
      this.containerDom.scrollHeight - this.containerDom.clientHeight ===
        this.containerDom.scrollTop &&
      e.deltaY > 0
    ) {
      e.preventDefault();
    }
  };

  onScroll = (e) => {
    e.stopPropagation();
    const { scrollTop, clientHeight, scrollHeight } = this.containerDom;

    const shouldLoadMore = scrollHeight - scrollTop - clientHeight < DELTA;
    if (shouldLoadMore) {
      this.props.loadMore();
    }
  };

  handleMouseDown = (e) => {
    e.stopPropagation();
  };

  handleRetry = (e) => {
    e.preventDefault();
    this.props.loadMore();
  };

  renderMessages() {
    const {
      messages,
      currentUser,
      messageComponent: Message,
      contacts,
    } = this.props;
    return (
      <div
        className="IM-Messages"
        ref={(n) => {
          this.listDom = n;
        }}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            isFromCurrentUser={currentUser.uid === message.from_user}
            isToCurrentUser={currentUser.uid === message.to_user}
            tabItem={this.props.tabItem}
            contacts={contacts}
          />
        ))}
      </div>
    );
  }

  render() {
    const { messages, fetching, initFetched, error, hasMore } = this.props;

    return (
      <div
        className="IM-MessageViewer IM-MessageViewer_archive"
        ref={(node) => {
          this.containerDom = node;
        }}
      >
        {initFetched &&
          !fetching &&
          error && (
          <div className="IM-MessageViewer__error">
            <div className="IM-MessageViewer__errorMessage">
              {formatMessage(intlMessages.fetchErrorHint)}
            </div>
            <Button
              className="IM-MessageViewer__retryBtn"
              size="sm"
              onClick={this.handleRetry}
            >
              {formatMessage(intlMessages.retryLabel)}
            </Button>
          </div>
        )}
        {messages && this.renderMessages()}
        {hasMore && !error && <Loading modifier="archiveViewer" />}
      </div>
    );
  }
}

ArchiveViewer.propTypes = {
  messages: PropTypes.array,
  initFetched: PropTypes.bool,
  fetching: PropTypes.bool,
  currentUser: PropTypes.object,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  error: PropTypes.object,
  messageComponent: PropTypes.func.isRequired,
  tabItem: PropTypes.string,
  contacts: PropTypes.object,
};

export default ArchiveViewer;
