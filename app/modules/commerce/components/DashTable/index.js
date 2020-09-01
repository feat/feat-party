import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const DashTable = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'DashTable',
});

DashTable.Main = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'DashTable__main',
});

DashTable.Header = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'DashTable__header',
});

DashTable.Content = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'DashTable__content',
});

DashTable.Footer = createTemplate({
  Compo: 'div',
  namespace: 'cm',
  baseName: 'DashTable__footer',
});

export default DashTable;
