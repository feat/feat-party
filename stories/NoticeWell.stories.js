import React from 'react';
import NoticeWell from '@/components/NoticeWell';

export default {
  title: 'NoticeWell',
  component: NoticeWell,
};

const style = {
  width: 300,
  height: 300,
  margin: 40,
}


export const Example = () => (
  <div style={style}>
    <NoticeWell>
      <h3>Title</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos provident temporibus pariatur perferendis. Vel optio totam quo sapiente praesentium provident atque possimus molestiae dolorum dignissimos vitae, necessitatibus nemo tenetur? Doloremque.</p>
    </NoticeWell>
  </div>
)
