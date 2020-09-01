import React, { useState } from 'react';
import InlineCarouselSelect from '@/components/InlineCarouselSelect';

export default {
  title: 'InlineCarouselSelect',
  component: InlineCarouselSelect,
};

const options = [
  {
    value: 'item1',
    label: 'Item 1',
  },
  {
    value: 'item2',
    label: 'Item 2',
  },
  {
    value: 'item3',
    label: 'Item 3',
  },
  {
    value: 'item4',
    label: 'Item 4',
  },
  {
    value: 'item5',
    label: 'Item 5',
  },
  {
    value: 'item6',
    label: 'Item 6',
  },
   
]

export const Example = () => {
  const [value, setValue] = useState();
  return (
    <div style={{ width: 400, margin: 40 }}>
      <InlineCarouselSelect
        options={options}
        value={
          value
        }
        onChange={(item) => {
          setValue(item.value)
        }}
        renderLabel={(item) => item.label}
        valueExtractor={(item) => item.value}
      />
          
    </div>
  )
}