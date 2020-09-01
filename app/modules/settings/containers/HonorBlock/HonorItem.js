import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import Modal from '@feat/feat-ui/lib/modal';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import './HonorItem.scss';

const HonorItem = (props) => {
  const {
    data: { title, organization, issued_at, pic },
    onDelete,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="HonorItem">
      <div
        className={classNames('HonorItem__main', {
          'has-pic': pic,
        })}
      >
        <div className="HonorItem__header">
          <h3 className="HonorItem__title">{title}</h3>
          <span className="HonorItem__issuedAt">
            {moment(issued_at).format('MMM YYYY')}
          </span>
        </div>
        <div className="HonorItem__desc">
          <span className="HonorItem__organization">{organization}</span>
        </div>
        {pic && (
          <div
            className="HonorItem__picPreview"
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
          <div className="HonorItem__actionGroup">
            <SquareButton onClick={onDelete} size="xs" type="dashed">
              &times;
            </SquareButton>
          </div>
        )}
      </div>
    </div>
  );
};

HonorItem.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    organization: PropTypes.string,
    issued_at: PropTypes.string,
    pic: PropTypes.string,
  }),
  onDelete: PropTypes.func,
};

export default HonorItem;
