import React from 'react';
import PropTypes from 'prop-types';

const AddressItem = ({ data }) => <div>{data.formatted}</div>;

AddressItem.propTypes = {
  data: PropTypes.shape({
    formatted: PropTypes.string,
  }),
};

export default AddressItem;
