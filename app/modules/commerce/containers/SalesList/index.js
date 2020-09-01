import { useCallback, useEffect }from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import notification from '@feat/feat-ui/lib/notification';

import { selectSalesList } from '../../selectors';
import { 
  asyncFetchSalesOrders, 
} from '../../actions/sales'

function SalesList(props) {
  const dispatch = useDispatch();
  const listState = useSelector((state) => selectSalesList(state, props));
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
    dispatch(asyncFetchSalesOrders(query)).catch(
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

SalesList.propTypes = {
  children: PropTypes.func,
}

export default SalesList;