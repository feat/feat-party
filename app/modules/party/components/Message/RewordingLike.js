import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import { getUsername } from '@/utils/user';
import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import { rewordingLike } from '../../messages';

import { structureMap, hashMap } from '../../constants';

function RewordingLike(props) {
  const {
    message: { send_time: sendTime, detail },
    currentUser,
  } = props;

  const { like_data: like } = detail;
  const { meta } = like;
  const router = useRouter();

  const isFromCurrentUser = currentUser.uid === like.user.uid;

  const version = Object.keys(like.rewording_likes_count).indexOf(
    String(like.object_id),
  );

  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        {/* <span className='margin_r_5'>
          <FormattedMessage 
            {...rewordingLike.header}
            values={{
              username: (
                <TMessage.User
                  modifier={isFromCurrentUser ? 'self' : 'other'}
                >
                  {getUsername(like.user)}
                </TMessage.User>
              ),
            }}
          />
        </span> */}
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        <span className="margin_r_5">
          <FormattedMessage
            {...rewordingLike.header}
            values={{
              username: (
                <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
                  {getUsername(like.user)}
                </TMessage.User>
              ),
              structure: `${structureMap[meta.paragraph_type]} ${detail
                .paragraph.sort || ''}`,
            }}
          />
          <span>{` - v${version}`}</span>
        </span>
        <span
          className="js-clickable IM-Message__viewDraft"
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
              `/draft/${detail.bundle_id}/${detail.node_id}#${
                hashMap[meta.paragraph_type]
              }-${detail.paragraph.id}`,
            );
          }}
        >
          {/* <FormattedMessage {...rewordingComment.viewDraft} /> */}
          <SvgIcon icon="share" />
        </span>
        {/* <TMessage.Ref dangerouslySetInnerHTML={{ __html: detail.reword_html_content}} /> */}
      </TMessage.Content>
    </TMessage>
  );
}

RewordingLike.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default RewordingLike;
