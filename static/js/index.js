(function() {
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
                 .then(function(registration) {
                 console.log('Service Worker Registered');
                 return registration;
        })
        .catch(function(err) {
          console.error('Unable to register service worker.', err);
        });
        navigator.serviceWorker.ready.then(function(registration) {
          console.log('Service Worker Ready');
        });
      });
    }
  })();
  
  let deferredPrompt;
  const btnAdd = document.querySelector('#btn-add');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnAdd.style.visibility = 'visible';
    // e.showInstallPromotion();
    console.log('beforeinstallprompt event fired');
  });
  
  btnAdd.addEventListener('click', async(e) => {
    // e.hideInstallPromotion();
    btnAdd.style.visibility = 'hidden';
    deferredPrompt.prompt();
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      });
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  });
  
  window.addEventListener('appinstalled', () => {

    hideInstallPromotion();

    deferredPrompt = null;

    app.logEvent('app', 'installed');

    console.log('PWA succesfully installed');
  });

  document.querySelector("#scanButton").onclick = async () => {
    const ndef = new NDEFReader();
    // Prompt user to allow website to interact with NFC devices.
    await ndef.scan();
    ndef.onreading = event => {
      // TODO: Handle incoming NDEF messages.
    };
  };


  if ('NDEFReader' in window) {
    const ndef = new NDEFReader();
    ndef.scan().then(() => {
      console.log("Scan started successfully.");
      ndef.onreadingerror = () => {
        console.log("Cannot read data from the NFC tag. Try another one?");
      };
      ndef.onreading = event => {
        const message = event.message;
        for (const record of message.records) {
          console.log(message.records[0].data.buffer);
          var data = new Uint8Array(message.records[0].data.buffer);
          var str ="";
          data.forEach(element => {
            str +=String.fromCharCode(element) 
          });
          var json = JSON.parse(str);
          console.log(json.reg);
          console.log(json.nfcid);
          // console.log(message.records[0].data.buffer.byteLength);
          // for(var i=0; i<message.records[0].data.buffer.byteLength; i++)  {
          //   data +=String.fromCharCode(message.records[0].data.buffer."[[Int8Array]]"[i]) 
          // };
          // console.log(data);
          // console.log("Record type:  " + record.recordType);
          // console.log("MIME type:    " + record.mediaType);
          // console.log("Record id:    " + record.id);
          switch (record.recordType) {
            case "text":
              // TODO: Read text record with record data, lang, and encoding.
              break;
            case "url":
              // TODO: Read URL record with record data.
              break;
            default:
              // TODO: Handle other records with record data.
          }
        }
      };
    }).catch(error => {
      console.log(`Error! Scan failed to start: ${error}.`);
    });
  }