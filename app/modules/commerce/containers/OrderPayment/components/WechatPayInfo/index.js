import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class WechatPayInfo extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.info && this.props.info && !this.props.error) {
      const anchor = document.createElement('a');
      anchor.href = this.props.info.info.code_url;
      document.body.appendChild(anchor);
      anchor.click();
    }
  }

  render() {
    const { loading, error } = this.props;
    if (loading) {
      return <div className="WechatPayInfoHint">Loading...</div>;
    }
    if (error) {
      return <div className="WechatPayInfoHint">{error.message}</div>;
    }
    return <div className="WechatPayInfoHint">Check Status</div>;
  }
}

WechatPayInfo.propTypes = {
  info: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default WechatPayInfo;
