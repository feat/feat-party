import React from 'react';
import classNames from 'classnames';

import Badge from '@feat/feat-ui/lib/badge';
import Loader from '@feat/feat-ui/lib/loader';
import createTemplate from '@feat/feat-ui/lib/util/createTemplate';

import './style.scss';

const NAMESPACE = 'IM';

const Contact = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact',
  customProps: ['modifier', 'isActive', 'isOver', 'isRemoved', 'isSelf'],
  state: (props) => {
    const {
      namespace,
      baseName,
      modifier,
      isActive,
      isOver,
      isRemoved,
      isSelf,
      onClick,
    } = props;
    const blockName = `${namespace}-${baseName}`;
    const classes = {
      [`${blockName}_${modifier}`]: modifier,
      'js-clickable': Boolean(onClick),
      'is-active': isActive,
      'is-over': isOver,
      'is-removed': isRemoved,
      'is-self': isSelf,
    };
    return classNames(classes);
  },
  displayName: 'TContact',
});

Contact.Wrap = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'ContactWrap',
  customProps: ['isActive', 'modifier'],
  state: ({ isActive, namespace, baseName, modifier }) =>
    classNames({
      [`${namespace}-${baseName}_${modifier}`]: modifier,
      'is-active': isActive,
    }),
  displayName: 'TContactWrap',
});

Contact.Container = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__container',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});

Contact.TitleContainer = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__titleContainer',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});

Contact.RightTitleContainer = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__rightTitleContainer',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});

Contact.Avatar = createTemplate({
  Compo: Badge,
  namespace: NAMESPACE,
  baseName: 'Contact__avatar',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});

Contact.Info = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__info',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});
Contact.Name = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__name',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});
Contact.Meta = createTemplate({
  Compo: 'div',
  namespace: NAMESPACE,
  baseName: 'Contact__meta',
  customProps: ['modifier'],
  state: ({ modifier, namespace, baseName }) =>
    modifier && `${namespace}-${baseName}_${modifier}`,
});
Contact.Loading = () => (
  <div className="IM-ContactLoading">
    <Loader size="xs" />
  </div>
);

export default Contact;
