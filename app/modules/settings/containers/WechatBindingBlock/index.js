import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import Block from '@feat/feat-ui/lib/block/Block';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import AvatarStamp from '@feat/feat-ui/lib/avatar/AvatarStamp';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from './messages';

import './style.scss';
import { selectWechatBindingBlockState } from '../../selectors';
import { asyncFetchWechatInfo, asyncFetchUnbindWechatInfo, showUnbindingQrCode, hideUnbindingQrCode } from '../../actions/wechatBinding';

class WechatBindingBlock extends Component {
  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchWechatInfo().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
    window.addEventListener('WxAttension', this.watchWxAttensionMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('WxAttension', this.watchWxAttensionMessage);
  }

  watchWxAttensionMessage = (e) => {
    const { status } = e.detail;
    switch (status) {
      case 'bind':
        this.props.fetchWechatInfo();
        break;
      case 'unbind':
        this.props.fetchWechatInfo();
        break;
      default:
        logging.warn('Unknown WxAttension', e.detail);
    }
  };

  toggleUnbinding = () => {
    // eslint-disable-next-line;
    const { blockState: { showUnbindingQrCode: shouldDisplay, unbindingInfo }} = this.props;
    if (shouldDisplay) {
      this.props.hideUnbindingQrCode();
    } else {
      this.props.showUnbindingQrCode();
      if (!unbindingInfo) {
        this.props.fetchWechatUnbindingInfo().catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        });
      }
    }
    
  };

  renderUnbindingInfo() {
    const { blockState } = this.props;
    if (blockState.fetchingUnbinding) {
      return (
        <div style={{ height: 200, position: 'relative' }}>
          <MaskLoader />
        </div>
      );
    }
    if (blockState.unbindingInfo) {
      return (
        <div>
          <img
            src={blockState.unbindingInfo.code_url}
            alt="Unbind Wechat Account"
            className="WcBinding__qrCode"
          />
          <div className="WcBinding__textWrap">
            <p className="WcBinding__text WcBindig__text_primary">
              <TranslatableMessage message={intlMessages.scanToUnbindHint} />
            </p>
          </div>
        </div>
      );
    }
    if (blockState.fetchUnbindingError) {
      return <div>{formatMessage(intlMessages.errorHint)}</div>;
    }
    return null;
  }

  renderContent() {
    const { blockState } = this.props;
    if (blockState.user) {
      return (
        <div>
          <p className="WcBinding__text WcBinding__text_label">
            <TranslatableMessage message={intlMessages.currentBindingInfo} />
          </p>
          <div className="WcBinding__accountInfo">
            <AvatarStamp
              avatar={blockState.user.headimgurl}
              username={blockState.user.nickname}
              uiMeta={['location']}
              location=""
            />
            <Button
              className={classNames({
                'is-selected': blockState.showUnbindingQrCode,
              })}
              type="merge"
              size="sm"
              onClick={this.toggleUnbinding}
            >
              <TranslatableMessage message={intlMessages.unbindLabel} />
            </Button>
          </div>
          {blockState.showUnbindingQrCode && this.renderUnbindingInfo()}
        </div>
      );
    }
    if (blockState.bindingInfo) {
      return (
        <div>
          <img
            className="WcBinding__qrCode"
            src={blockState.bindingInfo.code_url}
            alt="Qrcode to bind wechat account"
          />
          <div className="WcBinding__textWrap">
            <p className="WcBinding__text WcBinding__text_primary">
              <TranslatableMessage message={intlMessages.scanToBindHint} />
            </p>
          </div>
        </div>
      );
    }
    if (!blockState.onceFetched || blockState.loading) {
      return <div>Loading...</div>;
    }
    return <div>Error</div>
  }

  render() {
    return (
      <Block
        className="WechatBinding"
        title={<TranslatableMessage message={intlMessages.sectionTitle} />}
      >
        {this.renderContent()}
      </Block>
    );
  }
}

WechatBindingBlock.propTypes = {
  blockState: PropTypes.object,
  fetchWechatInfo: PropTypes.func,
  fetchWechatUnbindingInfo: PropTypes.func,
  showUnbindingQrCode: PropTypes.func,
  hideUnbindingQrCode: PropTypes.func,
}

const mapStateToProps = createStructuredSelector({
  blockState: selectWechatBindingBlockState,
});

const mapDispatchToProps = {
  fetchWechatInfo: asyncFetchWechatInfo,
  fetchWechatUnbindingInfo: asyncFetchUnbindWechatInfo,
  showUnbindingQrCode,
  hideUnbindingQrCode,
}

export default connect(mapStateToProps, mapDispatchToProps)(WechatBindingBlock);
