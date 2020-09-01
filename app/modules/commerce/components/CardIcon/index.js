import React from 'react';
import PropTypes from 'prop-types';

import amex from '@feat/payment-icons/min/flat/amex.svg';
import dankort from '@feat/payment-icons/min/flat/dankort.svg';
import hipercard from '@feat/payment-icons/min/flat/hipercard.svg';
import discover from '@feat/payment-icons/min/flat/discover.svg';
import jcb from '@feat/payment-icons/min/flat/jcb.svg';
import laser from '@feat/payment-icons/min/flat/laser.svg';
import maestro from '@feat/payment-icons/min/flat/maestro.svg';
import mastercard from '@feat/payment-icons/min/flat/mastercard.svg';
import unionpay from '@feat/payment-icons/min/flat/unionpay.svg';
import visaElectron from '@feat/payment-icons/min/flat/visa-electron.svg';
import visa from '@feat/payment-icons/min/flat/visa.svg';
import elo from '@feat/payment-icons/min/flat/elo.svg';
import diners from '@feat/payment-icons/min/flat/diners.svg';

const map = {
  amex,
  dankort,
  hipercard,
  discover,
  jcb,
  laser,
  maestro,
  mastercard,
  unionpay,
  visaElectron,
  visa,
  elo,
  diners,
};

function CardIcon(props) {
  if (props.icon && map[props.icon]) {
    return (
      <span
        className="cm-PayMethodIcon"
        dangerouslySetInnerHTML={{
          __html: map[props.icon],
        }}
      />
    );
  }
  return <span>{props.type}</span>;
}

CardIcon.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.string,
}

export default CardIcon;
