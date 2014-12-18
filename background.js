// show the extension symbol when there is lively-web in the url or
// localhost:9001, if the server is running locally
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log('onUpdated ' + tab.url);
    if (tab.url.indexOf('lively-web') != -1 || tab.url.indexOf('localhost:9001') != -1) {
        chrome.pageAction.show(tabId);
    }
});

// onUpdated doesn't fire with correct url when new tab is created,
// so we also listen to onReplaced
chrome.tabs.onReplaced.addListener(function(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        if (tab.url.indexOf('lively-web') != -1 || tab.url.indexOf('localhost:9001') != -1) {
            chrome.pageAction.show(tabId);
        }
    });
});

function initiateDesktopCapture() {
    chrome.tabs.query({active: true}, function(tabs) {
        var tabId = tabs[0].id;
        chrome.desktopCapture.chooseDesktopMedia([
            'screen', 'window' //, 'tab'
        ], tab, function(streamId) {
            if (chrome.runtime.lastError) {
                alert('Failed to get desktop media: ' + chrome.runtime.lastError.message);
                return;
            }

            chrome.tabs.executeScript(tab.id, {
                code: 'var streamId = ' + JSON.stringify(streamId) + ';'
            }, 
            function() {
                chrome.tabs.executeScript(tab.id, {
                    file: 'streamInjection.js'
                },
                function() {
                    if (chrome.runtime.lastError) {
                        alert('Failed to execute script: ' +
                            chrome.runtime.lastError.message);
                    }
                });
            });         
        }); 
    });
}

// listen to incoming messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    debugger;
    console.log(message);
    if (message && message.request === 'initiateDesktopCapture') {
        initiateDesktopCapture();
    }
});


chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.desktopCapture.chooseDesktopMedia([
        'screen', 'window' //, 'tab'
    ], tab, function(streamId) {
        if (chrome.runtime.lastError) {
            alert('Failed to get desktop media: ' + chrome.runtime.lastError.message);
            return;
        }

        chrome.tabs.executeScript(tab.id, {
            code: 'var streamId = ' + JSON.stringify(streamId) + ';'
        }, 
        function() {
            chrome.tabs.executeScript(tab.id, {
                file: 'streamInjection.js'
            },
            function() {
                if (chrome.runtime.lastError) {
                    alert('Failed to execute script: ' +
                        chrome.runtime.lastError.message);
                }
            });
        });         
    }); 
});