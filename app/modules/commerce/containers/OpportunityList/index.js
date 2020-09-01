import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import { selectOpportunityList } from '../../selectors';

import { asyncFetchOpportunities } from '../../actions/opportunity-dash';

function OpportunityList(props) {
  const dispatch = useDispatch();
  const listState = useSelector((state) => selectOpportunityList(state, props));
  const handleLoadMore = useCallback(
    () => {
      const query = {
        search: props.search,
        sortField: props.sortField,
        order: props.order,
        type: props.type,
      };
      if (listState && listState.next) {
        query.pageSize = listState.next.page_size;
        query.page = listState.next.page;
      }
      dispatch(asyncFetchOpportunities(query)).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    },
    [props, listState],
  );

  useEffect(
    () => {
      if (!listState) {
        handleLoadMore();
      }
    },
    [props],
  );

  return props.children({
    data: listState ? listState.items : [],
    onceFetched: listState ? listState.onceFetched : false,
    hasMore: listState ? !!listState.next : true,
    loading: listState ? listState.isFetching : false,
    loadMore: handleLoadMore,
    meta: {},
    // markItemAsRead: this.markDemandUpdateAsRead,
    // initDemandCreation: this.props.initDemandCreation,
    // joinChannel: this.props.joinChannel,
    // getDemandBids: this.props.getDemandBids,
    // cancelDemand: this.props.cancelDemand,
    // closeDemand: this.props.closeDemand,
    // selectWinner: this.props.selectWinner,
    // blackUser: this.props.blackUser,
  });
}

export default OpportunityList;
