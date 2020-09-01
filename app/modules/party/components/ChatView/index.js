import createTemplate from '@feat/feat-ui/lib/util/createTemplate';
import './style.scss';

const ChatView = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'ChatView',
  displayName: 'IM-ChatView',
});

ChatView.Content = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'ChatView__Content',
  customProps: ['modifier'],
  state: ({ namespace, baseName, modifier }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
  displayName: 'IM-ChatView__Content',
});

ChatView.Roster = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'ChatView__Roster',
  displayName: 'IM-ChatView__Content',
});

ChatView.TabContainer = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'ChatView__tabContainer',
  displayName: 'IM-ChatView__tabContainer',
});

ChatView.MainContent = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'ChatView__mainContent',
  displayName: 'IM-ChatView__mainContent',
});

export default ChatView;
