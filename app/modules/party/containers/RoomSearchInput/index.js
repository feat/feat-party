import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Popover from '@feat/feat-ui/lib/popover';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';
import Button from '@feat/feat-ui/lib/button';

import { formatMessage } from '@/services/intl';

import {
  updateFilter,
  initArchiveQuery,
  resetArchiveQuery,
} from '../../actions';

import './style.scss';

import mMessage from '../../messages';

function RoomSearchInput(props) {
  const { roomId } = props;
  const filter = props.filter || props.activeFilter || {};
  const pickerPop = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [roomId]);

  return (
    <div
      className="IM-RoomSearchForm"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        ref={input}
        className="IM-RoomSearchInput"
        value={filter.keywords || ''}
        onChange={(e) => {
          const updated = { ...filter };
          if (e.target.value) {
            updated.keywords = e.target.value;
          } else {
            delete updated.keywords;
          }
          props.updateFilter({
            roomId,
            data: updated,
          })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (filter.keywords || filter.from_date)) {
            props.initArchiveQuery({
              roomId,
            });
          }
        }}
        placeholder={formatMessage(mMessage.roomSearchPlaceholder)}
      />
      <div className="IM-RoomSearchForm__picker">
        <Popover 
          placement="top"
          ref={pickerPop}
          content={
            <FlatDatePicker 
              yearRange={72}
              pickerMode="history"
              onChange={(value) => {
                props.updateFilter({
                  roomId,
                  data: {
                    ...filter,
                    from_date: value,
                  },
                });
                if (pickerPop.current) {
                  pickerPop.current.closePortal();
                }
                props.initArchiveQuery({ roomId })
              }}
            /> 
          }
        >
          <Button block>
            {filter.from_date ? filter.from_date.format('YYYY MM DD') : formatMessage(mMessage.dateFilterPlaceholder) }
          </Button>
        </Popover>
      </div>
      {/* <div className="IM-RoomSearchForm__submit">
        <Button
          onClick={() => {
            props.initArchiveQuery({
              roomId,
            })
          }}>
          {formatMessage(mMessage.queryLabel)}
        </Button>
      </div> */}
      <div className="IM-RoomSearchForm__reset">
        <Button
          onClick={() => {
            props.resetArchiveQuery({
              roomId,
            });
          }}
        >
          {formatMessage(mMessage.resetLabel)}
        </Button>
      </div>
    </div>
  );
}

RoomSearchInput.propTypes = {
  roomId: PropTypes.string,
  filter: PropTypes.object,
  activeFilter: PropTypes.object,
  updateFilter: PropTypes.func,
  initArchiveQuery: PropTypes.func,
  resetArchiveQuery: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const { roomId } = props;
  const mapped = {
    filter: get(state, ['party', 'roomInfo', roomId, 'filter']),
    activeFilter: get(state, ['party', 'roomInfo', roomId, 'activeFilter']),
  };
  return mapped;
};

const mapDispatchToProps = {
  updateFilter,
  initArchiveQuery,
  resetArchiveQuery,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(RoomSearchInput);
