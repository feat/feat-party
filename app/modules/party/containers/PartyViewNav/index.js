import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '@/modules/auth/selectors';

import { selectPartyNavSections, selectCurrentRoomId } from '../../selectors';

import { changeRoom } from '../../actions';

import './style.scss';
import { CONTACT_TYPE_GROUP, GLOBAL_ROOM } from '../../constants';

class PartyViewNav extends React.PureComponent {
  renderSectionItem = (item) => {
    const roomId = `${CONTACT_TYPE_GROUP}_${item.group.id}`;
    return (
      <button
        type="button"
        key={roomId}
        className={classNames('IM-PartyViewNav__item', {
          'is-selected': this.props.currentRoomId === roomId,
        })}
        onClick={() =>
          this.props.changeRoom({
            roomId,
            contact: item,
          })
        }
      >
        <img
          className="IM-PartyViewNav__itemAvatar"
          src={item.group.avatar}
          alt={item.group.name}
        />
        <div className="IM-PartyViewNav__itemLabel">{item.group.name}</div>
      </button>
    );
  };

  render() {
    const { currentUser, currentRoomId = '' } = this.props;
    const [contactType] = currentRoomId.split('_');
    return (
      <div className="IM-PartyViewNav">
        <button
          type="button"
          key={GLOBAL_ROOM}
          className={classNames('IM-PartyViewNav__item', {
            'is-selected': contactType !== CONTACT_TYPE_GROUP,
          })}
          onClick={() =>
            this.props.changeRoom({
              roomId: GLOBAL_ROOM,
            })
          }
        >
          <img
            className="IM-PartyViewNav__itemAvatar IM-PartyViewNav__itemAvatar_user"
            src={currentUser.avatar}
            alt={currentUser.username}
          />
          <div className="IM-PartyViewNav__itemLabel">
            {currentUser.username || currentUser.uid}
          </div>
        </button>
        {this.props.sections.map(this.renderSectionItem)}
      </div>
    );
  }
}

PartyViewNav.propTypes = {
  currentUser: PropTypes.object,
  sections: PropTypes.array,
  currentRoomId: PropTypes.string,
  changeRoom: PropTypes.func,
};

const mapStateToProps = () =>
  createStructuredSelector({
    currentUser: selectCurrentUser,
    sections: selectPartyNavSections,
    currentRoomId: selectCurrentRoomId,
  });

// const mapDispatchToProps = (dispatch) => {

// }

export default connect(
  mapStateToProps,
  {
    changeRoom,
  },
)(PartyViewNav);
