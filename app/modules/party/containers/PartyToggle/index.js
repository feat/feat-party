import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Badge from '@feat/feat-ui/lib/badge';
import imIcon from '@/images/im.svg';

import { toggleIM } from '../../actions/ui';
import { selectUnreadMessageCount, selectPartyIsOpened } from '../../selectors';

function PartyToggle(props) {
  const { unreadCount, isIMOpened, className } = props;
  return (
    <Badge className={className} count={unreadCount} onClick={props.toggleIM}>
      <IconButton 
        isActive={isIMOpened} size="md" 
      >
        <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: imIcon }} />
      </IconButton>
      {props.label}
    </Badge>
  );
}

PartyToggle.propTypes = {
  className: PropTypes.string,
  isIMOpened: PropTypes.bool,
  toggleIM: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
  label: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  isIMOpened: selectPartyIsOpened,
  unreadCount: selectUnreadMessageCount,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIM: () => dispatch(toggleIM()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PartyToggle);
