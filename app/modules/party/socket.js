import notification from '@feat/feat-ui/lib/notification'
import createSocket from '@/utils/createSocket';

const socket = createSocket('/party', {
  autoConnect: false,
});

socket.on('after-join-room', (packet) => {
  if (packet.error) {
    notification.error({
      message: 'Failed to join party channel',
      description: packet.message,
      duration: null,
    })
    // check login status
    fetch('/api/user/basic-info/').then((res) => {
      if (res.status < 500) {
        window.location.reload();
      }
    });
  }
});

export default socket;
