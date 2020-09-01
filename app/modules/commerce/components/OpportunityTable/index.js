import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import Button from '@feat/feat-ui/lib/button';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';

import DashTable from '../DashTable';
import OpportunityItem from '../OpportunityItem';
import intlMessages from './messages';

import './style.scss';

class OpportunityTable extends Component {
  switchType = (value) => {
    const updated = {...this.props.filter, type: value};
    this.props.onFilterUpdate(updated);
  }

  renderHeader() {
    return (
      <DashTable.Header className="cm-OpportunityTable__header">
        <div className="cm-OpportunityTable__headerInner">
          <Button
            onClick={() => {
              this.switchType('new');
            }}
            className={classNames({
              'is-selected': this.props.filter.type === 'new',
            })}
          >
            <TranslatableMessage message={intlMessages.newOpportunityLabel} />
          </Button>
          <Button
            onClick={() => {
              this.switchType('participated');
            }}
            className={classNames({
              'is-selected': this.props.filter.type === 'participated',
            })}
          >
            <TranslatableMessage message={intlMessages.participatedLabel} />
          </Button>
        </div>
      </DashTable.Header>
    );
  }

  render() {
    const { data, loading, loadMore, hasMore, onceFetched } = this.props;
    return (
      <DashTable className="cm-OpportunityTable">
        <DashTable.Main className="cm-OpportunityTable__container">
          {this.renderHeader()}
          <DashTable.Content className="cm-OpportunityTable__content">
            {data &&
              data.map((item) => (
                <OpportunityItem
                  key={item.id}
                  data={item}
                />
              ))}
            {onceFetched &&
              !loading &&
              data &&
              !data.length && (
              <div>
                <TranslatableMessage
                  message={intlMessages.noOpportunitiesLabel}
                />
              </div>
            )}
            {(!data || !data.length) && loading && <MaskLoader />}
            {hasMore && (
              <LoadMoreAnchor loadMore={loadMore} loading={loading} />
            )}
          </DashTable.Content>
          <DashTable.Footer className="cm-OpportunityTable__footer">
            <div className="cm-OpportunityTable__actions" />
          </DashTable.Footer>
        </DashTable.Main>
      </DashTable>
    );
  }
}

OpportunityTable.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  onceFetched: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  filter: PropTypes.object,
  onFilterUpdate: PropTypes.func,
};

export default OpportunityTable;
