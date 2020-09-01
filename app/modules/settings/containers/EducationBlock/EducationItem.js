import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import Modal from '@feat/feat-ui/lib/modal';
import LazyImage from '@feat/feat-ui/lib/lazy-image';

import { COMMENTABLE_TYPE_EDUCATION } from '@/modules/comment/constants';

import { education as educationMessages } from '../../messages';

import './EducationItem.scss';

function format(date, type) {
  if (type === 200) {
    // 200 training
    return moment(date).format('MMM.YYYY');
  }
  return moment(date).format('YYYY');
}

function getDuration(props) {
  const { since, until, type } = props;
  return `${format(since, type)} -- ${format(until, type)}`;
}

export default function EducationItem(props) {
  const {
    data: {
      id,
      organization,
      title,
      city,
      description,
      pic,
      user: userId,
      can_comment: canComment,
      comments,
      comment_count: commentCount,
    },
    onDelete,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="EducationItem">
      <div
        className={classNames('EducationItem__main', {
          'has-pic': pic,
        })}
      >
        <div className="EducationItem__header">
          <h3 className="EducationItem__title">{title || city}</h3>
          <span className="EducationItem__duration">
            {getDuration(props.data)}
          </span>
        </div>
        <div className="EducationItem__desc">
          <div className="EducationItem__organization">{organization}</div>
          {description && (
            <div className="EducationItem__description">
              <div className="EducationItem__label">
                <TranslatableMessage
                  message={educationMessages.descriptionLabel}
                />
              </div>
              {description}
            </div>
          )}
        </div>
        {pic && (
          <div
            className="EducationItem__picPreview"
            // style={{ backgroundImage: `url(${pic})` }}
            onClick={() => setIsOpen(true)}
          >
            <LazyImage src={pic} ratio={16 / 9} />
          </div>
        )}
        <Modal
          className="EducationItem__picPreview_modal"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maskClosable
        >
          <Modal.Base>
            <Modal.Content>
              {/* <img style={{ width: '100%' }} src={pic} alt="" /> */}
              <LazyImage src={pic} ratio={16 / 9} />
            </Modal.Content>
          </Modal.Base>
        </Modal>
        {onDelete && (
          <div className="EducationItem__actionGroup">
            <SquareButton
              type="dashed"
              size="xs"
              onClick={() => {
                onDelete(id);
              }}
            >
              &times;
            </SquareButton>
          </div>
        )}
      </div>
      <CommentBundle
        pageLayout={false}
        shouldRender
        showNoContentHint={false}
        showCommentForm={canComment}
        entityCapabilities={{
          canComment,
          commentLimit: 1,
          maxReplyLimit: 1,
        }}
        instanceKey={`edu-item.${id}`}
        entityType={COMMENTABLE_TYPE_EDUCATION}
        entityId={id}
        channel={`activity-comment-education-${id}`}
        initialRootCount={commentCount}
        initialData={comments}
        header={false}
        getCommentCapabilities={(comment, currentUser) => {
          const commentUserId = comment.user
            ? comment.user.uid
            : comment.user_id;
          return {
            canEdit: commentUserId === currentUser.uid,
            canReply: canComment || currentUser.uid === userId,
          };
        }}
      />
    </div>
  );
}

EducationItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    city: PropTypes.string,
    organization: PropTypes.string,
    // eslint-disable-next-line
    since: PropTypes.string,
    // eslint-disable-next-line
    until: PropTypes.string,
    description: PropTypes.string,
    pic: PropTypes.string,
  }),
  onDelete: PropTypes.func,
};
