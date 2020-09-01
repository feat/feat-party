import React from 'react';
import { useSelector } from 'react-redux';
import { selectLikeCount } from '../../selectors';

function LikeCount(props) {
  const { entityType, entityId, ...rest } = props;
  const count = useSelector((state) => selectLikeCount(state, props))
  return <span {...rest}>{count || 0}</span>
}

export default LikeCount;