// this background script has permissions to invoke desktopCapture API

// listen to messages sent via port in livelyInjection.js
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(message) {
        if (message === 'lively-capture-choose-source') {
            chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], port.sender.tab, function(source) {
                if (source) {
                    port.postMessage({'lively-capture-got-source': source});
                } else {
                    port.postMessage('lively-capture-canceled');
                }
            });
        }
    });
});