import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';

import {
  DRAGGABLE_TYPE_USER_CONTACT as USER_CONTACT,
  DRAGGABLE_TYPE_GROUP_CONTACT as GROUP_CONTACT,
} from '@/services/dnd';

import FeatTab from '@feat/feat-ui/lib/tabs/FeatTab';

import './style.scss';

const userContactTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return props.canDrop && props.canDrop(item);
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    props.handleDrop && props.handleDrop(item);
  },
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
});

class TabItem extends Component {
  static propTypes = {
    label: PropTypes.node,
    modifier: PropTypes.string,
  };

  render() {
    const {
      modifier,
      label,
      className,
      connectDropTarget,
      isOver,
      isOverCurrent,
      canDrop,
      handleDrop,
      ...restProps
    } = this.props;
    return (
      <FeatTab
        {...restProps}
        className={classNames('IM-Tab', className, {
          [`IM-Tab_${modifier}`]: modifier,
          'is-over': isOver && canDrop,
        })}
        ref={(n) => {
          connectDropTarget((this.dom = ReactDOM.findDOMNode(n)));
        }}
      >
        {this.props.label}
      </FeatTab>
    );
  }
}

export default DropTarget(
  [USER_CONTACT, GROUP_CONTACT],
  userContactTarget,
  dropCollect,
)(TabItem);
