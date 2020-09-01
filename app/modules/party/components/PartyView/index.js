import createTemplate from '@feat/feat-ui/lib/util/createTemplate';
import './style.scss';

const PartyView = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'PartyView',
  displayName: 'TPartyView',
});

PartyView.Content = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'PartyView__Content',
  displayName: 'TPartyView.Content',
  customProps: ['modifier'],
  state: ({ namespace, baseName, modifier }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});
PartyView.TabContainer = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'PartyView__TabContainer',
  displayName: 'TPartyView.TabContainer',
});
PartyView.Nav = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'PartyView__Nav',
  displayName: 'TPartyView.Nav',
});

export default PartyView;
