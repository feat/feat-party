import { useCallback, useEffect }from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import notification from '@feat/feat-ui/lib/notification';

import { selectPurchaseList } from '../../selectors';
import { 
  asyncFetchPurchaseOrders, 
} from '../../actions/purchase'

function PurchaseList(props) {
  const dispatch = useDispatch();
  const listState = useSelector((state) => selectPurchaseList(state, props));
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
    dispatch(asyncFetchPurchaseOrders(query)).catch(
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
  
    
  return props.children({
    data: listState ? listState.items : [],
    hasMore: listState ? !!listState.next : true,
    loading: listState ?  listState.isFetching : false,
    onceFetched: listState ?  listState.onceFetched : false,
    loadMore: handleLoadMore,
  })
}

PurchaseList.propTypes = {
  children: PropTypes.func,
}

export default PurchaseList;