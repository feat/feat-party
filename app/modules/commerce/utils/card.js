export const defaultFormat = /(\d{4})(?=\d)/g;
export const DEFAULT_CVC_LENGTH = 3;
export const cards = [
  {
    type: 'amex',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    lengths: [15],
    cvcLength: 4,
    luhn: true,
  },
  {
    type: 'dankort',
    pattern: /^5019/,
    format: defaultFormat,
    lengths: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'hipercard',
    pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
    format: defaultFormat,
    maxNumberLength: 19,
    cvcLength: 3,
    luhn: true,
  },
  {
    type: 'dinersclub',
    pattern: /^(36|38|30[0-5])/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    lengths: [14],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    lengths: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'jcb',
    pattern: /^35/,
    format: defaultFormat,
    maxNumberLength: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'laser',
    pattern: /^(6706|6771|6709)/,
    format: defaultFormat,
    lengths: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: true,
    icon: 'laser',
  },
  {
    type: 'maestro',
    pattern: /^(5018|5020|5038|6304|6703|6708|6759|676[1-3])/,
    format: defaultFormat,
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'mastercard',
    pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
    format: defaultFormat,
    lengths: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'unionpay',
    pattern: /^62/,
    format: defaultFormat,
    lengths: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false,
  },
  {
    type: 'visaelectron',
    pattern: /^4(026|17500|405|508|844|91[37])/,
    format: defaultFormat,
    lengths: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'elo',
    pattern: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021)/,
    format: defaultFormat,
    lengths: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'visa',
    pattern: /^4/,
    format: defaultFormat,
    lengths: [13, 16, 19],
    cvcLength: [3],
    luhn: true,
  },
];

export const getCardNumber = (num) => `${num}`.replace(/\D/g, '');

export const getCardType = (num, types = []) => {
  const options = types.length
    ? cards.filter((item) => types.indexOf(item.type) > -1)
    : cards;
  return options.find((item) => item.pattern.test(num));
};

export const getCardTypeInfo = (type) =>
  cards.find((item) => item.type === type);

export const getCardTypes = (num, types = []) => {
  const options = types.length
    ? cards.filter((item) => types.indexOf(item.type) > -1)
    : cards;
  const numberString = getCardNumber(num);
  return options.filter((item) => item.pattern.test(numberString));
};

export const formatCardNumber = (num, type) => {
  if (!type) {
    return num.replace(defaultFormat, '$1 ');
  }
  const { format } = type;
  if (format.global) {
    return num.replace(format, '$1 ');
  }
  const formatCard = num.match(format);
  formatCard.shift();
  return formatCard.filter((card) => card).join(' ');
};

export const formatExpiry = (event) => {
  const eventData = event.nativeEvent && event.nativeEvent.data;
  const prevExpiry = event.target.value.split(' / ').join('/');

  if (!prevExpiry) return null;
  let expiry = prevExpiry;
  if (/^[2-9]$/.test(expiry)) {
    expiry = `0${expiry}`;
  }

  if (prevExpiry.length === 2 && prevExpiry > 12) {
    const [head, ...tail] = prevExpiry;
    expiry = `0${head}/${tail.join('')}`;
  }

  if (/^1[/-]$/.test(expiry)) {
    return `01 / `;
  }

  expiry = expiry.match(/(\d{1,2})/g) || [];
  if (expiry.length === 1) {
    if (!eventData && prevExpiry.includes('/')) {
      return expiry[0];
    }
    if (/\d{2}/.test(expiry)) {
      return `${expiry[0]} / `;
    }
  }
  if (expiry.length > 2) {
    expiry.pop();
    const [, month, year] = expiry.join('').match(/^(\d{2}).*(\d{2})$/) || [];
    return [month, year].join(' / ');
  }
  return expiry.join(' / ');
};

export const hasCVCReachedMaxLength = (type, currentValueLength) => {
  if (!type) {
    return currentValueLength >= DEFAULT_CVC_LENGTH;
  }
  return currentValueLength >= type.cvcLength;
};

export function luhnCheck(num) {
  let odd = true;
  let sum = 0;

  const digits = `${num}`.split('').reverse();
  digits.forEach((item) => {
    let digit = parseInt(item, 10);
    if (!odd) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    odd = !odd;
  });
  return sum % 10 === 0;
}
