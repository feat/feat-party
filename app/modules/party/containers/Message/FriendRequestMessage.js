import { connect } from 'react-redux';

import { rejectFriendRequest, acceptFriendRequest } from '../../actions';

import FriendRequestMessage from '../../components/Message/FriendRequest';

const mapDispatchToProps = (dispatch) => ({
  onReject: (data) => dispatch(rejectFriendRequest(data)),
  onAccept: (data) => dispatch(acceptFriendRequest(data)),
});

export default connect(
  null,
  mapDispatchToProps,
)(FriendRequestMessage);
