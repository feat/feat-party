import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { createStructuredSelector } from 'reselect';
import { DropTarget, DragSource } from 'react-dnd';

import { DRAGGABLE_TYPE_USER_CONTACT as USER_CONTACT } from '@/services/dnd';
import {
  addEventListenerFor,
  removeEventListenerFor,
} from '@/services/dnd/helpers';

import Avatar from '@feat/feat-ui/lib/avatar';
import LiveClock from '@/components/LiveClock';

import ContactRelationButton from '../ContactRelationButton';

import {
  getContactName,
  getContactMeta,
  getContactAvatar,
} from '../../utils/contact';

import Contact from '../../components/Contact';
import { createGroup, changeRoom } from '../../actions';
import { GLOBAL_ROOM, CONTACT_LIST_STATUS_BLACK } from '../../constants';
import { selectRoomInfo } from '../../selectors';

const userContactSource = {
  beginDrag(props, monitor, component) {
    const dom = ReactDOM.findDOMNode(component);
    props.returnBeginDrag();
    if (dom.parentElement) {
      addEventListenerFor(dom.parentElement);
    }
    return {
      type: USER_CONTACT,
      payload: {
        contact: props.contact,
      },
    };
  },
  endDrag(props, monitor, component) {
    const dom = ReactDOM.findDOMNode(component);
    props.returnEndDrag();
    if (dom.parentElement) {
      removeEventListenerFor(dom.parentElement);
    }
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

const userContactTarget = {
  canDrop(props, monitor) {
    if (props.archiveMode) {
      return false;
    }
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return (
      item.type === USER_CONTACT && item.payload.contact.id !== props.contact.id
    );
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    const { dispatch, contact } = props;
    dispatch(createGroup([contact, item.payload.contact]));
    // handleDrop({ source: item, target: contact });
  },
};

const dropCollect = (collect, monitor) => ({
  connectDropTarget: collect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
});

class UserContact extends Component {
  handleClick = (e) => {
    e.preventDefault();
    const { contact, dispatch, active, roomId } = this.props;
    dispatch(
      changeRoom(
        active
          ? {
            roomId: GLOBAL_ROOM,
          }
          : {
            roomId,
            contact,
          },
      ),
    );
  };

  render() {
    const {
      connectDropTarget,
      connectDragSource,
      contact,
      isOver,
      canDrop,
      active,
      roomInfo,
      archiveMode,
    } = this.props;
    const name = getContactName(contact);
    const meta = getContactMeta(contact);
    const avatar = getContactAvatar(contact);
    return (
      <Contact.Wrap
        isActive={active}
        ref={(n) => {
          this.wrapperDom = ReactDOM.findDOMNode(n);
          connectDragSource(this.wrapperDom);
          connectDropTarget(this.wrapperDom);
        }}
      >
        {roomInfo.loading && <Contact.Loading />}
        <Contact
          type="user"
          isActive={active}
          isOver={isOver && canDrop}
          onClick={this.handleClick}
        >
          <Contact.Container>
            <Contact.TitleContainer>
              <Contact.Avatar count={archiveMode ? 0 : contact.unread_count}>
                <Avatar
                  avatar={avatar}
                  username={name}
                  archived={contact.status === CONTACT_LIST_STATUS_BLACK}
                  round={contact.status !== CONTACT_LIST_STATUS_BLACK}
                />
                <ContactRelationButton
                  userId={contact.friend}
                  status={contact.status}
                />
              </Contact.Avatar>
              <Contact.Info>
                <Contact.Name>{name}</Contact.Name>
                <Contact.Meta>{meta}</Contact.Meta>
              </Contact.Info>
            </Contact.TitleContainer>
            <Contact.RightTitleContainer>
              <Contact.Meta modifier="location">
                {contact.location}
              </Contact.Meta>
              <Contact.Meta modifier="localTime">
                {contact.timezone && (
                  <LiveClock timezone={contact.timezone} ticking />
                )}
              </Contact.Meta>
            </Contact.RightTitleContainer>
          </Contact.Container>
        </Contact>
      </Contact.Wrap>
    );
  }
}

UserContact.propTypes = {
  active: PropTypes.bool,
  roomId: PropTypes.string,
  contact: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  archiveMode: PropTypes.bool,
  roomInfo: PropTypes.object,
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  roomInfo: selectRoomInfo,
});

const DraggableContact = DropTarget(
  USER_CONTACT,
  userContactTarget,
  dropCollect,
)(DragSource(USER_CONTACT, userContactSource, sourceCollect)(UserContact));

export default connect(mapStateToProps)(DraggableContact);
