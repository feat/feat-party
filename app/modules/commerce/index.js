import dynamic from 'next/dynamic'

export default dynamic(
  () => import('./containers/CommerceService'),
  {
    ssr: false,
  }
)