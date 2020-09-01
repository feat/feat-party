import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import { getUsername } from '@/utils/user';
import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import { rewordingComment } from '../../messages';
import { structureMap, hashMap } from '../../constants';

function RewordingCommentMessage(props) {
  const {
    message: { send_time: sendTime, detail },
    currentUser,
  } = props;

  const { comment_data: comment } = detail;
  const { meta } = comment;
  const router = useRouter();

  const isFromCurrentUser = currentUser.uid === comment.user.uid;
  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        <span className="margin_r_5">
          {meta && detail.paragraph ? (
            <FormattedMessage
              {...rewordingComment.comment}
              values={{
                username: (
                  <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
                    {getUsername(comment.user)}
                  </TMessage.User>
                ),
                structure: `${structureMap[meta.paragraph_type]} ${detail
                  .paragraph.sort || ''}`,
              }}
            />
          ) : (
            <FormattedMessage 
              {...rewordingComment.shortMessage}
              values={{
                username: (
                  <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
                    {getUsername(comment.user)}
                  </TMessage.User>
                ),
              }}
            />
          )}
        </span>
        <span
          className="js-clickable IM-Message__viewDraft"
          onClick={(e) => {
            e.stopPropagation();
            const hash = meta && detail.paragraph ? `${hashMap[meta.paragraph_type]}-${detail.paragraph.id}` : undefined;
            router.push(
              {
                pathname: '/dimzou-edit',
                query: {
                  bundleId: detail.bundle_id,
                  nodeId: detail.node_id,
                },
                hash,
              },
              hash ? `/draft/${detail.bundle_id}/${detail.node_id}#${hash}` : `/draft/${detail.bundle_id}/${detail.node_id}`,
            );
          }}
        >
          {/* <FormattedMessage {...rewordingComment.viewDraft} /> */}
          <SvgIcon icon="share" />
        </span>
      </TMessage.Content>
      <TMessage.Footer />
    </TMessage>
  );
}

RewordingCommentMessage.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default RewordingCommentMessage;
