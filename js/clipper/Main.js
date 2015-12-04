$(document).ready(function () {


    View.init();

    DBCommunicator.getAllProjects();
    //View.updateExistingProjectsList();


    //collapse the collections panels
    $('#collectionsSection .panel .content').hide();
    $('#collectionsSection .panel h2').click(function () {
        var content = $(this).parent().find('.content');
        content.toggle();
    });



    $('#cliplistsPane').on('keyup', '#searchTxt', function (e) {
        e.preventDefault();
        $('#clips>li').removeHighlight();
        var valThis = String($(this).val().toLowerCase());
        $('#clips>li').highlight($(this).val()).each(function () {
            var titletext = $(this).find('.clipTitle').text().toLowerCase();
            var descText = $(this).find('.description').text().toLowerCase();
            var tagsText = $(this).find('.tags').text().toLowerCase();

            if (titletext.indexOf(valThis) != -1 || descText.indexOf(valThis) != -1 || tagsText.indexOf(valThis) != -1) {
                $(this).fadeIn();
            } else {
                $(this).fadeOut();
            }

        });
    });




    //when user clicks quick edit project title and desc
    $('#existingProjectsPane').on('click', '.quickEditLnk', function (e) {
        e.preventDefault();
        var clipper_project_id = $(this).data('projectid')
        var titleTxt = $(this).parent().parent().find('h2 span.edit');
        var descTxt = $(this).parent().parent().find('.projectDesc');
        //check editMode of button
        //if !hasClass('editMode')
        if ($(this).hasClass('editMode')) {
            //set annotation to be editable and focus
            titleTxt.attr('contenteditable', 'false').focus();
            descTxt.attr('contenteditable', 'false').focus();
            DBCommunicator.save('projectDesc', {
                'title': titleTxt.text(),
                'description': descTxt.text(),
                'clipper_project_id': clipper_project_id
            });
            //revert button to quick edit mode
            $(this).removeClass('editMode').html('<i class="icon-pencil"></i>');
        } else {
            //set annotation to be editable and focus
            titleTxt.attr('contenteditable', 'true').focus();
            descTxt.attr('contenteditable', 'true').focus();
            //change button to saver
            $(this).addClass('editMode').html('<i class="icon-floppy"></i>');
        }
    });

    //when user clicks to open a project in the projects dashboard
    $('#existingProjectsPane').on('click', '.openProjectLnk', function (e) {

        var projectId = ($(this).data('projectid'));
        //invoke call to go get the project data from the database
        DBCommunicator.getProjectData(projectId);

    });

    //when user clicks to archive a project in the projects dashboard
    $('#existingProjectsPane').on('click', '.archiveProjectLnk', function (e) {

        var projectId = ($(this).data('projectid'));
        //invoke call to go get the project data from the database
        DBCommunicator.archiveProject(projectId);

    });

    //when user clicks to create a new project
    $('#createProjectBtn').click(function (e) {
        e.preventDefault();

        if ($('#newProjectTitle').val() != '') {
            $('#existingProjectsPane').notify("Project Created", {
                className: 'success',
                position: 'top',
                autoHideDelay: Config.notifyDelay
            });
            ProjectManager.createNewProject($('#newProjectFrm'));
        } else {
            $('#newProjectTitle').notify("Title required!", {
                className: 'error',
                position: 'top',
                autoHideDelay: Config.notifyDelay
            });
        }

    });

    //when user adds a resource by manually pasting in a URL
    $('#loadRemoteBtn').click(function (e) {
        if ($('#remoteTitle').val() == '') {
            $('#remoteTitle').notify("Title required!", {
                className: 'error',
                position: 'top',
                autoHideDelay: Config.notifyDelay
            });
        } else {
            if ($('#remoteDesc').val() == '') {
                $('#remoteDesc').notify("Description required!", {
                    className: 'error',
                    position: 'top',
                    autoHideDelay: Config.notifyDelay
                });
            } else {

                if ($('#remoteAddressTxt').val() == '') {
                    $('#remoteAddressTxt').notify("URL required!", {
                        className: 'error',
                        position: 'top',
                        autoHideDelay: Config.notifyDelay
                    });
                } else {
                    //with the expectation that people will wish to link to files hosted on Dropbox we have to manipulate the Dropbox share link.
                    //In order to play remotely, Dropbox files need to have the URL param raw=1 appended to the URL.
                    //The following code crudely checks for existing params by searching for a ? then adds raw=1
                    var url = $('#remoteAddressTxt').val();
                    //check for existing url params eg dropbox default share link has params
                    if (url.indexOf('dropbox') != -1) {
                        var existingParams = url.indexOf('?');
                        if (existingParams == -1) {
                            url += '?raw=1';
                        } else {
                            url += '&raw=1';
                        }
                    }

                    View.showThing($('#remoteControls'), 'fade');
                    $('#remotePlayLnk,#remoteAddLnk').attr('data-title', $('#remoteTitle').val()).attr('data-videoid', url).attr('data-description', $('#remoteDesc').val());

                }


            }
        }

    });

    //when user clicks to peform a youtube search request
    $('#youtubeSearchBtn').click(function (e) {
        e.preventDefault();
        YoutubeSearch.makeRequest();
    });

    //when user has browsed to a file on local system
    $('#localSearchInput').change(function (e) {
        e.preventDefault();
        ClipperPlayer.play('local', $(this));
        View.enableAddToProjectLink($(this));
        ProjectManager.ejectActiveClip();
    });

    //when user clicks preview link in the manually added remote section
    $('#remoteAddress').on('click', '.previewLnk', function (e) {
        e.preventDefault();
        var sourcetype = ($(this).data('sourcetype'))
        ClipperPlayer.play(sourcetype, $(this)); //do this media check at play()//
        ProjectManager.ejectActiveClip();
        $('#remoteAddress .previewLnk').removeClass('green');
        $(this).addClass('green');
        $('#remoteAddress li').removeClass('greenFaded');
        $(this).parent().addClass('greenFaded');
    });

    //when user clicks preview link in a search result or project resources
    $('#searchResults,#projectResourcesPanel,#remoteAddress').on('click', '.previewLnk', function (e) {
        e.preventDefault();
        var sourcetype = ($(this).data('sourcetype'))
        ClipperPlayer.play(sourcetype, $(this)); //do this media check at play()//
        ProjectManager.ejectActiveClip();
        $('#searchResults .previewLnk,#projectResourcesPanel .previewLnk,#remoteAddress .previewLnk').removeClass('green');
        $(this).addClass('green');
        $('#searchResults li,#projectResourcesPanel li,#remoteAddress li').removeClass('greenFaded');
        $(this).parent().addClass('greenFaded');
    });

    //when user clicks preview link on a clip in cliplist
    $('#cliplistsSection').on('click', '.previewLnk', function (e) {
        e.preventDefault();



        //reset all play/pause buttons
        View.controller.resetClipControls();
        $(this).hide().parent().find('.pauseLnk').fadeIn();
        $(this).parent().find('.quickAnnoStartLnk').fadeIn();


        var sourcetype = ($(this).data('sourcetype'));
        ProjectManager.setActiveClip($(this).data('clipid'));
        ClipperPlayer.play(sourcetype, $(this), true); //3rd param boolean clip = true
        $('#cliplistsSection .previewLnk').removeClass('green');
        $(this).addClass('green');
        $('#cliplistsSection li').removeClass('greenFaded');
        $(this).parent().addClass('greenFaded');


    });

    //when user clicks preview link on a clip in cliplist
    $('#cliplistsSection').on('click', '.pauseLnk', function (e) {
        e.preventDefault();
        if (ClipperPlayer.activePlayer.paused()) {
            ClipperPlayer.activePlayer.play();
        } else {
            ClipperPlayer.activePlayer.pause();
        }
        if ($(this).find('i').hasClass('icon-play')) {
            $(this).find('i').removeClass('icon-play');
            $(this).find('i').addClass('icon-pause');
        } else {
            $(this).find('i').removeClass('icon-pause');
            $(this).find('i').addClass('icon-play');
        }
    });

    //when user clicks share link on a clip in cliplist
    $('#cliplistsSection').on('click', '.shareLnk', function (e) {
        e.preventDefault();
        View.controller.openDialog($(this), 'shareClip');
        $(this).parent().find('.shareTxt').notify("Copy this link and share..", {
            className: 'info',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });
    });

    //when user clicks share a cliplist
    $('#cliplistsSection').on('click', '.shareCliplistLnk', function (e) {
        e.preventDefault();
        View.controller.openDialog($(this), 'shareCliplist');
        $(this).parent().find('.shareCliplistTxt').notify("Copy this link and share..", {
            className: 'info',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });
    });

    //when user clicks share an annotation
    $('#cliplistsSection').on('click', '.shareAnnoLnk', function (e) {
        e.preventDefault();
        View.controller.openDialog($(this), 'shareAnno');
        $(this).parent().find('.shareAnnoTxt').notify("Copy this link and share..", {
            className: 'info',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });
    });



    //select all share link when user clicks in shareTxt textarea
    $('#cliplistsSection').on('focus', '.shareTxt', function (e) {
        e.preventDefault();
        $(this).select();

    });


    //when user clicks delete link on a clip in a cliplist
    $('#cliplistsSection').on('click', '#clips>li>.deleteLnk', function (e) {
        e.preventDefault();
        var clipId = ($(this).data('clipid'));
        var yes = confirm('are you sure');
        if (yes) {
            DBCommunicator.deleteClip(clipId);
            $(this).html('<i class="icon-spin5 animate-spin"></i>');
        }

    });

    //when user clicks delete link on an annotation in a cliplist
    $('#cliplistsSection').on('click', '.clipAnnosList>li .deleteLnk', function (e) {
        e.preventDefault();
        var annoId = ($(this).data('annoid'));
        var yes = confirm('are you sure');
        if (yes) {
            DBCommunicator.deleteAnno(annoId);
            $(this).html('<i class="icon-spin5 animate-spin"></i>');
        }

    });

    //when user clicks show annotations link on a clip in a cliplist
    $('#cliplistsSection').on('click', '.expandLnk', function (e) {
        e.preventDefault();
        View.controller.toggle($(this));

    });

    $('#cliplistsSection').on('click', '.publishLnk', function (e) {
        alert('Publishes your cliplist in several formats - scroll down page to see JSON output');
        //console.log(JSON.stringify(ProjectManager.activeProject));
        var obj = ProjectManager.activeProject;
        var str = JSON.stringify(obj, undefined, 4);
        output(syntaxHighlight(str));


    });

    function output(inp) {
        $('#json-preview').html(inp)
    }


    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }



    //when user clicks delete link on a resource
    $('#projectResourcesPanel').on('click', '.deleteLnk', function (e) {
        e.preventDefault();
        var resourceId = ($(this).data('videoid'));
        var yes = confirm('are you sure');
        if (yes) {
            DBCommunicator.deleteResource(resourceId);
            $(this).html('<i class="icon-spin5 animate-spin"></i>');
        }
    });



    //when user clicks add to project link anywhere in interface
    $('#searchResults,#localFileSearch,#wellcomeFileSearch,#BBCFileSearch,#BBCAudioFileSearch,#remoteAddress,#royalConservatoire,#roslin').on('click', '.addToProjectLnk', function (e) {
        e.preventDefault();

        //add the video to the project resources
        ProjectManager.updateProjectProp('resources', $(this).context.dataset);
        $(this).html('<i class="icon-ok"></i>');
        $(this).notify("Added to Project resources", {
            className: 'success',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });
    });

    //when user clicks a section link in Project Page
    $('#projectPage>header nav a').click(function (e) {
        e.preventDefault();
        View.controller.changeView($(this).data('view'), $(this));
    });

    //when user clicks to preview a Wellcome video
    $('.wellcomeLink').click(function (e) {
        e.preventDefault();
        ClipperPlayer.play('remote', $(this));
        ProjectManager.ejectActiveClip();
    });

    //when user clicks to open clip props editor controls
    $('#createClipLnk').click(function (e) {
        e.preventDefault();
        View.showThing($('#clipPropsEditor'), 'slideDown');
        View.hideThing($('#createClipLnk'), 'sudden');
        ProjectManager.setActiveClip();
    });


    //when user clicks to open annotation editor
    $('#openAnnoEditorLnk').click(function (e) {
        e.preventDefault();
        View.showThing($('#annotationEditor'), 'fade');
        if (ProjectManager.activeClip.annotations.length > 0) {
            View.controller.changeAnnoEditorView('savedAnnosPane', $('#showSavedAnnosLnk'));
        } else {
            View.controller.changeAnnoEditorView('createAnnosPane', $('#createAnnosLnk'));

        }

        View.updateAnnoPane();
    });

    //when user clicks to save clip properties
    $('#saveClipLnk').click(function (e) {
        e.preventDefault();
        ProjectManager.updateClipProps();
        //ProjectManager.updateAnnoProps();
        View.updateAnnoPane();
        $('#saveClipLnk').notify("Clip Saved", {
            className: 'success',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });
    });

    //when user clicks to set start time of clip
    $('#startBtn').click(function (e) {
        e.preventDefault();
        //ClipperPlayer.activePlayer.pause();
        $('#startTxt').val(Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime()));
        ClipperPlayer.setClipStartEnd();
        ProjectManager.updateClipProps();
        View.updateCustomTimeline();
        //ProjectManager.updateAnnoProps();
        //View.updateAnnoPane();
    });

    //when user clicks to set start time of clip
    $('#endBtn').click(function (e) {
        e.preventDefault()
        ClipperPlayer.activePlayer.pause();
        $('#endTxt').val(Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime()));
        ClipperPlayer.setClipStartEnd();
        ProjectManager.updateClipProps();
        View.updateCustomTimeline();
        //ProjectManager.updateAnnoProps();
        //View.updateAnnoPane();
    });

    $('body').on('click', '.clipTimeline', function (e) {
        var parentOffset = $(this).parent().offset();
        var relX = e.pageX - parentOffset.left;
        //convert to time
        var vidDuration = ClipperPlayer.activePlayer.duration();
        var width = $(this).parent().width();
        var scrubTime = Math.floor((relX / width) * vidDuration);
        ClipperPlayer.activePlayer.currentTime(scrubTime);
    });





    //when user clicks to play clip in clip editor
    $('#playClipBtn').click(function (e) {
        e.preventDefault();
        var clip = ProjectManager.activeClip;
        /*var sourceType = clip.type;
        var source = clip.resource_uri;
        ClipperPlayer.play(sourceType,source,true);*/

        ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs(clip.start));
        ClipperPlayer.activePlayer.play();

        //start monitoring clip as it plays
        ClipperPlayer.monitorClipPlayback();
    });


    //when user clicks to close clip props editor controls (done button)
    $('#closeClipPropsLnk').click(function (e) {
        e.preventDefault();


        //clear ProjectManager.activeClip and clear form fields ready for another new clip
        ProjectManager.ejectActiveClip();
        ProjectManager.ejectActiveAnno();
    });

    //when user clicks to view saved annotations or create a new annotation in the annotation editor
    $('#showSavedAnnosLnk,#createAnnosLnk').click(function (e) {
        e.preventDefault();
        ProjectManager.ejectActiveAnno();
        View.controller.changeAnnoEditorView($(this).data('view'), $(this));
    });

    //when user clicks to view saved annotations in the annotation editor
    $('#showSavedAnnosLnk').click(function (e) {
        e.preventDefault();
        //clear current activeAnno in ProjectManager
        ProjectManager.ejectActiveAnno();
    });

    //when user clicks to create an annotation in the annotation editor
    $('#createAnnosLnk').click(function (e) {
        e.preventDefault();
        //ProjectManager.setActiveAnno();
    });

    $('#newAnnoLink').click(function (e) {
        e.preventDefault();
        //save text, time and anno id
        ProjectManager.ejectActiveAnno();
        $('#saveAnnoLink').notify("Type annotation below and click save", {
            className: 'info',
            position: 'bottom',
            autoHideDelay: Config.notifyDelay
        });
    });

    $('#saveAnnoLink').click(function (e) {
        e.preventDefault();
        View.setAnnoDefaultTime(); //default time displayed in annotation editor unless user sets it
        //save text, time and anno id
        ProjectManager.updateAnnoProps();
        $(this).notify("Annotation saved", {
            className: 'success',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });

    });

    $('#setAnnoTimeLink').click(function (e) {
        e.preventDefault();
        //save text, time and anno id
        View.updateAnnoStartField();
        ProjectManager.updateAnnoTime();
    });

    //when user clicks to set start time in saved annos pane
    $('#savedAnnosPane').on('click', '.quickSetAnnoTimeLnk', function (e) {
        e.preventDefault();
        var annoText = $(this).parent().find('.annoText');
        var annoTime = Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime());
        $('#savedAnnosPane').notify("Start stime saved", {
            className: 'success',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });

        ProjectManager.setActiveAnno($(this).data('id'));

        ProjectManager.updateAnnoProps(annoText.text(), annoTime);

        //revert button to quick edit mode
        $(this).removeClass('editMode').html('<i class="icon-stopwatch"></i>');
        //check editMode of button
        //if !hasClass('editMode')
        /* if ($(this).hasClass('editMode')) {
			$('#savedAnnosPane').notify("Start stime saved",{className: 'success',position:'top',autoHideDelay: Config.notifyDelay});

            ProjectManager.setActiveAnno($(this).data('id'));

            ProjectManager.updateAnnoProps(annoText.text(), annoTime);

            //revert button to quick edit mode
            $(this).removeClass('editMode').html('<i class="icon-stopwatch"></i>');


        } else {
            //change button to saver
            $(this).addClass('editMode').html('<i class="icon-floppy"></i>');
        }*/
    });




    //when user clicks quick edit in saved annos pane
    $('#savedAnnosPane').on('click', '.quickEditLnk', function (e) {
        e.preventDefault();
        var annoText = $(this).parent().find('.annoText');
        //check editMode of button
        //if !hasClass('editMode')
        if ($(this).hasClass('editMode')) {
            $('#savedAnnosPane').notify("Annotation Saved", {
                className: 'success',
                position: 'top',
                autoHideDelay: Config.notifyDelay
            });
            //set annotation to be editable and focus
            annoText.attr('contenteditable', 'false').focus();

            ProjectManager.setActiveAnno($(this).data('id'));

            ProjectManager.updateAnnoProps(annoText.text(), $(this).data('start'));

            //revert button to quick edit mode
            $(this).removeClass('editMode').html('<i class="icon-pencil"></i>');

        } else {
            //set annotation to be editable and focus
            annoText.attr('contenteditable', 'true').focus();
            //change button to saver
            $(this).addClass('editMode').html('<i class="icon-floppy"></i>');
        }
    });

    //when user clicks to set start time in cliplist list
    $('body').on('click', '.quickAnnoStartLnk', function (e) {
        e.preventDefault();
        var annoId = $(this).data('annoid');
        var parentClip = $(this).data('parentclipid');
        var annoText = $(this).parent().parent().find('.annoText');
        var annoTime = Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime());
        $(this).notify("Start stime saved", {
            className: 'success',
            position: 'top',
            autoHideDelay: Config.notifyDelay
        });

        ProjectManager.setActiveClip(parentClip);
        ProjectManager.setActiveAnno(annoId);

        ProjectManager.updateAnnoProps(annoText.text(), annoTime);
        //check editMode of button
        //if !hasClass('editMode')
        /*if ($(this).hasClass('editMode')) {
			$(this).notify("Start stime saved",{className: 'success',position:'top',autoHideDelay: Config.notifyDelay});

			ProjectManager.setActiveClip(parentClip);
            ProjectManager.setActiveAnno(annoId);

            ProjectManager.updateAnnoProps(annoText.text(), annoTime);

            //revert button to quick edit mode
            $(this).removeClass('editMode').html('<i class="icon-stopwatch"></i>');


        } else {
            //change button to saver
            $(this).addClass('editMode').html('<i class="icon-floppy"></i>');
        }*/
    });

    //when user clicks quick edit in cliplist list
    $('body').on('click', '.quickEditAnnoAnnoLnk', function (e) {
        e.preventDefault();
        var annoId = $(this).data('annoid');
        var parentClip = $(this).data('parentclipid');
        var annoText = $(this).parent().parent().find('.annoText');

        //check editMode of button
        //if !hasClass('editMode')
        if ($(this).hasClass('editMode')) {
            $(this).notify("Annotation Saved", {
                className: 'success',
                position: 'top',
                autoHideDelay: Config.notifyDelay
            });
            //set annotation to be editable and focus
            annoText.attr('contenteditable', 'false').focus();
            ProjectManager.setActiveClip(parentClip);
            ProjectManager.setActiveAnno(annoId);

            ProjectManager.updateAnnoProps(annoText.text(), $(this).data('start'));

            //revert button to quick edit mode
            $(this).removeClass('editMode').html('<i class="icon-pencil"></i>');

        } else {
            //set annotation to be editable and focus
            annoText.attr('contenteditable', 'true').focus();
            //change button to saver
            $(this).addClass('editMode').html('<i class="icon-floppy"></i>');
        }
    });





    $('#closeAnnosPaneLnk').click(function (e) {
        e.preventDefault();
        View.hideThing($('#annotationEditor'), 'fade');
    });


    //when user clicks play link on an annotation in a cliplist
    $('#cliplistsSection').on('click', '.playAnnoLnk', function (e) {

        e.preventDefault();
        var annoId = ($(this).data('annoid'));



        //prepare element object to pass to ClipperPlayer.play() describing clip and source
        var parentClip = $(this).closest('.cliplevel').find('> .previewLnk');

        var element = $('<a title="Play Annotation" class=" previewLnk linkBtn " href="#" data-videoid="' + parentClip.data('videoid') + '" data-title="' + parentClip.data('title') + '" data-description="' + parentClip.data('description') + '" data-thumbnail="' + parentClip.data('thumbnail') + '" data-sourcetype="' + parentClip.data('sourcetype') + '" data-clipid="' + parentClip.data('clipid') + '"><i class="icon-pencil"></i></a>');

        if (parentClip.data('sourcetype') == 'youtube') {
            element = {
                context: {
                    dataset: {
                        videoid: parentClip.data('videoid'),
                        title: parentClip.data('title'),
                        description: parentClip.data('description'),
                        thumbnail: parentClip.data('thumbnail')
                    }
                }
            }
        }
        ProjectManager.setActiveClip(parentClip.data('clipid'));
        ProjectManager.setActiveAnno(annoId);

        ClipperPlayer.play(parentClip.data('sourcetype'), element, 'anno');

        $('#cliplistsSection li').removeClass('greenFaded');
        $(this).parent().parent().addClass('greenFaded');

        $('.clipLevel .pauseLnk').hide();
        $('.clipLevel .previewLnk').show().removeClass('green');

        //ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs($(this).data('start')));

    });

    //when user clicks jump to anno link on an annotation in the saved annos editor view
    $('#savedAnnosPane').on('click', '.jumpToAnnoLnk', function (e) {

        e.preventDefault();
        //move playhead
        ClipperPlayer.activePlayer.currentTime(Utilities.HMSToSecs($(this).data('start')));

    });


    //when user clicks to play the entire cliplist
    $('#cliplistsPane').on('click', '.playCliplistLnk', function (e) {
        e.preventDefault();
        ClipperPlayer.clipsToPlay = ProjectManager.activeProject.cliplists[0][0].clips;
        ClipperPlayer.playCliplist();
    });







});
