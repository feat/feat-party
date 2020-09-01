import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DropTarget } from 'react-dnd';

import { DRAGGABLE_TYPE_USER } from '@/services/dnd';
import { selectCurrentUser } from '@/modules/auth/selectors';

import { withDeviceInfo } from '@/modules/device-info';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import Roster from './Roster';
import IMHeader from './IMHeader';

import {
  // changeMode,
  tryToSendFriendRequest,
} from '../actions';

import { selectUiState, selectCurrentContact } from '../selectors';

import InboxMessageViewer from './InboxMessageViewer';
import ArchiveMessageViewer from './ArchiveMessageViewer';
import ChatBox from './ChatBox';
import PartyViewContent from './PartyViewContent';
import PartyViewNav from './PartyViewNav';
import RoomSearchInput from './RoomSearchInput';

import InboxTab from './InboxTab';
import ArchiveTab from './ArchiveTab';
import IM from '../components/IM';
import ChatView from '../components/ChatView';
import PartyView from '../components/PartyView';

// import intlMessages, { uiNav as uiNavMessages } from '../messages';
import intlMessages from '../messages';

import {
  IM_MODE_PARTY,
  IM_MODE_CHAT,
  IM_TAB_INBOX,
  IM_TAB_ARCHIVE,
} from '../constants';

// INIT GLOBAL STATE:
global.FEAT_PARTY = {};

