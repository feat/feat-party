import React from 'react';
import { action } from '@storybook/addon-actions';
import ActionMenu from '@/components/ActionMenu';

export default {
  title: 'ActionMenu',
  component: ActionMenu,
};

export const Example = () => (
  <div style={{ width: 300, background: '#f3f3f3', display: 'flex' }}>
    <div style={{ flex: 1 }}>Item</div>
    <ActionMenu 
      actions={
        [
          { 
            label: 'Action 1', 
            key: 'action_1',
            onClick: action('onClick'),
          },
          { 
            label: 'Action 2', 
            key: 'action_2',
            onClick: action('onClick'),
          },
        ]
      }
    />
  </div>
)