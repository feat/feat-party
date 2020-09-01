import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

const OrderInfo = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo',
});

OrderInfo.Left = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__left',
});

OrderInfo.Right = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__right',
});

OrderInfo.Row = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__row',
  customProps: ['inline', 'modifier'],
  state: ({ namespace, baseName, inline, modifier }) => {
    const classes = [];
    if (modifier) {
      classes.push(`${namespace}-${baseName}_${modifier}`);
    }
    if (inline) {
      classes.push(`${namespace}-${baseName}_inline`);
    }

    return classes.join('');
  },
});

OrderInfo.Main = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__main',
});

OrderInfo.Label = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__label',
});

OrderInfo.Content = createTemplate({
  Compo: 'div',
  namespace: 'ft',
  baseName: 'OrderInfo__content',
});

export default OrderInfo;