class Party extends Component {
  state = {
    isPressed: false,
  };

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUpdate(nextProps) {
    if (
      !this.props.ui.display &&
      nextProps.ui.display &&
      (this.props.isMobile ? this.state.style : this.state.isPressed)
    ) {
      const { style, initStyle } = this.state.style;
      const viewportX = window.innerWidth;
      const viewportY = window.innerHeight;
      if (
        style.top > viewportY ||
        style.left > viewportX ||
        style.left + initStyle.width < 0 ||
        style.top + initStyle.height < 0
      ) {
        this.resetStyle();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  getWrapperStyle() {
    if (!this.props.match) {
      return this.state.style;
    }
    return {};
  }

  resetStyle() {
    this.setState({
      style: undefined,
    });
  }

  handleMouseDown = (e) => {
    if (e.nativeEvent.button !== 0) {
      return;
    }
    if (global.FEAT_PARTY.relationBtnOpened) {
      return;
    }
    const container = document.querySelector('#IM-Wrap');
    const boundingBox = container.getBoundingClientRect();

    this.setState({
      isPressed: true,
      init: {
        x: e.clientX,
        y: e.clientY,
      },
      initStyle: {
        top: boundingBox.top,
        left: boundingBox.left,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });
  };

  handleMouseMove = (e) => {
    const { isPressed, init, initStyle } = this.state;
    if (isPressed) {
      const deltaX = e.clientX - init.x;
      const deltaY = e.clientY - init.y;
      this.setState({
        style: {
          top: initStyle.top + deltaY,
          left: initStyle.left + deltaX,
        },
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ isPressed: false });
  };

  renderPartyMode() {
    const { ui, dispatch, currentUser } = this.props;
    return (
      <PartyView>
        <PartyView.Content
          modifier={ui.currentTab === IM_TAB_INBOX ? 'inbox' : 'archive'}
        >
          <PartyView.TabContainer>
            <InboxTab
              label={<TranslatableMessage message={intlMessages.inbox} />}
              active={ui.currentTab === IM_TAB_INBOX}
              currentUserId={currentUser.uid}
              dispatch={dispatch}
            />
            <ArchiveTab
              label={<TranslatableMessage message={intlMessages.archive} />}
              active={ui.currentTab === IM_TAB_ARCHIVE}
              currentUserId={currentUser.uid}
              dispatch={dispatch}
            />
          </PartyView.TabContainer>
          <PartyViewContent tab={ui.currentTab} roomId={ui.currentRoom} />
        </PartyView.Content>
        <PartyView.Nav>
          <PartyViewNav tab={ui.currentTab} roomId={ui.currentRoom} />
        </PartyView.Nav>
      </PartyView>
    );
  }

  renderHint() {
    const { isOver, canDrop, ui, currentUser } = this.props;
    if (isOver && canDrop) {
      return (
        <div className="padding_l_12">
          <span className="IM__statusHint">
            <TranslatableMessage
              message={intlMessages.dropAndSendFriendRequestHint}
            />
          </span>
        </div>
      );
    }
    if (ui.currentTab === IM_TAB_ARCHIVE) {
      return <RoomSearchInput roomId={ui.currentRoom} />;
    }
    return (
      <div className="IM__footer_TextBox">
        {ui.currentTab === IM_TAB_INBOX && (
          <ChatBox currentUser={currentUser} roomId={ui.currentRoom} />
        )}
      </div>
    );
  }

  renderChatMode() {
    const { ui, currentUser, dispatch, currentContact } = this.props;
    return (
      <ChatView>
        <ChatView.Content
          modifier={ui.currentTab === IM_TAB_INBOX ? 'inbox' : 'archive'}
        >
          <ChatView.TabContainer>
            <InboxTab
              label={<TranslatableMessage message={intlMessages.inbox} />}
              active={ui.currentTab === IM_TAB_INBOX}
              currentUserId={currentUser.uid}
              currentContact={currentContact}
              dispatch={dispatch}
            />
            <ArchiveTab
              label={<TranslatableMessage message={intlMessages.archive} />}
              active={ui.currentTab === IM_TAB_ARCHIVE}
              currentUserId={currentUser.uid}
              currentContact={currentContact}
              dispatch={dispatch}
            />
          </ChatView.TabContainer>
          <ChatView.MainContent>
            {ui.currentTab === IM_TAB_INBOX && (
              <>
                <InboxMessageViewer
                  key={ui.currentRoom}
                  roomId={ui.currentRoom}
                />
                {/* <ChatBox currentUser={currentUser} roomId={ui.currentRoom} /> */}
              </>
            )}
            {ui.currentTab === IM_TAB_ARCHIVE && (
              <ArchiveMessageViewer
                key={ui.currentRoom}
                roomId={ui.currentRoom}
              />
            )}
          </ChatView.MainContent>
        </ChatView.Content>
        <ChatView.Roster>
          <Roster />
        </ChatView.Roster>
      </ChatView>
    );
  }

  render() {
    const {
      ui: { display, currentMode },
      connectDropTarget,
      match,
    } = this.props;

    const isRoute = Boolean(match);

    const shouldDisplay = display || isRoute;
    if (!shouldDisplay) {
      return null;
    }
    if (this.props.isMobile) {
      return null;
    }

    return (
      <IM.Wrap
        ref={(n) => {
          this.dom = ReactDOM.findDOMNode(n);
          connectDropTarget(this.dom);
        }}
        className={classNames({
          'is-over': this.props.isOver,
          'IM-Wrap_panel': !isRoute,
        })}
        style={this.getWrapperStyle()}
        id="IM-Wrap"
        onMouseDown={this.handleMouseDown}
      >
        <IM>
          <IM.Header>
            <IMHeader />
          </IM.Header>
          <IM.Content>
            <IM.SubHeader />
            {currentMode === IM_MODE_PARTY && this.renderPartyMode()}
            {currentMode === IM_MODE_CHAT && this.renderChatMode()}
          </IM.Content>
          <IM.Footer>{this.renderHint()}</IM.Footer>
        </IM>
      </IM.Wrap>
    );
  }
}

Party.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object,
  currentUser: PropTypes.object,
  currentContact: PropTypes.object,
  connectDropTarget: PropTypes.func,
  isMobile: PropTypes.bool,
  match: PropTypes.object,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

const userTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.dispatch(tryToSendFriendRequest(item.payload.user));
  },
};

const dropCollect = (collect, monitor) => ({
  connectDropTarget: collect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
  dropItem: monitor.getItem(),
});

const mapStateToProps = createStructuredSelector({
  ui: selectUiState,
  currentUser: selectCurrentUser,
  currentContact: selectCurrentContact,
});

const withDropTraget = DropTarget(
  [DRAGGABLE_TYPE_USER],
  userTarget,
  dropCollect,
);

const withConnect = connect(mapStateToProps);

export default compose(
  withDeviceInfo,
  withConnect,
  withDropTraget,
)(Party);
