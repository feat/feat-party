import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import { getUsername } from '@/utils/user';
import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import {
  rewordingSubmit,
  // rewordingComment,
} from '../../messages';
import { structureMap, hashMap } from '../../constants';

function RewordingSubmit(props) {
  const {
    message: { send_time: sendTime, detail },
    currentUser,
  } = props;

  const { reword } = detail;

  const router = useRouter();
  const isFromCurrentUser = reword && currentUser.uid === reword.user.uid;
  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        {detail.reword_html_content && (
          <TMessage.Meta className="margin_r_5">
            <FormattedMessage {...rewordingSubmit.label} />
          </TMessage.Meta>
        )}
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        {reword ? (
          <FormattedMessage
            {...rewordingSubmit.message}
            values={{
              username: (
                <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
                  {getUsername(reword.user)}
                </TMessage.User>
              ),
              structure: `${structureMap[reword.type]} ${detail.paragraph
                .sort || ''}`,
            }}
          />
        ) : (
          <TMessage.Ref
            dangerouslySetInnerHTML={{ __html: detail.reword_html_content }}
          />
        )}
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
              `/draft/${detail.bundle_id}/${detail.node_id}#${
                hashMap[reword.type]
              }-${detail.paragraph.id}`,
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

RewordingSubmit.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default RewordingSubmit;
