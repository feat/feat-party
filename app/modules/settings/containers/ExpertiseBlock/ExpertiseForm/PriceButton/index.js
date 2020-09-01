import React, { useState, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types';
import { formatMessage } from '@/services/intl';
import { isDirty } from '@/utils/form';
// import SwitchButton from '@feat/feat-ui/lib/switch-button'
import Button from '@feat/feat-ui/lib/button';
import { 
  serviceType as serviceTypeMessages,
} from '@/modules/commerce/messages';

import './style.scss'

function PriceButton(props) {
  const { data, unitOptions, onChangeUnit, onChangePrice, onFocus, onBlur, showTypeLabel } = props;
  const [active, setActive] = useState(false);
  const [price, setPrice] = useState('');
  useEffect(() => {
    if (!active) {
      setPrice('');
    }
  }, [data.price, active]);

  const typeLabel = formatMessage(serviceTypeMessages[data.type]);

  return (
    <div 
      className={classNames("PriceButton", {
        'is-active': active,
      })}
    >
      <span className="PriceButton__label">
        {showTypeLabel && (
          <span className="PriceButton__typeLabel">{typeLabel}</span>
        )}

        <div className="PriceButton__unitOptions">
          {unitOptions.map((option) => (
            <Button
              key={option.value}
              className={classNames("PriceButton__unitLabel", {
                'is-selected': data.unit === option.value,
              })}
              onClick={() => {
                onChangeUnit(option.value);
              }}
              onFocus={() => {
                setActive(true);
                onFocus();
              }}
              onBlur={() => {
                setActive(false);
                onBlur();
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* <SwitchButton
          className="PriceButton__unitLabel"
          options={unitOptions}
          initialValue={props.data.unit}
          onChange={onChangeUnit}
          onFocus={() => {
            setActive(true);
          }}
          onBlur={() => {
            setActive(false);
          }}
        /> */}
      </span>
      <input 
        className="PriceButton__priceInput"
        value={price}
        placeholder={props.data.price || '--'}
        onChange={(e) => {
          const { value } = e.target;
          const isValidInput = /(?:^\d{1,10}\.\d{0,2}?$)|(?:^\d{0,10}$)/.test(value);
          if (isValidInput) {
            setPrice(value);
            onChangePrice(value);
          }
        }}
        onFocus={() => {
          setActive(true);
          onFocus();
        }}
        onBlur={() => {
          setActive(false);
          onBlur();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && props.onConfirm) {
            props.onConfirm();
          } else if (e.key === 'Backspace' && !price) {
            setPrice('');
            onChangePrice('');
          }
        }}
      />
    </div>
  )
}

PriceButton.propTypes = {
  data: PropTypes.object,
  unitOptions: PropTypes.array,
  onChangeUnit: PropTypes.func,
  onChangePrice: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onConfirm: PropTypes.func,
  showTypeLabel: PropTypes.bool,
}

export default PriceButton;

export function NotControlledPirceButton(props) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data)
  }, [props.data]);
  const submitTimer = useRef(null);
  const submitCallback = useCallback(
    () => {
      if (isDirty(data, props.data)) {
        props.onSubmit(data);
      }
    },
    [data, props.data],
  )

  useEffect(() => {
    clearTimeout(submitTimer.current);
  }, [])
  
  return (
    <PriceButton 
      data={data}
      unitOptions={props.unitOptions}
      showTypeLabel={false}
      onChangeUnit={(value) => {
        setData({
          ...data,
          unit: value,
        });
        submitTimer.current =  setTimeout(submitCallback, 500);
      }}
      onChangePrice={(price) => {
        setData({
          ...data,
          price,
          is_available: !!price,
        })
      }}
      onBlur={( ) => {
        submitTimer.current =  setTimeout(submitCallback, 500);
      }}
      onFocus={( ) => {
        // clearTimeout
        clearTimeout(submitTimer.current);
      }}
      onConfirm={() => {
        submitCallback();
      }}
    />
  )
}

NotControlledPirceButton.propTypes = {
  data: PropTypes.object,
  unitOptions: PropTypes.array,
  onSubmit: PropTypes.func,
}