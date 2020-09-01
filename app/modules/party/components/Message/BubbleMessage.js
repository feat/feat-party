import React from 'react';
import PropTypes from 'prop-types';
import TMessage from '../IMMessage';

class BubbleMessage extends React.PureComponent {
  render() {
    const { message } = this.props;
    return (
      <TMessage modifier="bubble">
        <TMessage.Content modifier="bubble">{message.content}</TMessage.Content>
      </TMessage>
    );
  }
}

BubbleMessage.propTypes = {
  message: PropTypes.object,
};

export default BubbleMessage;
