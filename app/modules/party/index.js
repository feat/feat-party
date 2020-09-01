import dynamic from 'next/dynamic';

export default dynamic(
  () => import(/* webpackChunkName: "party" */ './containers'),
  {
    ssr: false,
  }
);
