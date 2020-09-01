import formatMessageTime, { formatLocalTime } from '../formatMessageTime';

describe('test Party formatMessageTime util', () => {
  it('test formatMessageTime', () => {
    const dateString = '2018-11-26T06:40:27Z'; // utc;
    const output = formatMessageTime(dateString);

    expect(output).toEqual('11 26 14:40:27');
  });

  it('test formatLocalTime', () => {
    const dateString = '2018-11-26T06:40:27Z'; // utc;
    const timezone = 'Asia/Shanghai';
    const output = formatLocalTime(dateString, undefined, timezone);
    expect(output).toEqual('14:40:27');
  });
});
