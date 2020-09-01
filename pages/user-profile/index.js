import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectRequestState } from '@/modules/user/selectors';
import { asyncFetchUserInfo } from '@/modules/user/actions';
// import { asyncFetchUserDimzous } from '@/modules/dimzou-view/actions';
import UserInfoProvider from '@/modules/user/UserInfoProvider';

import UserProfile from './UserProfile';

function UserPage(props) {
  return (
    <UserInfoProvider userId={props.userId}>
      {props.userId === String(props.currentUser.uid) ? (
        <div>user page</div>
      ) : (
        <UserProfile {...props} />
      )}
    </UserInfoProvider>
  );
}

UserPage.getInitialProps = async ({ query, store }) => {
  const currentUser = selectCurrentUser(store.getState());
  const request = selectRequestState(store.getState(), {
    userId: query.userId,
  });
  try {
    if (!request.fetchedAt && !request.isFetching) {
      await store.dispatch(
        asyncFetchUserInfo({
          userId: query.userId,
        }),
      );
    }
  } catch (err) {
    // TODO log
  }

  return { currentUser, userId: query.userId };
};

export default UserPage;
