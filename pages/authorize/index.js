// import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';

import SplashView from '@/components/SplashView';

const Dynamic = dynamic(() => import('@/routes/Authorize'), {
  loading: () => <SplashView />,
});

function AuthorizePage() {
  // const router = useRouter();
  return (
    <SiteLayout mode="fixed-header">
      <Header />
      <Content>
        <Layout>
          <Layout.Main>
            <Layout.Main modifier="base" id="main">
              <Dynamic />
            </Layout.Main>
          </Layout.Main>
        </Layout>
      </Content>
    </SiteLayout>
  );
}

export default AuthorizePage;
