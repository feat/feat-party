import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Link from 'next/link';

import { getAvatar } from '@/utils/user';
import mMessages from '@/messages/menu';

import Menu from '@feat/feat-ui/lib/menu';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Avatar from '@feat/feat-ui/lib/avatar';
import Badge from '@feat/feat-ui/lib/badge';

import draft from '@/images/draft.svg';
import imIcon from '@/images/im.svg';

import { toggleIM } from '@/modules/party/actions/ui';
import {
  selectUnreadMessageCount,
  selectPartyIsOpened,
} from '@/modules/party/selectors';

function UserMenu(props) {
  const {
    user,
    intl: { formatMessage },
    unreadCount,
    isIMOpened,
  } = props;

  return (
    <Menu className="HeaderUserMenu">
      <Link
        href={{
          pathname: '/settings',
        }}
        as={`/settings`}
      >
        <a
          className="ft-Menu__item ft-Menu__item_icon"
          data-track-anchor="UserProfile"
          data-anchor-type="UserMenu"
        >
          <IconButton size="md">
            <Avatar avatar={getAvatar(user, 'md')} size="xs" round />
          </IconButton>
          <span className="padding_l_5">{user.username || user.uid}</span>
        </a>
      </Link>
      <Menu.Item
        icon
        data-track-anchor="Party"
        data-anchor-type="UserMenu"
        onClick={() => {
          props.toggleIM();
        }}
      >
        <Badge count={unreadCount}>
          <IconButton isActive={isIMOpened} size="md">
            <span
              className="ft-SvgIcon"
              dangerouslySetInnerHTML={{ __html: imIcon }}
            />
          </IconButton>
        </Badge>
        <span className="padding_l_5">{formatMessage(mMessages.party)}</span>
      </Menu.Item>
    </Menu>
  );
}

UserMenu.propTypes = {
  isIMOpened: PropTypes.bool,
  toggleIM: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  isIMOpened: selectPartyIsOpened,
  unreadCount: selectUnreadMessageCount,
});
const mapDispatchToProps = {
  toggleIM,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

UserMenu.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object.isRequired,
};

export default injectIntl(withConnect(UserMenu));
