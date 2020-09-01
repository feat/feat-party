import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const IM = createTemplate({
  Compo: 'div',
  namespace: false,
  baseName: 'IM',
  displayName: 'IM',
});

IM.Header = createTemplate({
  Compo: 'div',
  namespace: false,
  baseName: 'IM__header',
  displayName: 'IM__header',
});

IM.SubHeader = createTemplate({
  Compo: 'div',
  namespace: false,
  baseName: 'IM__subHeader',
  displayName: 'IM__subHeader',
});

IM.Content = createTemplate({
  Compo: 'div',
  namespace: false,
  baseName: 'IM__content',
  displayName: 'IM__content',
});

IM.Footer = createTemplate({
  Compo: 'div',
  namespace: false,
  baseName: 'IM__footer',
  displayName: 'IM__footer',
});

IM.Wrap = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Wrap',
  displayName: 'IMWrap',
});

export default IM;
