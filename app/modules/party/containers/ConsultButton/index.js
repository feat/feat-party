import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { selectCurrentUser } from '@/modules/auth/selectors';

import { openChatRoomWithUser, closeChatRoomWithUser } from '../../actions';
import { makeSelectIsConsultButtonActive } from '../../selectors';

import intlMessages from '../../messages';
import { CONTACT_TYPE_USER } from '../../constants';

class ConsultButton extends React.PureComponent {
  render() {
    const {
      user,
      currentUser,
      className,
      style,
      label,
      size,
      isActive,
    } = this.props;
    if (!currentUser || currentUser.uid === user.uid) {
      return null;
    }
    return (
      <Button
        size={size}
        className={classNames('ConsultButton', className, {
          'is-selected': isActive,
        })}
        onClick={() => {
          if (this.props.isActive) {
            this.props.closeChatRoomWithUser(this.props.user);
          } else {
            this.props.openChatRoomWithUser(this.props.user);
          }
        }}
        style={style}
      >
        {label || <TranslatableMessage message={intlMessages.consultLabel} />}
      </Button>
    );
  }
}

ConsultButton.propTypes = {
  openChatRoomWithUser: PropTypes.func.isRequired,
  closeChatRoomWithUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.number,
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
  label: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
  isActive: PropTypes.bool,
};

ConsultButton.defaultProps = {
  size: 'sm',
};

const mapStateToProps = (_, props) => {
  const roomId = `${CONTACT_TYPE_USER}_${props.user.uid}`;
  const isActiveSelector = makeSelectIsConsultButtonActive(roomId);
  return createStructuredSelector({
    currentUser: selectCurrentUser,
    isActive: isActiveSelector,
  });
};

export default connect(
  mapStateToProps,
  { openChatRoomWithUser, closeChatRoomWithUser },
)(ConsultButton);
