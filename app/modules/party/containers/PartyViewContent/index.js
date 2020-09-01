import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectRoomInfo,
  selectPartySectionItemsForRoom,
} from '../../selectors';
import { CONTACT_TYPE_GROUP, CONTACT_LIST_STATUS_BLACK } from '../../constants';
import { changeRoom, setRoomTargetUser } from '../../actions';
import UserItem from './UserItem';
import { getRoomId } from '../../utils/room';

class PartyViewContent extends React.PureComponent {
  renderGroupMembers() {
    const { sectionItems, roomInfo, roomId } = this.props;
    return (
      <div className="IM-UserSlide">
        {sectionItems.map((member) => (
          <div key={member.user} className="IM-UserSlide__cell">
            <UserItem
              name={member.fullname || member.user}
              avatar={member.avatar}
              isActive={
                roomInfo.targetUser && roomInfo.targetUser.uid === member.user
              }
              onClick={() => {
                this.props.setRoomTargetUser({
                  roomId,
                  groupId: roomInfo.entityId,
                  member,
                });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  renderUserContacts() {
    const { sectionItems, roomId: currentRoomId } = this.props;

    return (
      <div className="IM-UserSlide">
        {sectionItems.map((contact) => {
          const roomId = getRoomId(contact);
          return (
            <div className="IM-UserSlide__cell" key={roomId}>
              <UserItem
                name={contact.friend_fullname || contact.friend}
                avatar={contact.avatar}
                isActive={roomId === currentRoomId}
                onClick={() => {
                  this.props.changeRoom({
                    roomId,
                    contact,
                  });
                }}
                archived={contact.status === CONTACT_LIST_STATUS_BLACK}
              />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    logging.debug(this.props);
    const { roomInfo } = this.props;

    if (roomInfo.contactType === CONTACT_TYPE_GROUP) {
      return this.renderGroupMembers();
    }
    return this.renderUserContacts();
  }
}

PartyViewContent.propTypes = {
  roomId: PropTypes.string,
  sectionItems: PropTypes.array,
  changeRoom: PropTypes.func,
  setRoomTargetUser: PropTypes.func,
  roomInfo: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  sectionItems: selectPartySectionItemsForRoom,
  roomInfo: selectRoomInfo,
});

export default connect(
  mapStateToProps,
  {
    changeRoom,
    setRoomTargetUser,
  },
)(PartyViewContent);
