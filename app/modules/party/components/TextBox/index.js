import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row } from '@feat/feat-ui/lib/grid';

import {
  Editor,
  // convertToRaw,
  EditorState,
  Modifier,
  getDefaultKeyBinding,
  // KeyBindingUtil
} from 'draft-js';

import { getMentionText } from './utils';

import './style.scss';

class TextBox extends Component {
  componentDidMount() {
    this.editor.focus();
  }

  componentDidUpdate(prevProp) {
    if (prevProp.roomId !== this.props.roomId) {
      this.editor.focus();
    }
  }

  componentDidCatch(error) {
    logging.error(error);
    this.forceUpdate();
  }

  getMentionOptions = () => {};

  onEditorChange = (editorState) => {
    this.props.onEditorChange(editorState);
    // this.setState({ editorState });
  };

  sendMessage = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { editorState } = this.props;
    const content = editorState.getCurrentContent();
    const text = content.getPlainText();
    // clean mention
    const block = content.getFirstBlock();
    const entityKey = block.getEntityAt(0);
    let message;
    if (!entityKey) {
      message = text;
    } else {
      const entity = content.getEntity(entityKey);
      // sync with content;
      const mentionText = getMentionText(entity.getData());
      message = text.replace(mentionText, '');
    }

    // empty message.
    if (!message.trim()) {
      return;
    }
    this.props.onSubmit(message);
  };

  // EDITOR RELATED
  // createEmptyState = () => EditorState.createEmpty();
  keyBindingFn = (e) => {
    // if (e.keyCode === 13 && KeyBindingUtil.hasCommandModifier(e)) {
    //   return 'submit';
    // }
    if (e.keyCode === 13) {
      return 'submit';
    }
    return getDefaultKeyBinding(e);
  };

  handleKeyCommand = (command) => {
    if (command === 'submit') {
      this.sendMessage();
      return 'handled';
    }
    if (command === 'backspace') {
      const { editorState } = this.props;
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const firstBlock = contentState.getFirstBlock();
      const entityKey = selection.isCollapsed()
        ? firstBlock.getEntityAt(selection.getStartOffset() - 1)
        : firstBlock.getEntityAt(selection.getStartOffset());

      if (entityKey) {
        const entiyRemoved = Modifier.removeRange(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: selection.getEndOffset(),
            isBackward: false,
          }),
        );
        const newState = EditorState.push(
          editorState,
          entiyRemoved,
          'remove-range',
        );
        this.onEditorChange(
          EditorState.forceSelection(
            newState,
            entiyRemoved.getSelectionAfter(),
          ),
        );
        return 'handled';
      }
    }
    return 'not-handled';
  };

  render() {
    const { editorState, placeholder, sendingMessage, style } = this.props;
    return (
      <Row
        className="IM-TextBox"
        style={style}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {sendingMessage && <div className="IM-TextBox__sendingHint">...</div>}
        <div className="IM-TextBox__inner">
          <Editor
            ref={(editor) => {
              this.editor = editor;
            }}
            placeholder={placeholder}
            editorState={editorState}
            onChange={this.onEditorChange}
            mentionOptions={this.getMentionOptions()}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            handleReturn={this.handleReturn}
            stripPastedStyles
          />
        </div>
      </Row>
    );
  }
}

TextBox.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.node,
  sendingMessage: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onEditorChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  roomId: PropTypes.string,
};

export default TextBox;
