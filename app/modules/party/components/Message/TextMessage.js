import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Router from 'next/router';

import { getAvatar, getAppLink } from '@/utils/user';

import Avatar from '@feat/feat-ui/lib/avatar';
import Loader from '@feat/feat-ui/lib/loader';

import TMessage from '../IMMessage';

import formatMessageTime, {
  formatLocalTime,
} from '../../utils/formatMessageTime';
import {
  MESSAGE_TYPE_FRIEND_IM,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_GROUP_PM,
  CONTACT_LIST_STATUS_CREATED,
  GLOBAL_ROOM,
  MESSAGE_TYPE_BROADCAST,
  CONTACT_TYPE_GROUP,
} from '../../constants';

import {
  messages as partyMessages,
  token as tokenMessages,
} from '../../messages';

class TextMessage extends React.PureComponent {
  state = {
    loading: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.loading !== this.props.loading && prevProps.loading) {
      this.returnLoading();
    }
  }

  returnLoading = () => {
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 500);
  };

  getSender() {
    const { message, contact, currentUser, tabItem } = this.props;
    if (tabItem === 'archive') {
      return false;
    }
    const { message_type: messageType, from_user: fromUser } = message;

    if (messageType === MESSAGE_TYPE_FRIEND_IM) {
      if (currentUser.uid === fromUser) {
        return {
          username: currentUser.username,
          avatar: getAvatar(currentUser, 'md'),
          uid: currentUser.uid,
        };
      }
      return {
        username: contact.friend_first_name,
        avatar: contact.avatar,
        uid: contact.friend,
      };
    }
    if (
      messageType === MESSAGE_TYPE_GROUP_IM ||
      messageType === MESSAGE_TYPE_GROUP_PM
    ) {
      const member =
        contact.group.members &&
        contact.group.members.find((m) => m.user === fromUser);
      if (member) {
        return {
          username: member.fullname,
          avatar: member.avatar,
          uid: fromUser,
        };
      }
    }
    return {
      username: '',
      avatar: '',
    };
  }

  getSenderLabel() {
    const { message, isFromCurrentUser, contacts } = this.props;
    const n =
      contacts &&
      Object.values(contacts).find((item) => message.from_user === item.friend);
    if (isFromCurrentUser) {
      return <FormattedMessage {...tokenMessages.firstPersonSubject} />;
    }
    if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
      return n.friend_first_name;
    }
    return message.from_name || message.from_user;
  }

  getReceiverLabel() {
    const { message, isToCurrentUser, tabItem, contacts } = this.props;
    const isGroupMessage = message.to_group;
    const n =
      contacts &&
      Object.values(contacts).find((item) => message.to_user === item.friend);
    if (tabItem === 'archive') {
      if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
        return isToCurrentUser ? (
          <FormattedMessage {...tokenMessages.secondPersonObject} />
        ) : (
          n.friend_first_name
        );
      }
      return isToCurrentUser ? (
        <FormattedMessage {...tokenMessages.secondPersonObject} />
      ) : (
        message.to_name || message.to_user
      );
    }
    if (!isGroupMessage) {
      return null;
    }
    if (!message.to_user) {
      return null;
    }
    if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
      return n.friend_first_name;
    }
    return isToCurrentUser ? (
      <FormattedMessage {...tokenMessages.secondPersonObject} />
    ) : (
      message.to_name || message.to_user
    );
  }

  handleTextBox = (message) => {
    const { roomInfo, currentUser } = this.props;
    const roomId = `${roomInfo.contactType}_${roomInfo.entityId}`;
    const tempMessageId = this.props.message.id;
    this.setState({
      loading: true,
    });
    if (roomId === GLOBAL_ROOM) {
      this.props.sendMessage({
        roomId: GLOBAL_ROOM,
        isBroadcast: true,
        tempMessageId,
        data: {
          id: tempMessageId,
          type: MESSAGE_TYPE_BROADCAST,
          content: message,
        },
      });
    } else {
      const preprocess = {
        id: tempMessageId,
        content: message,
        send_time: new Date().toISOString(),
        from_user: currentUser.uid,
      };
      if (roomInfo.contactType === CONTACT_TYPE_GROUP) {
        preprocess.to_group = roomInfo.entityId;
        if (roomInfo.targetUser) {
          preprocess.to_user = roomInfo.targetUser.uid;
          preprocess.to_name = roomInfo.targetUser.username;
          preprocess.message_type = MESSAGE_TYPE_GROUP_PM;
        } else {
          preprocess.message_type = MESSAGE_TYPE_GROUP_IM;
        }
      } else {
        preprocess.to_user = roomInfo.entityId;
        preprocess.to_name = this.props.contact.friend_fullname;
        preprocess.message_type = MESSAGE_TYPE_FRIEND_IM;
      }
      this.props.sendMessage({
        roomId,
        tempMessageId,
        data: preprocess,
      });
    }
  };

  render() {
    const { message, isFromCurrentUser, isToCurrentUser, loading } = this.props;
    const { content, error } = message;
    const senderLabel = this.getSenderLabel();
    const receiverLabel = this.getReceiverLabel();
    const sender = this.getSender();
    return (
      <TMessage modifier={isFromCurrentUser ? 'outbound' : 'inbound'}>
        <TMessage.Container>
          {sender && (
            <TMessage.Avatar>
              <Avatar
                onClick={() => {
                  Router.push(
                    {
                      pathname: '/user-profile',
                      query: { userId: sender.uid },
                    },
                    getAppLink(sender),
                  ).then(() => {
                    window.scrollTo(0, 0);
                  });
                }}
                avatar={sender.avatar}
                round
                username={sender.username}
              />
            </TMessage.Avatar>
          )}

          <div style={{ flex: 1 }}>
            <TMessage.Header>
              <TMessage.Desc>
                {senderLabel &&
                  receiverLabel && (
                  <FormattedMessage
                    {...partyMessages.targeted}
                    values={{
                      sender: (
                        <TMessage.User
                          modifier={isFromCurrentUser ? 'self' : 'other'}
                        >
                          {senderLabel}
                        </TMessage.User>
                      ),
                      receiver: (
                        <TMessage.User
                          modifier={isToCurrentUser ? 'self' : 'other'}
                        >
                          {receiverLabel}
                        </TMessage.User>
                      ),
                    }}
                  />
                )}
                {senderLabel &&
                  !receiverLabel && (
                  <FormattedMessage
                    {...partyMessages.normal}
                    values={{
                      sender: (
                        <TMessage.User
                          modifier={isFromCurrentUser ? 'self' : 'other'}
                        >
                          {senderLabel}
                        </TMessage.User>
                      ),
                    }}
                  />
                )}
              </TMessage.Desc>
              <TMessage.Meta>
                <TMessage.Time>
                  {formatMessageTime(message.send_time)}
                </TMessage.Time>
                {(message.location || message.timezone) && (
                  <span className="margin_x_5">&bull;</span>
                )}
                {message.location && (
                  <TMessage.Location className="margin_r_5">
                    {message.location}
                  </TMessage.Location>
                )}
                {message.timezone && (
                  <TMessage.Time className="margin_r_5">
                    {formatLocalTime(
                      message.send_time,
                      undefined,
                      message.timezone,
                    )}
                  </TMessage.Time>
                )}
                {error && (
                  <span className="padding_l_12 IM-MessageViewer__sendError">
                    <FormattedMessage {...partyMessages.failedToSend} />
                  </span>
                )}
              </TMessage.Meta>
            </TMessage.Header>
            <TMessage.Content>
              <div>{content.replace(/ /g, '\u00a0')}</div>
            </TMessage.Content>
          </div>
          {error && (
            <>
              {this.state.loading && loading === this.state.loading ? (
                <div className="padding_t_12">
                  <Loader size="xs" />
                </div>
              ) : (
                <div
                  className="padding_t_12"
                  onClick={() => this.handleTextBox(content)}
                >
                  <svg
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                      verticalAlign: 'middle',
                      fill: 'currentColor',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4491"
                  >
                    <path
                      d="M512 0A512 512 0 1 1 0 512 512 512 0 0 1 512 0z m-156.672 304.128A260.352 260.352 0 1 1 251.648 512a38.4 38.4 0 0 0-76.8 0A337.408 337.408 0 1 0 314.88 238.592l17.92-64.256a33.536 33.536 0 0 0-8.704-33.024 34.048 34.048 0 0 0-57.088 15.36l-39.68 148.48a33.792 33.792 0 0 0 24.064 41.728l148.224 39.68a33.536 33.536 0 0 0 33.024-8.704 34.304 34.304 0 0 0 8.96-33.024 33.536 33.536 0 0 0-24.32-24.064l-61.184-16.64z"
                      fill="#FF4949"
                      p-id="4492"
                    />
                  </svg>
                </div>
              )}
            </>
          )}
        </TMessage.Container>
      </TMessage>
    );
  }
}

TextMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    from_name: PropTypes.string,
    from_user: PropTypes.number,
    content: PropTypes.string.isRequired,
    send_time: PropTypes.string,
    // to_group: PropTypes.string,
    to_name: PropTypes.string,
    to_user: PropTypes.number,
  }),
  isFromCurrentUser: PropTypes.bool,
  isToCurrentUser: PropTypes.bool,
  contact: PropTypes.shape({
    avatar: PropTypes.string,
    friend_fullname: PropTypes.string,
  }),
  contacts: PropTypes.object,
  currentUser: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string,
  }),
  tabItem: PropTypes.string,
};

export default TextMessage;
