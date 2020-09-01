import React from 'react';
import PropTypes from 'prop-types';

export default function Mention(props) {
  const { entityKey, contentState } = props;
  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  const name = data.fullname || String(data.user);
  return (
    <span className="IM-MessageMention" data-user-id={data.user}>
      @ {name}
    </span>
  );
}

Mention.propTypes = {
  entityKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contentState: PropTypes.object,
};
