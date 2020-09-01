import { getContactName } from './contact';

export default function(owner, members) {
  const compos = [];
  compos.push(owner.username || owner.id);
  members.forEach((member) => {
    compos.push(getContactName(member));
  });
  return compos.join(', ');
}
