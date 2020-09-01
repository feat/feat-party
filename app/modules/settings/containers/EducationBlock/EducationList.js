import React from 'react';
import PropTypes from 'prop-types';

export default function EducationList(props) {
  return <div className="EducationList">{props.children}</div>;
}

EducationList.propTypes = {
  children: PropTypes.node,
};
