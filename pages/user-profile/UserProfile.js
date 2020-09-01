import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import UserContentLinks from '@/containers/Header/UserContentLinks';
import SplashView from '@/components/SplashView';

const Dynamic = dynamic(
  () => import('@/modules/user/components/ViewUserProfile'),
  {
    loading: () => <SplashView />,
    ssr: false,
  },
);

function UserProfile(props) {
  return (
    <SiteLayout mode="fixed-header" className="hhsmn">
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic userId={props.userId} />
            </Layout.Main>
          </Layout.Main>
        </Layout>
      </Content>
    </SiteLayout>
  );
}

UserProfile.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UserProfile;
