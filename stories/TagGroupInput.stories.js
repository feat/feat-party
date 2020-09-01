import React, { useState } from 'react';
import TagGroupInput from '@/components/TagGroupInput';
import request from '@/utils/request';

export default {
  title: 'TagGroupInput',
  component: TagGroupInput,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}
const fetchAsyncOptions = (name) => request({
  url: '/api/user/apply-scene/',
  method: 'GET',
  params: { name },
}).then(({ data }) => data.map((item) => ({
  data: {
    value: item.label,
    label: item.label,
  },
  key: name,
})));


export const Example = () => {
  const [state, setState ] = useState([]);
  return (
    <div style={style}>
      <TagGroupInput
        autoFocus
        placeholder="Apply scenes"
        value={state}
        onChange={setState}
        asyncOptions={fetchAsyncOptions}
      />
    </div>
  )
}