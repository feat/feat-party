import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const modifierState = ({ namespace, baseName, modifier }) =>
  modifier && `${namespace}-${baseName}_${modifier}`;

const Message = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message',
  customProps: ['modifier', 'hasAction'],
  state: (props) => {
    const { namespace, baseName, hasAction, modifier } = props;
    return [
      modifier && `${namespace}-${baseName}_${modifier}`,
      hasAction && `${namespace}-${baseName}_hasAction`,
    ];
  },
  displayName: 'TMessage',
});

Message.Container = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__container',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Container',
});

Message.Header = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__header',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Header',
});

Message.Desc = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__desc',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Desc',
});

Message.Text = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__text',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Text',
});

Message.Time = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__time',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Time',
});

Message.Location = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__location',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Location',
});

Message.TargetArrow = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__targetArrow',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.TargetArrow',
});

Message.User = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__user',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.User',
});
Message.Meta = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__meta',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Meta',
});
Message.Info = createTemplate({
  Compo: 'span',
  namespace: 'IM',
  baseName: 'Message__info',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Info',
});

Message.Content = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__content',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Content',
});
Message.Avatar = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__avatar',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Avatar',
});

Message.Footer = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__footer',
  customProps: ['modifier'],
  state: modifierState,
  displayName: 'TMessage.Footer',
});

Message.Ref = createTemplate({
  Compo: 'div',
  namespace: 'IM',
  baseName: 'Message__ref',
  state: modifierState,
  displayName: 'TMessage.Ref',
})

export default Message;
