import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import SvgIcon from '@feat/feat-ui/lib/svg-icon';

// import { getUsername } from '@/utils/user';
import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import {
  rewordingAudit,
  shortAudit,
  // rewordingComment,
} from '../../messages';
import { structureMap, hashMap } from '../../constants';
function RewordingAudit(props) {
  const {
    message: { send_time: sendTime, detail },
    // currentUser,
  } = props;

  const { reword } = detail;

  const router = useRouter();

  const style = {
    padding: '1px',
  };
  if (detail.action === 'reject') {
    style.textDecoration = 'line-through';
  }

  let content;
  if (detail.reword_html_content) {
    content = <TMessage.Ref
      style={style}
      dangerouslySetInnerHTML={{ __html: detail.reword_html_content }}
    />
  } else if (reword) {
    content = (
      <FormattedMessage
        {...rewordingAudit[detail.action]}
        values={{
          structure: `${structureMap[reword.type]} ${detail.paragraph
            .sort || ''}`,
        }}
      />
    )
  } else {
    content = 'TODO'
  }

  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        {!detail.reword && (
          <TMessage.Meta className="margin_r_5">
            <FormattedMessage
              {...shortAudit[detail.action]}
            />
          </TMessage.Meta>
        )}
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        {content}
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
              reword ? 
                `/draft/${detail.bundle_id}/${detail.node_id}#${
                  hashMap[reword.type]
                }-${detail.paragraph.id}` : `/draft/${detail.bundle_id}/${detail.node_id}`,
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

RewordingAudit.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default RewordingAudit;
