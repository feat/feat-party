import React from 'react';
import PropTypes from 'prop-types';

export default function HonorList(props) {
  return <div className="HonorList">{props.children}</div>;
}

HonorList.propTypes = {
  children: PropTypes.any,
};
