var YOUTUBE_URL = 'https://www.youtube.com/watch?v=';
var DEFAULT_VIDEO_THUMB = Config.base_url + 'css/icons/1441652014_film_clip_movie_timestamp.svg';
var DEFAULT_AUDIO_THUMB = Config.base_url + 'css/icons/audio-resource.png';
var DEFAULT_PASTED_THUMB = Config.base_url + 'css/eyecandy/www.png';


var ClipperPlayer = {

    previewPlayer: null,
    youtubePlayer: null,
    currentVideo: null,
    activeRangeSlider: null,
    activePlayer: null,
    timer: null,
    clipMode: false,
    annoMode: false,
    cliplistMode: false,
    currentClip: 0,
    clipsToPlay: null,



    getCurrentVideo: function () {
        return ClipperPlayer.currentVideo;
    },

    setClipStartEnd: function () {
        /*var slider;
        if (ClipperPlayer.activeRangeSlider == mplayer2) {
            slider = mplayer2;
        } else {
            slider = mplayer;
        }*/
        var start = Utilities.HMSToSecs($('#startTxt').val());
        var end = Utilities.HMSToSecs($('#endTxt').val());
        //slider.setValueSlider(start,end);
    },

    getClipStart: function () {
        var slider;
        if (ClipperPlayer.activeRangeSlider == mplayer2) {
            slider = mplayer2;
        } else {
            slider = mplayer;
        }
        var values = slider.getValueSlider();
        //return videojs.round(values.start, 2);
        return Utilities.secsToHMS(values.start, 2);
    },

    getClipEnd: function () {
        var slider;
        if (ClipperPlayer.activeRangeSlider == mplayer2) {
            slider = mplayer2;
        } else {
            slider = mplayer;
        }
        var values = slider.getValueSlider();
        //return videojs.round(values.start, 2);
        return Utilities.secsToHMS(values.end, 2);
    },

    secsToHMS: function (totalSec) {
        var hours = parseInt(totalSec / 3600) % 24;
        var minutes = parseInt(totalSec / 60) % 60;
        var seconds = Math.floor(totalSec % 60);
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    },

    HMSToSecs: function (hms) {
        var hms = hms; // your input string
        var a = hms.split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    },

    playCliplist: function () {
        var self = ClipperPlayer;
        self.cliplistMode = true;
        var clipToPlay = self.clipsToPlay[self.currentClip].clip;

        var element = $('<a data-videoid="' + clipToPlay.resource_uri + '" data-title="' + clipToPlay.title + '" data-description="' + clipToPlay.description + '" data-thumbnail="' + clipToPlay.thumbnail + '" data-sourcetype="' + clipToPlay.type + '" data-clipid="' + clipToPlay.clipper_clip_id + '"></a>');
        //modify data object for youtube player
        if (clipToPlay.type == 'youtube') {
            element = {
                context: {
                    dataset: {
                        videoid: clipToPlay.resource_uri,
                        title: clipToPlay.title,
                        description: clipToPlay.description,
                        thumbnail: clipToPlay.thumbnail
                    }
                }
            }
        }
        ProjectManager.setActiveClip(clipToPlay.clipper_clip_id);
        ClipperPlayer.play(clipToPlay.type, element, true);
    },


    play: function (sourceType, source, clip) {


        $('.annotationTimeDisplay').text('00:00:00');


        var sourceObj;
        switch (sourceType) {
        case 'blob':
            sourceObj = ClipperPlayer.prepareBlob(source);
            //$('.addToProjectLnk').data('blob', sourceObj.videoURL);
            break;
        case 'local':
            sourceObj = ClipperPlayer.prepareLocal(source);
            //$('.addToProjectLnk').data('blob', sourceObj.videoURL);
            break;
        case 'remote':
            sourceObj = ClipperPlayer.prepareRemote(source);
            break;
        case 'mp3':
            sourceObj = ClipperPlayer.prepareMP3(source);
            break;
        case 'youtube':
            sourceObj = ClipperPlayer.prepareYoutube(source);
            break;
        case 'pasted':
            sourceObj = ClipperPlayer.preparePasted(source);
            break;

        }

        ClipperPlayer.currentVideo = sourceObj;

        if (sourceType == 'youtube') {
            ClipperPlayer.activePlayer = ClipperPlayer.youtubePlayer;
            ClipperPlayer.youtubePlayer.src({
                "type": sourceObj.type,
                "src": sourceObj.videoURL
            });
            ClipperPlayer.youtubePlayer.play();
            ClipperPlayer.previewPlayer.pause();
            $('#html5Player').hide();
            $('#youtubePlayer').show();
            ClipperPlayer.activeRangeSlider = mplayer2;
        } else {
            ClipperPlayer.activePlayer = ClipperPlayer.previewPlayer;
            ClipperPlayer.previewPlayer.src({
                "type": sourceObj.type,
                "src": sourceObj.videoURL
            });
            ClipperPlayer.previewPlayer.play();
            ClipperPlayer.youtubePlayer.pause();
            $('#youtubePlayer').hide();
            $('#html5Player').show();
            ClipperPlayer.activeRangeSlider = mplayer;
        }

        //if we are previewing a clip
        if (clip == true) {
            //set ClipperPlayer to clipMode
            ClipperPlayer.clipMode = true;





            //if we are viewing the youtube player we don't get loadedmetadata so have to trigger currentTime play start here

            if (ClipperPlayer.activePlayer == ClipperPlayer.youtubePlayer) {
                //get reference to Project Manager's current active clip
                var activeClip = ProjectManager.activeClip;

                //move playhead to start of clip
                ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs(activeClip.start));


            }
            //start monitoring clip as it plays
            ClipperPlayer.monitorClipPlayback();

            //ClipperPlayer.activeRangeSlider.playBetween(Utilities.HMSToSecs(activeClip.start), Utilities.HMSToSecs(activeClip.end));
            //ClipperPlayer.activeRangeSlider.setValueSlider(10, 20);


            View.showThing($('#clipPropsEditor'), 'slideDown');
            View.hideThing($('#createClipLnk'), 'sudden');
            View.populateFields();


        } else if (clip == 'anno') {

            //set ClipperPlayer to clipMode
            ClipperPlayer.clipMode = true;
            ClipperPlayer.annoMode = true;

            //if we are viewing the youtube player we don't get loadedmetadata so have to trigger currentTime play start here

            if (ClipperPlayer.activePlayer == ClipperPlayer.youtubePlayer) {
                //get reference to Project Manager's current active clip
                var activeAnno = ProjectManager.activeAnno;
                var activeClip = ProjectManager.activeClip;

                //move playhead to start of clip
                ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs(activeAnno.start));
            }
            //start monitoring clip as it plays
            ClipperPlayer.monitorClipPlayback();

            View.showThing($('#clipPropsEditor'), 'slideDown');
            View.hideThing($('#createClipLnk'), 'sudden');
            View.populateFields();
        } else {
            //reset ClipperPlayer.clipMode to false
            ClipperPlayer.clipMode = false;

        }

    },

    //returns object prepared for a locally sourced video
    prepareBlob: function (source) {


        return {
            sourceType: 'blob',
            videoURL: source.data('videoid'),
            lastModified: null,
            name: source.data('name'),
            type: 'video/mp4',
            thumbnail: DEFAULT_VIDEO_THUMB,
            description: null,
            title: source.data('name')

        };
    },

    //returns object prepared for a video url pasted into box
    preparePasted: function (source) {
        //with the expectation that people will wish to link to files hosted on Dropbox we have to manipulate the Dropbox share link.
        //In order to play remotely, Dropbox files need to have the URL param raw=1 appended to the URL.
        //The following code crudely checks for existing params by searching for a ? then adds raw=1
        var url = $('#remoteAddressTxt').val();
        //check for existing url params eg dropbox default share link has params
        var existingParams = url.indexOf('?');
        if (existingParams == -1) {
            url += '?raw=1';
        } else {
            url += '&raw=1';
        }
        return {
            sourceType: 'remote',
            videoURL: url,
            lastModified: null,
            name: $('#remoteTitle').val(),
            type: 'video/webm',
            thumbnail: DEFAULT_PASTED_THUMB,
            description: null,
            title: source.data('name')

        };
    },


    //returns object prepared for a remote video
    prepareRemote: function (source) {

        return {
            sourceType: 'remote',
            videoURL: source.data('videoid'),
            lastModified: null,
            name: source.data('name'),
            type: 'video/mp4',
            thumbnail: DEFAULT_VIDEO_THUMB,
            description: null,
            title: source.data('name')

        };
    },

    //returns object prepared for a remote audio
    prepareMP3: function (source) {

        return {
            sourceType: 'audio-remote',
            videoURL: source.data('videoid'),
            lastModified: null,
            name: source.data('name'),
            type: 'audio/mp3',
            thumbnail: 'http://reachwill.co.uk/clipper2/wp-content/css/icons/audio-resource.ico',
            description: null,
            title: source.data('name')

        };
    },

    //returns object prepared for a locally sourced video
    prepareLocal: function (source) {
        var file = source.context.files[0];
        var type = file.type;
        var fileURL = URL.createObjectURL(file);

        return {
            sourceType: 'local',
            videoURL: fileURL,
            lastModified: file.lastModifiedDate,
            name: file.name,
            type: file.type,
            thumbnail: DEFAULT_VIDEO_THUMB,
            description: null,
            title: file.name

        };
    },

    //returns object prepared for a youtube sourced video
    prepareYoutube: function (source) {

        var formattedURL = YOUTUBE_URL + source.context.dataset.videoid;
        var title = source.context.dataset.title;
        var description = source.context.dataset.description;
        var thumbnail = source.context.dataset.thumbnail;

        return {
            sourceType: 'youtube',
            videoURL: formattedURL,
            lastModified: null,
            name: title,
            type: 'video/youtube',
            thumbnail: thumbnail,
            description: description,
            title: title

        };
    },


    monitorClipPlayback: function () {

        var self = ClipperPlayer;
        var activeClip = ProjectManager.activeClip;
        var activePlayer = self.activePlayer;

        //prepare custom timeline
        View.updateCustomTimeline();



        if (activePlayer.currentTime() < Utilities.HMSToSecs(activeClip.end)) {

            setTimeout(self.monitorClipPlayback, 25)
        } else {
            activePlayer.pause();
            if (self.cliplistMode == true) {
                if (self.currentClip < self.clipsToPlay.length - 1) {
                    self.currentClip++;
                    self.playCliplist();
                } else {
                    console.log('finished playing cliplist');
                    self.cliplistMode = false;
                    self.clipsToPlay = null;
                    self.currentClip = 0;
                }
            }
            View.controller.resetClipControls();
        }

    },
    metaReady: function () {
        if (ClipperPlayer.activePlayer != null) {
            if (ProjectManager.activeClip != null || ProjectManager.activeClip != undefined) {
                var activeClip = ProjectManager.activeClip;



                //check if user is attempting to play from an annotation start point
                if (ClipperPlayer.annoMode == true) {
                    var activeAnno = ProjectManager.activeAnno;
                    //move playhead to start of clip
                    ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs(activeAnno.start));
                } else {
                    //move playhead to start of clip
                    ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs(activeClip.start));
                }


                //start monitoring clip as it plays
                ClipperPlayer.monitorClipPlayback();
            }

            //ClipperPlayer.activeRangeSlider.setValueSlider(0, ClipperPlayer.activePlayer.duration());
        }
    }
}

//instantiation of videojs players instances for previewing videos before adding to projects
videojs("previewer", {
    "techOrder": ["youtube"],
    "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ"
}).ready(function () {
    ClipperPlayer.previewPlayer = this;
    this.on('loadedmetadata', function () {
        ClipperPlayer.metaReady();
    });
    this.on('timeupdate', function () {
        View.updateTimerDisplays();
    });
});

videojs("previewer-youtube", {
    "techOrder": ["youtube"],
    "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ"
}).ready(function () {
    ClipperPlayer.youtubePlayer = this;
    this.on('loadedmetadata', function () {
        ClipperPlayer.metaReady();
    });
    this.on('timeupdate', function () {
        View.updateTimerDisplays();
    });
});
