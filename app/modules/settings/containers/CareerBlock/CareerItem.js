import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { formatMessage } from '@/services/intl';

import Modal from '@feat/feat-ui/lib/modal';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import { COMMENTABLE_TYPE_CAREER } from '@/modules/comment/constants';
import { career as careerMessages } from '../../messages';
import './CareerItem.scss';

const format = (date) => moment(date).format('MMM.YYYY');

const getDuration = ({ working_on, since, until }) => {
  if (working_on) {
    return `${format(since)} -- ${formatMessage(careerMessages.present)}`;
  }
  return `${format(since)} -- ${format(until)}`;
};

export default function CareerItem(props) {
  const {
    data: {
      organization,
      position,
      description,
      achievement,
      pic,
      id,
      user: userId,
      can_comment: canComment,
      comments,
      comment_count: commentCount,
    },
    onDelete,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="CareerItem">
      <div
        className={classNames('CareerItem__main', {
          'has-pic': pic,
        })}
      >
        <div className="CareerItem__header">
          <h3 className="CareerItem__title">{position}</h3>
          <span className="CareerItem__duration">
            {getDuration(props.data)}
          </span>
        </div>
        <div className="CareerItem__desc">
          <div className="CareerItem__organization">{organization}</div>
          <div>
            <div className="CareerItem__description">
              <div className="CareerItem__label">
                <TranslatableMessage
                  message={careerMessages.descriptionLabel}
                />
              </div>
              {description}
            </div>
            <div className="CareerItem__achievement">
              <div className="CareerItem__label">
                <TranslatableMessage
                  message={careerMessages.achievementLabel}
                />
              </div>
              {achievement}
            </div>
          </div>
        </div>

        {pic && (
          <div
            className="CareerItem__picPreview"
            // style={{ backgroundImage: `url(${pic})` }}
            onClick={() => setIsOpen(true)}
          >
            <LazyImage src={pic} ratio={16 / 9} />
          </div>
        )}
        <Modal
          className="CareerItem__picPreview_modal"
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
          <div className="CareerItem__actionGroup">
            <SquareButton size="xs" onClick={onDelete} type="dashed">
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
        instanceKey={`career-item.${id}`}
        entityType={COMMENTABLE_TYPE_CAREER}
        entityId={id}
        channel={`activity-comment-career_experience-${id}`}
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

CareerItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    comment_count: PropTypes.number,
    can_comment: PropTypes.bool,
    comments: PropTypes.array,
    organization: PropTypes.string,
    position: PropTypes.string,
    description: PropTypes.string,
    achievement: PropTypes.string,
    pic: PropTypes.string,
  }),
  onDelete: PropTypes.func,
};
