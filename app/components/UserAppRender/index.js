import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function UserAppRender(props) {
  const sidebarRef = useRef(null);
  const wrapperRef = useRef(null);

  return (
    <div ref={wrapperRef} className="l-UserApp">
      <div className="l-UserApp__main">{props.main}</div>
    </div>
  );
}

UserAppRender.propTypes = {
  sidebar: PropTypes.node,
  main: PropTypes.node,
};

export default UserAppRender;
