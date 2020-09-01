import React from 'react';
import PropTypes from 'prop-types';

export default function CareerList(props) {
  return <div className="CareerList">{props.children}</div>;
}

CareerList.propTypes = {
  children: PropTypes.node,
};
