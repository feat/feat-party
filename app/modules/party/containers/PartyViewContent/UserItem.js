import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@feat/feat-ui/lib/avatar';

import './style.scss';

function UserItem(props) {
  return (
    <button
      type="button"
      className={classNames('IM-UserItem', {
        'is-selected': props.isActive,
      })}
      disabled={props.archived}
      onClick={props.onClick}
    >
      <Avatar
        className="IM-UserItem__avatar"
        username={props.name}
        avatar={props.avatar}
        archived={props.archived}
        round
      />
      <div className="IM-UserItem__name">{props.name}</div>
    </button>
  );
}

UserItem.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  isActive: PropTypes.bool,
  archived: PropTypes.bool,
  onClick: PropTypes.func,
};

export default UserItem;
