import React from 'react';
import PropTypes from 'prop-types';

import MemberContact from '../GroupMemberContact';

import './style.scss';

const MemberList = (props) => {
  const {
    members,
    targetUser,
    isOwner,
    currentUser,
    onRemoveMember,
    onRestoreMember,
    onMemberClick,
    onMemberNameClick,
  } = props;
  return (
    <div className="IM-GroupMemberList">
      {members &&
        members
          .filter((a) => a.last_send_time)
          .concat(members.filter((b) => !b.last_send_time))
          .map((member) => (
            <MemberContact
              key={member.id}
              contact={member}
              canRemove={isOwner && currentUser.uid !== member.user}
              isSelf={currentUser.uid === member.user}
              active={targetUser && targetUser.uid === member.user}
              onClick={onMemberClick}
              onNameClick={onMemberNameClick}
              onRemove={onRemoveMember}
              onRestore={onRestoreMember}
            />
          ))}
    </div>
  );
};

MemberList.propTypes = {
  members: PropTypes.array,
  targetUser: PropTypes.shape({
    uid: PropTypes.number,
  }),
  isOwner: PropTypes.bool,
  currentUser: PropTypes.object,
  onRemoveMember: PropTypes.func,
  onRestoreMember: PropTypes.func,
  onMemberClick: PropTypes.func,
  onMemberNameClick: PropTypes.func,
};

export default MemberList;
