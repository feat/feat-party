// import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import SplashView from '@/components/SplashView';

import { asyncFetchUserInfo } from '@/modules/settings/actions';
import { selectCommonState } from '@/modules/settings/selectors';

const Dynamic = dynamic(
  () => import('@/modules/settings/containers/SettingsPage'),
  {
    loading: () => <SplashView />,
    ssr: false,
  },
);

function Settings() {
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

Settings.getInitialProps = async ({ store, req }) => {
  const subState = selectCommonState(store.getState());
  if (!subState.onceFetched) {
    try {
      await store.dispatch(
        asyncFetchUserInfo(
          undefined,
          req
            ? {
                headers: req.getApiHeaders(),
              }
            : undefined,
        ),
      );
    } catch (err) {
      logging.error(err);
    }
  }

  return {};
};

export default Settings;
