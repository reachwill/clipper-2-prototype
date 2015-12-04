var View = {


    activeView: 'dashboardPage',

    //called at page load to configure start interafce
    init: function () {
        View.hideThing($('#clipPropsEditor'), 'sudden');
        View.hideThing($('#annotationEditor'), 'sudden');

        View.hideThing($('#remoteControls'), 'sudden');

        View.controller.changeView('collectionsSection', $('a[data-view=collectionsSection]'));
        View.clearFields($('#clipPropsEditor'));
        $('.tabContent,#createClipLnk').not('#createAnnosPane').hide();
        $('#createAnnosLnk').addClass('active');
        View.activeView = 'dashboardPage';

    },

    hideThing: function (thing, how) {
        switch (how) {
        case 'sudden':
            thing.hide();
            break;
        case 'slideUp':
            thing.slideUp();
            break;
        case 'fade':
            thing.fadeOut();
            break;
        }


    },

    showThing: function (thing, how) {
        switch (how) {
        case 'slideDown':
            thing.slideDown();
            break;
        case 'fade':
            thing.fadeIn();
            break;
        }
    },

    setAnnoDefaultTime: function () {
        if ($('#annoStartTime').val() == '') {
            $('#annoStartTime').val(ProjectManager.activeClip.start);
        }
    },

    populateFields: function () {
        var activeClip = ProjectManager.activeClip;
        $('#clipTitleTxt').val(activeClip.title);
        $('#clipDescTxt').val(activeClip.description);
        $('#startTxt').val(activeClip.start);
        $('#endTxt').val(activeClip.end);
        $('#clipTagsTxt').val(activeClip.tags);
        View.updateAnnoPane();
    },

    clearFields: function (container) {
        container.find('input,textarea').val('');
    },

    updateAnnoPane: function () {
        var activeClip = ProjectManager.activeClip;
        $('.annosBelongTo').text(activeClip.title);
        View.updateClipAnnoList();

    },

    updateNum: function (element) {
        switch (element) {
        case 'numResources':
            $('#numResources').text(' (' + ProjectManager.activeProject.resources[0].length + ')');
            break;
        case 'numClips':
            var singular = 'clip';
            (ProjectManager.activeProject.cliplists[0][0].clips.length > 1) ? singular = 'clips': singular = 'clip';
            $('.numClips').text(' (' + ProjectManager.activeProject.cliplists[0][0].clips.length + ')');
            break;
        case 'numAnnos':

            //alert(ProjectManager.activeClip.annotations.length)
            if (ProjectManager.activeClip != undefined) {
                $('#numAnnos').text(' (' + ProjectManager.activeClip.annotations.length + ')');
            }

            break;
        }
    },

    updateAnnoStartField: function (time) {
        $('#annoStartTime').val(Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime()));
    },

    updateTimerDisplays: function () {
        $('.annotationTimeDisplay,.globalAnnotationTimeDisplay').text(Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime()));
    },



    updateCustomTimeline: function () {
        var activeClip = ProjectManager.activeClip;
        var activePlayer = ClipperPlayer.activePlayer;
        var vidDuration = activePlayer.duration();
        //console.log(vidDuration)
        if (vidDuration != undefined && vidDuration != 0) {
            if (activeClip != null) {
                var startPercent = (Math.round(((Utilities.HMSToSecs(activeClip.start)) / vidDuration) * 100));

                var endPercent = (Math.round(((Utilities.HMSToSecs(activeClip.end)) / vidDuration) * 100));
                var clipDuration = endPercent - startPercent;

                $('#vidPlayhead').html('<div class="clipTimeline" style="width:' + clipDuration + '%;margin-left:' + startPercent + '%"></div><div class="playhead"></div>');
                var vidPos = Math.round(ClipperPlayer.activePlayer.currentTime());

                if (vidPos <= Utilities.HMSToSecs(activeClip.end) && vidPos >= Utilities.HMSToSecs(activeClip.start)) {
                    $('#vidPlayhead .playhead').css({
                        'left': ((vidPos / ClipperPlayer.activePlayer.duration()) * 100) + '%',
                        'top': 0
                    });
                    //$('#vidPlayhead .clipTimeline').css('background','repeating-linear-gradient(45deg,transparent,transparent 10px,#ccc 10px,#ccc 20px),linear-gradient(to bottom,#eee,rgba(0,255,0,0.1)');
                    $('#vidPlayhead .clipTimeline').addClass('clipTimeSpan');
                } else {
                    //$('#vidPlayhead .clipTimeline').css('background','white');
                }
            }




        } else {
            //$('#vidPlayhead .clipTimeline').css('background','white');
        }
    },

    //called from any location in the application when an element is to be enabled for user interaction.
    //param id String - value of the html element's id attribute
    enableElement: function (id) {
        $('#' + id).attr('disabled', false);
    },
    //called when a search request has returned search results and are ready to be displayed to the user.
    //param results Object - contains an array of results
    //param type String - eg youtube , vimeo etc
    renderSearchResults: function (results, type) {
        var preparedResults;

        //pass results off to be prepared by relevant utility based on collection type
        switch (type) {
        case 'youtube':
            preparedResults = YoutubeSearchRenderer.getPropsArray(results);
            break; // js/clipper/renderers/YoutubeSearchRenderer.js
        }

        // render results using Handlebars templating API
        var source = document.getElementById("searchResultsTemplate").innerHTML; //the template structure to be used by handlebars <script id="searchResultsTemplate"...
        var template = Handlebars.compile(source); //compile the template structure
        var output = template(preparedResults); //generate the actual HTML to be displayed
        $("#searchResults").html(output); //display the HTML
    },


    //called when a local file has been selected enabling the button and updating the data attributes
    enableAddToProjectLink: function (fileObj) {
        var file = fileObj.context.files[0];
        var fileURL = URL.createObjectURL(file);
        var link = fileObj.parent().find('.addToProjectLnk');
        link.attr('data-title', file.name);
        link.attr('data-description', 'Local');
        link.attr('data-thumbnail', Config.base_url + 'css/eyecandy/notebook-512.png');
        link.attr('data-videoid', fileURL);
        link.attr('data-sourcetype', 'blob');
        link.html('<i class="icon-plus"></i>');

    },

    //called when a clip is added to a cliplist
    updateClipsInClipList: function (cliplistIndex) {

        var arrayToRender = {
            items: []
        };

        var numItems = ProjectManager.activeProject.cliplists[cliplistIndex][0].clips.length;
        for (var i = 0; i < numItems; i++) {
            var item = ProjectManager.activeProject.cliplists[cliplistIndex][0].clips[i];
            arrayToRender.items.push({
                title: item.title,
                id: item.id,
                description: item.description,
                start: item.start,
                end: item.end,
                thumbnail: item.thumbnail,
                sourcetype: item.sourceType,
                resource: item.resource
            });
        }

        // render results using Handlebars templating API
        var source = document.getElementById("cliplistsClipsTemplate").innerHTML; //the template structure to be used by handlebars <script id="projectResourcesTemplate"...

        var template = Handlebars.compile(source); //compile the template structure
        var output = template(arrayToRender); //generate the actual HTML to be displayed
        $('.clipsPane').html(output); //display the HTML



    },

    //called when a clip is added to a cliplist
    updateClipAnnoList: function () {

        var arrayToRender = {
            items: []
        };


        var numItems = ProjectManager.activeClip.annotations.length;
        for (var i = 0; i < numItems; i++) {
            var item = ProjectManager.activeClip.annotations[i];
            arrayToRender.items.push({
                text: item.text,
                id: item.clipper_anno_id,
                start: item.start,
                end: item.end,
                parentclipid: ProjectManager.activeClip.clipper_clip_id
            });
        }

        // render results using Handlebars templating API
        var source = document.getElementById("savedAnnosTemplate").innerHTML; //the template structure to be used by handlebars <script id="projectResourcesTemplate"...

        var template = Handlebars.compile(source); //compile the template structure
        var output = template(arrayToRender); //generate the actual HTML to be displayed
        $("#savedAnnosPane").html(output); //display the HTML
    },




    //called when project is loaded and when a new cliplist is defined
    updateCliplistList: function () {

        var arrayToRender = {
            items: []
        };


        if (ProjectManager.activeProject.cliplists != undefined) {
            var numItems = ProjectManager.activeProject.cliplists.length;
            for (var i = 0; i < numItems; i++) {
                var item = ProjectManager.activeProject.cliplists[i][0].cliplist;

                //create array of clips held within cliplist
                var numClips = ProjectManager.activeProject.cliplists[i][0].clips.length;

                var clips = [];
                for (var c = 0; c < numClips; c++) {
                    //choose thumbnail (youtube dynamic) or other vids with no thumb use static thumb
                    var thumbnail;
                    (ProjectManager.activeProject.cliplists[i][0].clips[c].clip.type == 'youtube') ? thumbnail = ProjectManager.activeProject.cliplists[i][0].clips[c].clip.thumbnail: thumbnail = ProjectManager.activeProject.cliplists[i][0].clips[c].clip.thumbnail;

                    //organise the annotations for each clip
                    var numAnnos = ProjectManager.activeProject.cliplists[i][0].clips[c].annos.length;
                    var annos = [];
                    for (var a = 0; a < numAnnos; a++) {
                        var anno = ProjectManager.activeProject.cliplists[i][0].clips[c].annos[a];

                        annos.push({
                            start: anno.start,
                            end: anno.end,
                            text: anno.text,
                            clipper_anno_id: anno.clipper_anno_id,
                            parent_clip_id: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.clipper_clip_id,
                            resource: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.resource_uri,
                            sourcetype: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.type,
                            owner: ProjectManager.activeProject.owner + '/',
                            projectId: ProjectManager.activeProject.projectId + '/',
                            baseUrl: Config.base_url + 'users/'


                        });
                    }


                    clips.push({
                        title: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.title,
                        tags: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.tags,
                        description: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.description,
                        id: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.clipper_clip_id,
                        start: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.start,
                        end: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.end,
                        thumbnail: thumbnail,
                        resource: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.resource_uri,
                        sourcetype: ProjectManager.activeProject.cliplists[i][0].clips[c].clip.type,
                        annos: annos,
                        numAnnos: annos.length,
                        owner: ProjectManager.activeProject.owner + '/',
                        projectId: ProjectManager.activeProject.projectId + '/',
                        baseUrl: Config.base_url + 'users/'
                    });
                }
                arrayToRender.items.push({
                    title: item.title,
                    id: item.id,
                    description: item.description,
                    clips: clips,
                    owner: ProjectManager.activeProject.owner + '/',
                    projectId: ProjectManager.activeProject.projectId + '/',
                    baseUrl: Config.base_url + 'users/'
                });
            }
        }

        // render results using Handlebars templating API
        var source = document.getElementById("projectCliplistsTemplate").innerHTML; //the template structure to be used by handlebars <script id="projectResourcesTemplate"...

        var template = Handlebars.compile(source); //compile the template structure
        var output = template(arrayToRender); //generate the actual HTML to be displayed
        $("#cliplistsPane").html(output); //display the HTML
        //$('.clipAnnosList').hide();
        //$('.clipAnnosList').hide();
        //View.hideThing($('.quickAnnoStartLnk'), 'sudden');
        //View.hideThing($('.clipAnnosList'), 'sudden');
        //View.controller.resetClipControls();
        View.hideThing($('.clipAnnosList'), 'sudden');
        $('#clips').sortable({
            update: function (event, ui) {
                DBCommunicator.updateCliplistOrder();
            },
            start: function (event, ui) {
                //ui.helper.css('opacity','.4')

            },
            placeholder: "ui-state-highlight"
        });

    },

    //called when resource is added to a project's resource list
    updateResourceList: function () {

        var arrayToRender = {
            items: []
        };

        if (ProjectManager.activeProject.resources != undefined) {

            var latestResourceList = ProjectManager.activeProject.resources.length - 1;

            //need to fix here - get latest array

            var numItems = ProjectManager.activeProject.resources[0].length;


            for (var i = 0; i < numItems; i++) {

                var item = ProjectManager.activeProject.resources[0][i];
                if (item == undefined) {
                    item = ProjectManager.activeProject.resources[i];
                }

                arrayToRender.items.push({
                    title: item.title,
                    videoid: item.videoid,
                    description: item.description,
                    thumbnail: item.thumbnail,
                    sourcetype: item.sourcetype
                });
                //console.log(item.title)
            }
        }
        // render results using Handlebars templating API
        var source = document.getElementById("projectResourcesTemplate").innerHTML; //the template structure to be used by handlebars <script id="projectResourcesTemplate"...

        var template = Handlebars.compile(source); //compile the template structure
        var output = template(arrayToRender); //generate the actual HTML to be displayed

        $("#projectResourcesPanel").html(output); //display the HTML

    },


    //called when project is created and also on first load
    updateExistingProjectsList: function () {

        var arrayToRender = {
            items: []
        };

        var numItems = ProjectManager.existingProjects.length;
        for (var i = 0; i < numItems; i++) {
            var item = ProjectManager.existingProjects[i];
            arrayToRender.items.push({
                projectTitle: item.projectTitle,
                projectId: item.projectId,
                projectDesc: item.projectDesc,
                projectResourceCount: item.projectResourceCount,
                projectCliplistCount: item.projectCliplistCount,
                projectClipsCount: item.projectClipsCount
            });
        }
        // render results using Handlebars templating API
        var source = document.getElementById("existingProjectsTemplate").innerHTML; //the template structure to be used by handlebars <script id="projectResourcesTemplate"...

        var template = Handlebars.compile(source); //compile the template structure
        var output = template(arrayToRender); //generate the actual HTML to be displayed

        $("#existingProjectsPane").hide().html(output).fadeIn(); //display the HTML
    },
    controller: {
        resetClipControls: function () {
            $('.previewLnk').show();
            $('.pauseLnk').hide().find('i').removeClass('icon-play').addClass('icon-pause');


            /*$('#clips>li').each(function(index, element) {
            	$(this).find('.clipAnnosList').find('.quickAnnoStartLnk').hide();
            	if(ProjectManager.activeClip!=null){
            		console.log($(this).attr('id')!=ProjectManager.activeClip.clipper_clip_id)
            		if($(this).attr('id')!=ProjectManager.activeClip.clipper_clip_id){
            			$(this).find('>.clipAnnosList').find('.quickAnnoStartLnk').show();
            		}
            	}
            });*/



        },
        openDialog: function (clickObj, type) {
            switch (type) {
            case 'shareClip':
                clickObj.next('.shareTxt').slideDown();;
                break;
            case 'shareCliplist':
                clickObj.next('.shareCliplistTxt').slideDown();;
                break;
            case 'shareAnno':
                clickObj.next('.shareAnnoTxt').slideDown();;
                break;
            }
        },
        changeView: function (view, clicked) {
            $('#projectPage>header nav a').removeClass('active');
            clicked.addClass('active');
            $('#projectPage>section').hide();
            $('#' + view).fadeIn(500);
            //hide the clipEditor controls
            View.activeView = view;
            //console.log('View: '+View.activeView +'  Clipmode: '+ClipperPlayer.clipMode)
            if (View.activeView != 'collectionsSection' && ClipperPlayer.clipMode == false) {

                $('#createClipLnk').show();

            } else {
                $('#createClipLnk').hide();
            }
            if (ClipperPlayer.activePlayer == null) {
                $('#createClipLnk').hide();
            }

            //pause video when user navigates between tabs
            if (ClipperPlayer.activePlayer != null) {
                ClipperPlayer.activePlayer.pause();
            }

        },
        changeAnnoEditorView: function (view, clicked) {
            $('#annotationEditor .tabLink').removeClass('active');
            clicked.addClass('active');
            $('#annotationEditor .tabContent').hide();
            $('#' + view).fadeIn(500);
            //hide the clipEditor controls
            $('#saveAnnoLink').notify("Type your annotation and click save", {
                className: 'info',
                position: 'bottom',
                autoHideDelay: Config.notifyDelay
            });
        },
        toggle: function (linkClicked) {
            linkClicked.parent().find('.clipAnnosList').toggle();
            if (linkClicked.parent().find('.clipAnnosList').is(':visible')) {
                linkClicked.find('.edit').html('<i class="icon-toggle-on"> Annotations');
            } else {
                linkClicked.find('.edit').html('<i class="icon-toggle-off"> Annotations');
            }
        }
    },
    loadProject: function (data, refresh) {
        //update the view based on project change

        if (refresh != true) {
            //change to project view
            PageNavigator.changePage('projectPage');
            //reset sub nav in project page to colections view
            View.controller.changeView('collectionsSection', $('a[data-view=collectionsSection]'));

            //close youtube search

            //eject clip
            ProjectManager.ejectActiveClip();
            if (ClipperPlayer.activePlayer != null) {
                ClipperPlayer.activePlayer.src(null);
            }

            $('.addToProjectLnk').html('<i class="icon-plus"></i>');
            $('#searchResults').html('');

            $('#json-preview').html('');
        }
        View.updateResourceList();
        View.updateCliplistList();
        View.updateNum('numResources');
        View.updateNum('numClips');
        View.updateNum('numAnnos');


    }

}
