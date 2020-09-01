import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';
import Button from '@feat/feat-ui/lib/button';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';
import fLogo from '@/images/f.svg';
import { about as aboutMessages } from '../../messages';
import './style.scss';

const IMHeader = (props) => {
  const [showAbout, setShowAbout] = useState(false);

  const {
    avatar,
    title,
    subTitle,
    meta,
    rightCompo,
    // rightActionLabel,
    // onRightActionClick,
  } = props;
  return (
    <div className="IM-Header">
      <div className="IM-Header__container">
        <div className="IM-Header__titleContainer">
          <div className="IM-Header__avatar">{avatar}</div>
          <div className="IM-Header__info">
            <div className="IM-Header__header">
              <div className="IM-Header__title">{title}</div>
              {meta && <span className="IM-Header__meta">{meta}</span>}
            </div>
            <div className="IM-Header__subTitle">{subTitle}</div>
          </div>
        </div>
        <div className="IM-Header__actionContainer">
          {/* <Button onClick={onRightActionClick}>{rightActionLabel}</Button> */}
          {rightCompo}
          <Button 
            onClick={() => setShowAbout(!showAbout)}
            type="merge"
            style={{ fontWeight: 'normal', fontFamily: 'HelveticaNeue'}}
            className={showAbout ? 'is-selected': undefined}
          >
            {formatMessage(aboutMessages.about)}
          </Button>
          {showAbout && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: 'rgba(128, 128, 128, .3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
              }}
              onClick={() => setShowAbout(false)}
            >
              <div 
                style={{ 
                  width: 320, padding: '44px 38px 20px', backgroundColor: 'white', borderRadius: 8, textAlign: 'center', position: 'relative',
                  left: -100,
                  top: -90,
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    width: 24,
                    height: 24, 
                    top: 24,
                    left: 16,
                  }}
                  dangerouslySetInnerHTML={{__html: fLogo}} 
                />
                <SvgIcon 
                  icon="im" size="lg" 
                  style={{ width: 48, height: 48, marginTop: 12 }}
                />
                <h4 style={{ marginTop: 12, marginBottom: 12 }}>
                  {formatMessage(aboutMessages.name)}
                </h4>
                <div style={{fontSize: 14, lineHeight: 1.5}}>
                  {formatMessage(aboutMessages.version, { version: '2.0' })}<br/>
                  {formatMessage(aboutMessages.author)}<br/>
                  {formatMessage(aboutMessages.copyright, { year: new Date().getFullYear()})}<br/>
                  {formatMessage(aboutMessages.reserved)}<br/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

IMHeader.propTypes = {
  avatar: PropTypes.element.isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  meta: PropTypes.node,
  rightCompo: PropTypes.node,
  // rightActionLabel: PropTypes.node.isRequired,
  // onRightActionClick: PropTypes.func.isRequired,
};

export default IMHeader;
