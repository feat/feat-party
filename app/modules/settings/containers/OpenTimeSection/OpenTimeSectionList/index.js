import React from 'react';
import PropTypes from 'prop-types';
import OpenTimeSection from './OpenTimeSection';
import './style.scss';

export default function OpenTimeSectionList({ data }) {
  return (
    <div className="OpenTimeSectionList">
      {/* {data.map((item) => (
        <OpenTimeSection key={item.weekdays.join('_')} data={item} />
      ))} */}
      <OpenTimeSection data={data} />
    </div>
  );
}

OpenTimeSectionList.propTypes = {
  data: PropTypes.array,
};
