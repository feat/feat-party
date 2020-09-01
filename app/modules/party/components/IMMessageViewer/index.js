import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';
import Loading from '../Loading';
import intlMessages from './messages';

import './style.scss';

const userSentMessage = (prevMessages, messages, currentUser) => {
  const prevLatestMessage = prevMessages[prevMessages.length - 1];
  const currentLatestMessage = messages[messages.length - 1];
  return (
    prevLatestMessage &&
    currentLatestMessage &&
    prevLatestMessage.id !== currentLatestMessage.id &&
    currentLatestMessage.from_user === currentUser.uid
  );
};

class MessageViewer extends React.PureComponent {
  scrollAtBottom = true;

  state = {
    invisibleReceived: 0,
  };

  componentDidMount() {
    this.scrollToBottom();
    if (this.containerDom) {
      this.containerDom.addEventListener('scroll', this.onScroll);
      this.containerDom.addEventListener('mousedown', this.handleMouseDown);
      this.containerDom.addEventListener('mousewheel', this.onMouseWheel);
    }
    // const dom = document.querySelector('.IM');
    // dom.addEventListener('mousewheel', this.onMouseWheelIM);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  componentWillUpdate(nextProps) {
    const { containerDom, listDom } = this;
    if (!containerDom) {
      return;
    }
    const currentLast =
      this.props.messages &&
      this.props.messages[this.props.messages.length - 1];
    const nextLast =
      nextProps.messages && nextProps.messages[nextProps.messages.length - 1];
    this.historyChanged =
      nextProps.messages &&
      this.props.messages &&
      (nextProps.messages.length !== this.props.messages.length || // message changed.
        (currentLast && nextLast && !nextLast._id && currentLast._id)); // send message succeeded
    if (this.historyChanged) {
      const scrollPos = containerDom.scrollTop;
      const scrollBottom =
        containerDom.scrollHeight - containerDom.clientHeight;
      this.scrollAtBottom = scrollBottom <= 0 || scrollPos === scrollBottom; // TODO: delta (should stick to bottom)
      if (
        currentLast &&
        nextLast &&
        nextLast.id !== currentLast.id &&
        nextLast.from_user !== this.props.currentUser.uid &&
        containerDom.scrollHeight > containerDom.clientHeight
      ) {
        this.state.invisibleReceived = this.state.invisibleReceived + 1;
      }
    }
    if (!this.scrollAtBottom && listDom) {
      const numMessages = listDom.childNodes;
      const pivotMessage = numMessages.length === 0 ? null : numMessages[0];
      if (pivotMessage) {
        this.pivotMessage = pivotMessage;
        this.pivotOffset = containerDom.scrollTop - pivotMessage.offsetTop;
      }
      // this.topMessage = numMessages.length === 0 ? null : numMessages[0];
    }
  }

  componentDidUpdate(prevProps) {
    if (this.historyChanged) {
      if (
        this.scrollAtBottom ||
        userSentMessage(
          prevProps.messages,
          this.props.messages,
          this.props.currentUser,
        )
      ) {
        this.scrollToBottom();
      } else if (this.pivotMessage) {
        // reset scrollPosition;
        const currentOffset = this.pivotMessage.offsetTop;
        const nextScrollTop = (this.pivotOffset || 0) + currentOffset;
        this.containerDom.scrollTop = nextScrollTop;
        // this.pivotMessage.scrollIntoView();
      }
    }
  }

  componentWillUnmount() {
    if (this.containerDom) {
      this.containerDom.removeEventListener('scroll', this.onScroll);
      this.containerDom.removeEventListener('mousedown', this.handleMouseDown);
      this.containerDom.removeEventListener('mousewheel', this.onMouseWheel);
    }
    window.removeEventListener('focus', this.handleWindowFocus);
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

  handleWindowFocus = () => {
    // if no scroll to trigger invisibleReceived reset, then ...
    if (
      this.state.invisibleReceived &&
      this.containerDom &&
      this.containerDom.clientHeight === this.containerDom.scrollHeight
    ) {
      this.setState({
        invisibleReceived: 0,
      });
    }
  };

  // onMouseWheelIM = (e) => {
  //   const IMheader = document.querySelector('.IM__header');
  //   const IMfooter = document.querySelector('.IM__footer');
  //   if (e.target === IMheader || e.target === IMfooter) {
  //     e.preventDefault();
  //   }
  // };
  handleRetry = (e) => {
    e.preventDefault();
    this.props.loadMore();
  };

  scrollToBottom = () => {
    const { containerDom } = this;
    if (!containerDom) {
      return;
    }
    const { scrollHeight, clientHeight } = containerDom;
    const maxScrollTop = scrollHeight - clientHeight;
    containerDom.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  handleMouseDown = (e) => {
    e.stopPropagation();
  };

  onScroll = (e) => {
    e && e.stopPropagation();
    const { containerDom } = this;
    if (!containerDom) {
      return;
    }
    const { scrollHeight, clientHeight, scrollTop } = containerDom;
    if (scrollTop === 0) {
      this.props.loadMore();
    } else if (scrollTop > scrollHeight - clientHeight - 20) {
      this.stickyToButtom = true;
      if (this.state.invisibleReceived > 0) {
        this.setState({
          invisibleReceived: 0,
        });
      }
    }
  };

  renderMessages() {
    const {
      contact,
      contacts,
      currentUser,
      messages,
      messageComponent: Message,
      roomInfo,
      sendMessage,
      loading,
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
            key={message.id || message._id}
            message={message}
            isFromCurrentUser={currentUser.uid === message.from_user}
            isToCurrentUser={currentUser.uid === message.to_user}
            contact={contact}
            currentUser={currentUser}
            contacts={contacts}
            roomInfo={roomInfo}
            sendMessage={sendMessage}
            loading={loading}
          />
        ))}
      </div>
    );
  }

  render() {
    const { messages, fetching, initFetched, error, modifier } = this.props;
    return (
      <div
        className={classNames('IM-MessageViewer', {
          [`IM-MessageViewer_${modifier}`]: modifier,
        })}
        ref={(node) => {
          this.containerDom = node;
        }}
      >
        {(!initFetched || fetching) && <Loading modifier="messageViewer" />}
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
        <button
          type="button"
          className={classNames('IM-MessageViewer__newHint', {
            'is-visible': this.state.invisibleReceived > 0,
          })}
          onClick={this.scrollToBottom}
        >
          {this.state.invisibleReceived}
        </button>
      </div>
    );
  }
}

MessageViewer.propTypes = {
  contact: PropTypes.object,
  contacts: PropTypes.object,
  currentUser: PropTypes.object,
  messages: PropTypes.array,
  initFetched: PropTypes.bool,
  fetching: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  error: PropTypes.object,
  modifier: PropTypes.string,
  messageComponent: PropTypes.func,
  roomInfo: PropTypes.object,
  sendMessage: PropTypes.func,
  loading: PropTypes.bool,
};

export default MessageViewer;
