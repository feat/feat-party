import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'next/router';

import ViewAvatarBlock from '@/modules/user/components/ViewAvatarBlock';

import { selectUserList } from './selectors';
import './styles.scss';

function UserPageIndex(props) {
  const { userList } = props;
  return (
    <div>
      <div className="UserPage__label">User List</div>
      <div className="UserPage">
        {userList &&
          userList.map((item) => (
            <div className="UserPage__option">
              <ViewAvatarBlock user={item} />
            </div>
          ))}
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  userList: selectUserList,
});
const withConnect = connect(mapStateToProps);

export default compose(
  withRouter,
  withConnect,
)(UserPageIndex);
