import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { formatMessage } from '@/services/intl';

import mMessages from '../../messages';
import TextBox from '../../components/TextBox';

import { sendMessage, updateRoomEditor } from '../../actions';
import {
  GLOBAL_ROOM,
  CONTACT_TYPE_FEAT,
  CONTACT_TYPE_GROUP,
  MESSAGE_TYPE_BROADCAST,
  MESSAGE_TYPE_GROUP_PM,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_FRIEND_IM,
} from '../../constants';
import { selectRoomInfo, selectRoomContact } from '../../selectors';
import { generateId } from '../../utils/message';

class Chat extends Component {
  getPlaceHolder() {
    const { roomId } = this.props;
    if (roomId === GLOBAL_ROOM) {
      return formatMessage(mMessages.broadcast);
    }
    return formatMessage(mMessages.writeHere);
  }

  handleEditorChange = (editorState) => {
    this.props.updateRoomEditor({
      roomId: this.props.roomId,
      editorState,
    });
  };

  handleTextBox = (message) => {
    const { roomId, roomInfo, currentUser } = this.props;
    const tempMessageId = generateId(roomId);
    if (roomId === GLOBAL_ROOM) {
      this.props.sendMessage({
        roomId: GLOBAL_ROOM,
        isBroadcast: true,
        tempMessageId,
        data: {
          id: tempMessageId,
          message_type: MESSAGE_TYPE_BROADCAST,
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
        preprocess.to_name = this.props.roomContact.friend_fullname;
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
    const { roomInfo } = this.props;
    if (!roomInfo) {
      return null;
    }

    if (roomInfo.contactType === CONTACT_TYPE_FEAT) {
      return null;
    }

    if (!roomInfo) {
      return <div> ... </div>;
    }

    return (
      <TextBox
        style={this.props.style}
        placeholder={this.getPlaceHolder()}
        editorState={roomInfo.editorState}
        onEditorChange={this.handleEditorChange}
        onSubmit={this.handleTextBox}
        sendingMessage={Boolean(roomInfo.messageSendingCount)}
        roomId={this.props.roomId}
      />
    );
  }
}

Chat.propTypes = {
  style: PropTypes.func,
  sendMessage: PropTypes.func,
  updateRoomEditor: PropTypes.func,
  roomId: PropTypes.string,
  roomInfo: PropTypes.object,
  roomContact: PropTypes.object,
  currentUser: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  roomInfo: selectRoomInfo,
  roomContact: selectRoomContact,
});

const mapDispatchToProps = {
  sendMessage,
  updateRoomEditor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
