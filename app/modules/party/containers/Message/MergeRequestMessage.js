import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';

import IconButton from '@feat/feat-ui/lib/button/IconButton';

import TMessage from '../../components/IMMessage';

import { acceptGroupMerge, rejectGroupMerge } from '../../actions';
// import {
//   GROUP_MERGE_REQUEST_STATUS_APPROVED,
//   GROUP_MERGE_REQUEST_STATUS_REJECTED,
//   GROUP_MERGE_REQUEST_STATUS_INVALID,
// } from '../../constants';
import formatMessageTime from '../../utils/formatMessageTime';
import {
  groupMergeRequestStatus,
  groupMerge as groupMergeMessages,
} from '../../messages';

class MergeRequestMessage extends React.Component {
  handleReject = () => {
    const { message, dispatch } = this.props;
    dispatch(rejectGroupMerge(message));
  };

  handleAccept = () => {
    const { message, dispatch } = this.props;
    dispatch(acceptGroupMerge(message));
  };

  getStatusLabel(detail) {
    if (detail.is_approve) {
      return formatMessage(groupMergeRequestStatus.approved);
    }
    return formatMessage(groupMergeRequestStatus.rejected);
    // switch (status) {
    //   case GROUP_MERGE_REQUEST_STATUS_APPROVED:
    //     return formatMessage(groupMergeRequestStatus.approved);
    //   case GROUP_MERGE_REQUEST_STATUS_REJECTED:
    //     return formatMessage(groupMergeRequestStatus.rejected);
    //   case GROUP_MERGE_REQUEST_STATUS_INVALID:
    //     return formatMessage(groupMergeRequestStatus.invalid);
    //   default:
    //     return null;
    // }
  }

  renderFooter() {
    const {
      message: { detail },
    } = this.props;
    if (!detail) {
      return null;
    }
    if (detail && detail.is_handled) {
      return (
        <TMessage.Footer>
          <TMessage.Info>{this.getStatusLabel(detail)}</TMessage.Info>
        </TMessage.Footer>
      );
    }
    return (
      <TMessage.Footer>
        <IconButton
          className="margin_r_12"
          size="sm"
          svgIcon="no-btn"
          onClick={this.handleReject}
        />
        <IconButton size="sm" svgIcon="ok-btn" onClick={this.handleAccept} />
      </TMessage.Footer>
    );
  }

  render() {
    const {
      message: { detail, send_time: sendTime },
    } = this.props;
    const formatted = (
      <FormattedMessage
        {...groupMergeMessages.mergeRequest}
        values={{
          username: (
            <span className='t-username'>
              {detail.source_group_creator_username ||
                detail.source_group_creator_uid}
            </span>
          ),
          sourceGroup: detail.source_group_name,
          targetGroup: detail.target_group_name,
        }}
      />
    );

    return (
      <TMessage hasAction modifier="groupMerge">
        <TMessage.Header>
          <TMessage.Meta>{formatMessageTime(sendTime)}</TMessage.Meta>
        </TMessage.Header>
        <TMessage.Content>{formatted}</TMessage.Content>
        {this.renderFooter()}
      </TMessage>
    );
  }
}

MergeRequestMessage.propTypes = {
  message: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(null)(MergeRequestMessage);
