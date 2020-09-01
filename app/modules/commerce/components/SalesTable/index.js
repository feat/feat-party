import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@feat/feat-ui/lib/button';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';

import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import DashTable from '../DashTable';
import OrderItem from '../SalesOrderItem';
import intlMessages from '../../messages';

class SalesTable extends Component {
  state = {};

  handleBasicClick = (item) => {
    this.setState(
      (prevState) => ({
        activeItem: prevState.activeItem === item.id ? undefined : item.id,
      }),
    );
  };

  changeSort = (key) => {
    // TODO change sort;
    logging.debug(key);
  };

  renderHeader() {
    return (
      <DashTable.Header>
        <div className="cm-SalesOrderBasic cm-SalesOrderBasic_header padding_x_12">
          <div className="cm-SalesOrderBasic__lot">
            <Button type="merge" onClick={() => this.changeSort('id')}>
              #
            </Button>
          </div>
          <div className="cm-SalesOrderBasic__date">
            <Button type="merge">
              <TranslatableMessage message={intlMessages.dateLabel} />
            </Button>
          </div>
          <div className="cm-SalesOrderBasic__description">
            <Button type="merge">
              <TranslatableMessage message={intlMessages.descriptionLabel} />
            </Button>
          </div>
          <div className="cm-SalesOrderBasic__quantity">
            <Button type="merge">
              <TranslatableMessage message={intlMessages.quantityLabel} />
            </Button>
          </div>
          <div className="cm-SalesOrderBasic__remark">
            <Button type="merge">
              <TranslatableMessage message={intlMessages.remarkLabel} />
            </Button>
          </div>
          <div className="cm-SalesOrderBasic__expense">
            <Button type="merge">
              <TranslatableMessage message={intlMessages.expenseLabel} />
            </Button>
          </div>
        </div>
      </DashTable.Header>
    );
  }

  render() {
    const { data, loading, loadMore, hasMore, onceFetched } = this.props;
    return (
      <DashTable>
        <DashTable.Main>
          {this.renderHeader()}
          <DashTable.Content>
            {data &&
              data.map((item) => (
                <OrderItem
                  key={item.id}
                  data={item}
                  isActive={item.id === this.state.activeItem}
                  onBasicClick={this.handleBasicClick}
                />
              ))}
            {onceFetched &&
              !loading &&
              data &&
              !data.length && (
              <div>
                <TranslatableMessage
                  message={intlMessages.noSalesOrderHint}
                />
              </div>
            )}
            {hasMore && (
              <LoadMoreAnchor loading={loading} loadMore={loadMore} />
            )}
            {loading &&
              (!data || !data.length) && <MaskLoader loadeSize="sm" />}
          </DashTable.Content>
        </DashTable.Main>
      </DashTable>
    );
  }
}

SalesTable.propTypes = {
  onceFetched: PropTypes.bool,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  data: PropTypes.array,
  loadMore: PropTypes.func.isRequired,
};

export default SalesTable;
