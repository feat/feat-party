import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AvatarStamp from '@/containers/AvatarStamp';

import './style.scss';

const AwesomeCard = (props) => {
  const {
    namespace,
    jobTitle,
    openTime,
    username,
    avatar,
    expertise,
    location,
    localTime,
    openRange,
    nightTheme,
    online,
    ...restProps
  } = props;

  let title;
  if (Array.isArray(expertise)) {
    title = expertise[0].name;
  } else {
    title = expertise;
  }

  const blockName = `${namespace}-AwesomeCard`;
  return (
    <div
      className={classNames(blockName, {
        'js-clickable': Boolean(restProps.onClick),
      })}
      {...restProps}
    >
      <div
        className={classNames(`${blockName}__header`, {
          [`${blockName}_nightTheme`]: nightTheme,
        })}
      >
        <h3 className={`${blockName}__title`}>{title}</h3>
        <div className={`${blockName}__date`}>
          <div className={`${blockName}__desc`}>{openTime}</div>
          <div className={`${blockName}__openRange`}>{openRange}</div>
        </div>
      </div>
      <div className={`${blockName}__content`}>
        <div className={`${blockName}__avatarStamp`}>
          <AvatarStamp
            avatar={avatar}
            username={username}
            jobTitle={jobTitle}
            location={location}
            localTime={localTime}
            uiMeta={['jobTitle']}
            uiExtraMeta={['location', 'localTime']}
            online={online}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
};

AwesomeCard.propTypes = {
  namespace: PropTypes.string,
  jobTitle: PropTypes.node,
  openTime: PropTypes.node,
  username: PropTypes.node,
  avatar: PropTypes.node,
  expertise: PropTypes.node,
  location: PropTypes.node,
  localTime: PropTypes.node,
  openRange: PropTypes.node,
  nightTheme: PropTypes.bool,
  online: PropTypes.bool,
};

AwesomeCard.defaultProps = {
  namespace: 'ft',
};

export default AwesomeCard;
