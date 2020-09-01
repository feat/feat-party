import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';

import Button from '@feat/feat-ui/lib/button'
import { initDemandCreation } from '../../actions/demand-creation';

function DemandCreateTrigger(props) {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => {
        dispatch(initDemandCreation());
      }}>
      {props.children || 'New Demand'}
    </Button>
  )
}

DemandCreateTrigger.propTypes = {
  children: PropTypes.node,
}

export default DemandCreateTrigger;