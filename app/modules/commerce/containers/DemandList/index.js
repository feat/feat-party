import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import { selectDemandList } from '../../selectors';
import { asyncFetchDemands } from '../../actions/demand-dash';
import { asyncGetDemandBids, joinChannel } from '../../actions/demand';


function DemandList(props) {
  const dispatch = useDispatch();
  const listState = useSelector((state) => selectDemandList(state, props));
  const handleLoadMore = useCallback(() => {
    const query = {
      search: props.search,
      sortField: props.sortField,
      order: props.order,
      pageSize: props.pageSize,
    }
    if (listState && listState.next) {
      query.pageSize = listState.next.page_size;
      query.page = listState.next.page;
    }
    dispatch(asyncFetchDemands(query)).catch(
      (err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      }
    )
  }, [props, listState]);
  useEffect(() => {
    if (!listState) {
      handleLoadMore();
    }
  }, [props])

  const handleGetDemendBids = useCallback((data) => dispatch(asyncGetDemandBids(data)), [])
  const handleJoinChannel = useCallback((data) => {
    dispatch(joinChannel(data))
  }, [])

  return props.children({
    data: listState ? listState.items : [],
    onceFetched: listState ? listState.onceFetched : false,
    hasMore: listState ? !!listState.next : true,
    loading: listState ? listState.isFetching : false,
    loadMore: handleLoadMore,
    meta: {},
    getDemandBids: handleGetDemendBids,
    joinChannel: handleJoinChannel,
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

export default DemandList;