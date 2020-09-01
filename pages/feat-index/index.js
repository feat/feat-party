import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import SiteLayout, { Content } from '@feat/feat-ui/lib/layout';
import Layout from '@/components/Layout';
import Header from '@/containers/Header';
import SplashView from '@/components/SplashView';

import { asyncFetchUserList } from '@/routes/UserPage/actions';
import { selectUserList } from '@/routes/UserPage/selectors';

const Dynamic = dynamic(() => import('@/routes/UserPage'), {
  loading: () => <SplashView />,
  ssr: false,
});

function FeatIndexPage() {
  const router = useRouter();
  return (
    <SiteLayout mode="fixed-header">
      <Header query={router.query} />
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

FeatIndexPage.getInitialProps = async ({ store }) => {
  try {
    await store.dispatch(asyncFetchUserList());
  } catch (err) {
    console.log(err);
  }
};

export default FeatIndexPage;
