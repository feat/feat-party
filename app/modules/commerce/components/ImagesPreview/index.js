import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@feat/feat-ui/lib/popover';

import './style.scss';

class ImagesPreview extends React.PureComponent {
  render() {
    return (
      <div className="cm-ImagesPreview">
        {this.props.data.map((item) => (
          <Popover
            key={item.id}
            placement="rightBottom"
            isMobile={this.props.isMobile}
            content={
              <img
                // src={item.big_photo}
                src={item.detail.url}
                style={{ maxWidth: 600, height: 'auto' }}
                alt=""
              />
            }
          >
            <div className="cm-ImagesPreview__item">
              <div
                className="cm-ImagesPreview__thumb"
                style={{
                  backgroundImage: `url(${item.detail.url})`,
                }}
              />
            </div>
          </Popover>
        ))}
      </div>
    );
  }
}

ImagesPreview.propTypes = {
  data: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default ImagesPreview;
