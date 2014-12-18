var extensionId = JSON.stringify(chrome.runtime.id);
var script = document.createElement('script');
script.id = 'injection-script';
script.textContent = 'var id = ' + extensionId + '; (' + function() {
	debugger;
	window.initiateDesktopCapture = function() {
		console.log(id);
		chrome.runtime.sendMessage(id, {
			request: 'initiateDesktopCapture'
		});
	};
} + ')();';

document.documentElement.appendChild(script);