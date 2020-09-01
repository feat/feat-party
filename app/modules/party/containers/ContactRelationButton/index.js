import { connect } from 'react-redux';

import {
  postFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  recallFriendRequest,
} from '../../actions';

import ContactRelationButton from '../../components/ContactRelationButton';

const mapDispatchToProps = {
  postFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  recallFriendRequest,
};

export default connect(
  null,
  mapDispatchToProps,
)(ContactRelationButton);
