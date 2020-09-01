import React from 'react';
import messagePropTypes from './propTypes';

export default function BaseMessage(props) {
  return <div>{props.message.content}</div>;
}

BaseMessage.propTypes = messagePropTypes;
