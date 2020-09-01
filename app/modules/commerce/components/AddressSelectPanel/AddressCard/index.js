import React from 'react';
import PropTypes from 'prop-types';

import Button from '@feat/feat-ui/lib/button/Button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../messages';
import './style.scss';

function AddressCard(props) {
  const { data } = props;
  return (
    <div className="ft-AddressCard">
      <div className="ft-AddressCard__username">{data.username}</div>
      <div className="ft-AddressCard__address">
        <div className="ft-AddressCard__line">
          {data.level_1} {data.level_2} {data.level_3}
        </div>

        <div className="ft-AddressCard__line">
          {data.level_4} {data.address_line}
        </div>
      </div>
      <div className="ft-AddressCard__phone">
        <span className="ft-AddressCard__label">
          <TranslatableMessage message={intlMessages.phoneLabel} />
        </span>
        {data.phone}
      </div>
      <div className="ft-AddressCard__footer">
        <div className="ft-AddressCard__actions">
          <div className="ft-AddressCard__action">
            <Button type="link">
              <TranslatableMessage message={intlMessages.editLabel} />
            </Button>
          </div>
          <div className="ft-AddressCard__action">
            <Button type="link">
              <TranslatableMessage message={intlMessages.deleteLabel} />
            </Button>
          </div>
          {!data.is_default && (
            <div className="ft-AddressCard__action">
              <Button type="link">
                <TranslatableMessage message={intlMessages.setAsDefaultLabel} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AddressCard.propTypes = {
  data: PropTypes.object,
};

export default AddressCard;
