self.addEventListener('push', function (event) {
  let payload = {};
  try { payload = event.data.json(); } catch(e) { payload = { title: 'Notification', body: '' }; }
  const title = payload.title || 'Notification';
  const options = {
    body: payload.body || '',
    data: payload.data || {},
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = `/orders/${event.notification.data?.orderId || ''}`;
  event.waitUntil(clients.matchAll({type: 'window'}).then( windowClients => {
    for (let client of windowClients) {
      if (client.url.includes('/') && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
