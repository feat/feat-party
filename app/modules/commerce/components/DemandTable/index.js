import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';

import DashTable from '../DashTable';
import DemandItem from '../DemandItem';
import DemandCreateTrigger from '../DemandCreateTrigger';

import intlMessages from './messages';

import './style.scss';

class DemandTable extends Component {
  renderHeader() {
    return (
      <div className="cm-DemandTable__header">
        <div className="cm-DemandTable__headerInner" />
      </div>
    );
  }

  render() {
    const { data, loading, loadMore, hasMore, onceFetched } = this.props;
    return (
      <DashTable className="cm-DemandTable">
        <DashTable.Main className="cm-DemandTable__container">
          {this.renderHeader()}
          <DashTable.Content className="cm-DemandTable__content">
            {data &&
              data.map((item) => (
                <DemandItem
                  key={item.id}
                  data={item}
                />
              ))}
            {onceFetched &&
              !loading &&
              data &&
              !!data.length && (
              <div>
                <TranslatableMessage message={intlMessages.noDemandsLabel} />
              </div>
            )}
            {(!data || !data.length) && loading && <MaskLoader />}
            {hasMore && (
              <LoadMoreAnchor loadMore={loadMore} loading={loading} />
            )}
          </DashTable.Content>
          <DashTable.Footer className="cm-DemandTable__footer">
            <div className="cm-DemandTable__actions">
              <DemandCreateTrigger>
                <TranslatableMessage message={intlMessages.newDemandLabel} />
              </DemandCreateTrigger>
            </div>
          </DashTable.Footer>
        </DashTable.Main>
      </DashTable>
    );
  }
}

DemandTable.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  onceFetched: PropTypes.bool,
  loadMore: PropTypes.func,

};

export default DemandTable;
