var YoutubeSearch = {
    handleAPILoaded: function () {
        //register the api key ready for search requests
        gapi.client.setApiKey('AIzaSyBbeuQDIFpMxnDNxPWhXOEVMpaBzgyMBjY');
        View.enableElement('youtubeSearchBtn');
    },
    makeRequest: function () {
        var q = $('#query').val();
        var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet',
            maxResults: 50
        });
        request.execute(function (response) {
            View.renderSearchResults(response.result, 'youtube');
        });
    }
}


function googleApiClientReady() {
    //ready for any intialisation required when youtube data API is loaded into browser
    gapi.client.load('youtube', 'v3', function () {
        //call method to register credentials
        YoutubeSearch.handleAPILoaded();
    });
}
