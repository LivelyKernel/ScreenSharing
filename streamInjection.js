(function(streamId) {
    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId
            }
        }
    },
    function onSuccess(stream) {
        var url = URL.createObjectURL(stream);
        var vid = document.getElementById('screen');
        vid.src = url;
        vid.play();
    },
    function onError() {
        alert('Failed to get user media.');
    });
})(streamId);