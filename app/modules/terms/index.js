import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import notification from '@feat/feat-ui/lib/notification';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import commonMessages from '@/messages/common';

import { selectTerm } from './selectors';
import { asyncFetchTerm } from './actions';

class Terms extends React.PureComponent {
  componentDidMount() {
    if (!this.props.data && !this.props.onceFetched) {
      this.props.fetchTerm({
        slug: this.props.slug,
      }).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  render() {
    const { data, fetchError, style } = this.props;
    if (fetchError) {
      return <div>{fetchError.message}</div>;
    }
    if (!data) {
      return (
        <div>
          <TranslatableMessage message={commonMessages.loading} />
        </div>
      );
    }
    const {
      terms_text_block: { title, content },
    } = data;
    return (
      <article className="typo-Article" style={style}>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    );
  }
}

Terms.propTypes = {
  style: PropTypes.object,
  slug: PropTypes.string,
  data: PropTypes.object,
  // fetching: PropTypes.bool,
  onceFetched: PropTypes.bool,
  fetchError: PropTypes.object,
  fetchTerm: PropTypes.func,
};


const withConnect = connect(
  selectTerm,
  {
    fetchTerm: asyncFetchTerm,
  },
);

export default compose(
  withConnect,
)(Terms);
