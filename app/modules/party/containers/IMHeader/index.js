import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Link from 'next/link';

import Avatar from '@feat/feat-ui/lib/avatar';

import { getAppLink } from '@/utils/user';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectCurrentContact } from '../../selectors';

import IMHeader from '../../components/IMHeader';
// import RoomSearchInput from '../RoomSearchInput';
import {
  isGroupContact as isGroup,
  getContactName,
  getContactMeta,
  getContactAvatar,
} from '../../utils/contact';

import {
  GROUP_STATUS_DISMISS,
  CONTACT_LIST_STATUS_BLACK,
  // IM_TAB_ARCHIVE,
} from '../../constants';

class IMHeaderContainer extends Component {
  componentDidMount() {
    const IMDom = document.querySelector('.IM');
    if (IMDom) {
      IMDom.addEventListener('mousewheel', this.onMouseWheelIM);
    }
  }

  componentWillUnmount() {
    const IMDom = document.querySelector('.IM');
    if (IMDom) {
      IMDom.removeEventListener('mousewheel', this.onMouseWheelIM);
    }
  }

  onMouseWheelIM = (e) => {
    // stop scroll popup
    const IMMessageViewer = document.querySelector('.IM-MessageViewer');
    const IMChatViewRoster = document.querySelector('.IM-ChatView__Roster');
    const path = e.path || (e.composedPath && e.composedPath()) || [];
    if (IMMessageViewer) {
      if (
        path.indexOf(IMMessageViewer.children[0]) === -1 &&
        path.indexOf(IMChatViewRoster.children[0]) === -1
      ) {
        e.preventDefault();
      }
    } else if (
      IMChatViewRoster &&
      path.indexOf(IMChatViewRoster.children[0]) === -1
    ) {
      e.preventDefault();
    }
  };

  getHeaderInfo() {
    const { currentContact, currentUser } = this.props;
    if (!currentContact) {
      const fullname = currentUser.username || currentUser.uid;
      return {
        avatar: (
          <Avatar
            round
            draggable={false}
            username={fullname}
            avatar={currentUser.avatar || undefined}
          />
        ),
        title: (
          <Link
            href={{
              pathname: '/user-profile',
              query: {
                userId: currentUser.uid,
              },
            }}
            as={getAppLink(currentUser)}
          >
            <a>{fullname}</a>
          </Link>
        ),
        subTitle: currentUser.expertise,
      };
    }
    const isGroupContact = isGroup(currentContact);

    const name = getContactName(currentContact);
    const avatar = getContactAvatar(currentContact);
    const subTitle = getContactMeta(currentContact);

    if (isGroupContact) {
      return {
        avatar: (
          <Avatar
            avatar={avatar}
            username={name}
            draggable={false}
            archived={
              currentContact.group.status === GROUP_STATUS_DISMISS ||
              currentContact.status === CONTACT_LIST_STATUS_BLACK
            }
          />
        ),
        title: currentContact.group.bundle_id ? (
          <Link
            href={{
              pathname: '/dimzou-edit',
              query: {
                bundleId: currentContact.group.bundle_id,
              },
            }} 
            as={`/draft/${currentContact.group.bundle_id}`}
          >
            <a>{name}</a>
          </Link>
        ) : name,
        subTitle,
      };
    }

    return {
      avatar: (
        <Avatar
          archived={currentContact.status === CONTACT_LIST_STATUS_BLACK}
          round={currentContact.status !== CONTACT_LIST_STATUS_BLACK}
          draggable={false}
          avatar={avatar}
          username={name}
        />
      ),
      title: (
        <Link
          href={{
            pathname: '/user-profile',
            query: { userId: currentContact.friend },
          }}
          as={getAppLink({ uid: currentContact.friend })}
        >
          <a>{name}</a>
        </Link>
      ),
      subTitle,
    };
  }

  render() {
    return (
      <IMHeader
        {...this.getHeaderInfo()}
      />
    );
  }
}

IMHeaderContainer.propTypes = {
  currentContact: PropTypes.object,
  currentUser: PropTypes.object,
  rightCompo: PropTypes.node,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  currentContact: selectCurrentContact,
});
export default connect(mapStateToProps)(IMHeaderContainer);
