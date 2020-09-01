import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import { getUsername } from '@/utils/user';
import { formatMessage } from '@/services/intl';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import {
  notification as notiMessage,
  role as roleMessage,
} from '../../messages';

function CollaboratorJoin(props) {
  const {
    message: { send_time: sendTime, detail },
    currentUser,
  } = props;

  const router = useRouter();

  const isFromCurrentUser = currentUser.uid === detail.user.uid;
  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        <FormattedMessage
          {...notiMessage.collaboratorJoin}
          values={{
            username: (
              <TMessage.User
                modifier={isFromCurrentUser ? 'self' : 'other'}
              >
                {getUsername(detail.user)}
              </TMessage.User>
            ),
            identity: formatMessage(roleMessage[detail.role]),
          }}
        />
      </TMessage.Content>
      <TMessage.Footer>
        <TMessage.Meta
          className="js-clickable"
          onClick={(e) => {
            e.stopPropagation();
            router.push(
              {
                pathname: '/dimzou-edit',
                query: {
                  bundleId: detail.bundle_id,
                  nodeId: detail.node_id,
                },
              },
              `/draft/${detail.bundle_id}/${detail.node_id}`
            );
          }}
        >
          {/* <FormattedMessage {...rewordingComment.viewDraft} /> */}
          <SvgIcon icon="share" />
        </TMessage.Meta>
      </TMessage.Footer>
    </TMessage>
  );
}

CollaboratorJoin.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default CollaboratorJoin;
