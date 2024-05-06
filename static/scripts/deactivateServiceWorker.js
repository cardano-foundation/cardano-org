// this script addresses https://github.com/cardano-foundation/cardano-org/issues/44 
// it checks if the browser supports service workers and if it does, it retrieves 
// all active service worker registrations and unregisters each one of them

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    registrations.forEach(function(registration) {
      registration.unregister();
    });
  });
}

