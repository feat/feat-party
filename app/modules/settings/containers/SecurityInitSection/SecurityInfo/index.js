import React from 'react';
import PropTypes from 'prop-types';

import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormValueStatic from '@feat/feat-ui/lib/form/FormValueStatic';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import FieldItem from '@/components/FieldItem';

import intlMessages from '../messages';

function SecurityInfo(props) {
  const { data } = props;
  return (
    <div>
      <FieldItem
        label={
          <FormLabel>
            <TranslatableMessage message={intlMessages.securityHint} />
          </FormLabel>
        }
        content={
          <FormValueStatic size="sm" block>
            {data.question}
          </FormValueStatic>
        }
        modifier="dashed"
      />
      <FieldItem
        label={
          <FormLabel>
            <TranslatableMessage message={intlMessages.securityResponse} />
          </FormLabel>
        }
        content={
          <FormValueStatic size="sm" block>
            *******
          </FormValueStatic>
        }
        modifier="dashed"
      />
      <FieldItem />
    </div>
  );
}

SecurityInfo.propTypes = {
  data: PropTypes.object,
};
export default SecurityInfo;
