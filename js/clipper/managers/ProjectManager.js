ProjectManager = {

    activeProject: null,

    activeCliplist: 0,

    activeClip: null,

    activeAnno: null,


    existingProjects: [
        /*{
            projectTitle: 'Ferraris',
            projectId: '1349308800000',
            projectDesc: 'As we got further and further away, it [the Earth] diminished in size. Finally it shrank to the size of a marble, the most beautiful you can imagine. That beautiful, warm, living object looked so fragile, so delicate, that if you touched it with a finger it would crumble and fall apart. Seeing this has to change a man.',
            projectResourceCount: 0,
            projectCliplistCount: 0,
            projectClipsCount: 0,
            resources: [],
            clips: [],
            cliplists: [{
                id: 1349308800000,
                title: 'Ferraris default cliplist',
                description: '',
                authors: [],
                parentProject: 1349308800000,
                clips: [],
                dateCreated: 'Mon Sep 07 2015 13:19:25 GMT+0100 (BST)',
                lastModified: 'Mon Sep 07 2015 13:19:25 GMT+0100 (BST)'
            }],
            authors: [], //list of wp user names
            owner: [],
            dateCreated: null,
            lastModified: null,
            tags: []
        }*/

    ],

    createNewClip: function (cliplistIndex) {

        var self = ProjectManager;
        //set up uniqueId
        var d = new Date();
        var uniqueId = d.getTime();

        //prepare sourcetype (set to blob if its a local file)
        var sourceType = ClipperPlayer.currentVideo.sourceType;
        if (sourceType == 'local') {
            sourceType = 'blob';
        }
        //create a new clip object
        var clip = {
            id: uniqueId,
            clipper_clip_id: uniqueId,
            title: 'Untitled Clip',
            description: '',
            authors: Config.username,
            owner: Config.username,
            parent_project_id: self.activeProject.projectId,
            parent_cliplist_id: self.activeProject.cliplists[cliplistIndex][0].cliplist.clipper_cliplist_id,
            date_created: d,
            last_modified: d,
            resource_uri: ClipperPlayer.getCurrentVideo().videoURL,
            sourceType: sourceType,
            start: Utilities.secsToHMS(ClipperPlayer.activePlayer.currentTime()),
            end: Utilities.secsToHMS(ClipperPlayer.activePlayer.duration()),
            thumbnail: ClipperPlayer.getCurrentVideo().thumbnail,
            annotations: [],
            tags: ''
        };

        //add new clip to top of cliplist
        //check if clips is an array (if no existing clips db call returns empty string
        if (self.activeProject.cliplists[cliplistIndex][0].clips = '') {
            self.activeProject.cliplists[cliplistIndex][0].clips = new Array();
        }
        if (typeof self.activeProject.cliplists[cliplistIndex][0].clips === 'string') {
            self.activeProject.cliplists[cliplistIndex][0].clips = new Array();
        }
        self.activeProject.cliplists[cliplistIndex][0].clips.unshift(clip);
        //update user view
        //View.updateClipsInClipList(cliplistIndex);
        //register new clip as current active clip for editing
        self.activeClip = clip;
        View.populateFields();

    },

    createNewAnno: function () {
        var self = ProjectManager;
        var annoTime = ClipperPlayer.activePlayer.currentTime();
        console.log('time check')
        if (annoTime < self.activeClip.start) {
            console.log('anno before clip start');
        }

        //set up uniqueId if new anno
        var d = new Date();
        var uniqueId = d.getTime();
        //create a new clip object
        var anno = {
            id: uniqueId,
            clipper_anno_id: uniqueId,
            authors: [],
            parentProject: self.activeProject.projectId,
            parentClip: self.activeClip.clipper_clip_id,
            date_created: d,
            last_modified: d,
            start: annoTime,
            end: $('#endTxt').val(),
            text: $('#annoEditorText').val()
        };
        if (typeof self.activeClip.annotations === 'string') {
            self.activeClip.annotations = new Array();
        }
        self.activeClip.annotations.unshift(anno);
        self.activeAnno = anno;
        View.updateClipAnnoList();
        View.updateAnnoStartField();
    },

    createNewProject: function (form) {
        var self = ProjectManager;
        var d = new Date();
        var uniqueId = d.getTime();

        var newProject = {
            projectTitle: form.find('#newProjectTitle').val(),
            projectId: uniqueId,
            projectDesc: 'Click the pencil icon to edit the description and title.',
            projectResourceCount: 0,
            projectCliplistCount: 1,
            projectClipsCount: 0,
            resources: [],
            //clips: [],
            cliplists: [{
                id: uniqueId,
                title: form.find('#newProjectTitle').val() + ' - cliplist',
                description: '',
                authors: Config.username,
                owner: Config.username,
                parentProject: uniqueId,
                clips: [],
                dateCreated: d,
                lastModified: d
            }],
            authors: Config.username, //list of wp user names
            owner: Config.username,
            dateCreated: new Date(),
            lastModified: new Date(),
            tags: []
        }

        self.existingProjects.unshift(newProject);

        //save new project to db
        DBCommunicator.save('project', newProject);


        View.updateExistingProjectsList();
    },

    setActiveAnno: function (annoId) {
        var self = ProjectManager;

        if (annoId == null || annoId == undefined) {
            self.createNewAnno();
        } else {
            //find the annotation in the active clip
            var found = false;
            var numAnnos = self.activeClip.annotations.length;
            for (var i = 0; i < numAnnos; i++) {

                if (self.activeClip.annotations[i].clipper_anno_id == annoId) {
                    found = true;
                    self.activeAnno = self.activeClip.annotations[i];
                    break;
                }
            }
        }

    },

    setActiveProject: function (projectId) {
        var self = ProjectManager;
        var numProjects = self.existingProjects.length;
        for (var i = 0; i < numProjects; i++) {
            if (self.existingProjects[i].projectId == projectId) {
                self.activeProject = self.existingProjects[i];
                break;
            }
        }
    },

    setActiveClip: function (clipId) {

        var self = ProjectManager;
        if (clipId == null || clipId == undefined) {
            self.createNewClip(0);
        } else {
            //find the clip in cliplists
            var found = false;
            var numCliplists = self.activeProject.cliplists.length;
            for (var i = 0; i < numCliplists; i++) {
                var numClips = self.activeProject.cliplists[i][0].clips.length;

                for (var z = 0; z < numClips; z++) {
                    if (self.activeProject.cliplists[i][0].clips[z].clip.clipper_clip_id == clipId || self.activeProject.cliplists[i][0].clips[z].clip.id == clipId) {
                        found = true;
                        self.activeClip = self.activeProject.cliplists[i][0].clips[z].clip;
                        self.activeClip.annotations = self.activeProject.cliplists[i][0].clips[z].annos;
                        break;
                    }
                }
            }
        }
        ClipperPlayer.clipMode = true;
        View.updateNum('numAnnos');

    },

    ejectActiveClip: function () {

        var self = ProjectManager;
        if (self.activeClip != undefined) {
            self.checkForChanges();
        } else {
            self.completeEjectClip();
        }


    },

    completeEjectClip: function () {
        var self = ProjectManager;
        self.activeClip = null;
        //hide clipProps
        View.hideThing($('#clipPropsEditor'), 'slideUp');
        //hide annotationProps
        View.hideThing($('#annotationEditor'), 'fade');
        $('#vidPlayhead').html('');
        //empty clip editor fields
        View.clearFields($('#clipPropsEditor'));
        ClipperPlayer.clipMode = false;
        if (View.activeView != 'collectionsSection') {
            View.showThing($('#createClipLnk'), 'fade')
        }
        DBCommunicator.reloadProjectData(ProjectManager.activeProject.projectId);
    },

    checkForChanges: function () {
        var self = ProjectManager;
        var saveClipRequired = false;
        var saveAnnosRequired = false;
        if (self.activeClip != undefined) {
            if ($('#clipTitleTxt').val() != self.activeClip.title) {
                saveClipRequired = true;
            }
            if ($('#clipDescTxt').val() != self.activeClip.description) {
                saveClipRequired = true;
            }
            if ($('#clipTagsTxt').val() != self.activeClip.tags) {
                saveClipRequired = true;
            }
            //loop thru all annotations
            $('#savedAnnosPane li').each(function (index, element) {

                if ($('#savedAnnosPane li').eq(index).find('.annoText').text() != self.activeClip.annotations[index].text) {

                    saveAnnosRequired = true;
                }
            });

            if (saveClipRequired || saveAnnosRequired) {
                var saveClipChanges = confirm('You have unsaved changes. Would you like to save them?');
            }
            if (saveClipChanges) {
                self.updateClipProps();
                if (saveAnnosRequired) {
                    //loop thru all annotations
                    $('#savedAnnosPane li').each(function (index, element) {
                        if ($('#savedAnnosPane li').eq(index).find('.annoText').text() != self.activeClip.annotations[index].text) {
                            self.activeAnno = self.activeClip.annotations[index];
                            self.updateAnnoProps($('#savedAnnosPane li').eq(index).find('.annoText').text(), $('#savedAnnosPane li').eq(index).find('.annoStartText').text());
                        }
                    });
                }
            }
        }

        self.completeEjectClip();
    },


    ejectActiveAnno: function () {
        var self = ProjectManager;
        self.activeAnno = null;

        //empty anno editor fields
        View.clearFields($('#annotationEditor'));
    },

    updateClipProps: function () {
        var self = ProjectManager;
        var clip = self.activeClip;
        clip.title = $('#clipTitleTxt').val();
        clip.description = $('#clipDescTxt').val();
        /*clip.start = ClipperPlayer.getClipStart();
        clip.end = ClipperPlayer.getClipEnd();*/
        clip.start = $('#startTxt').val();
        clip.end = $('#endTxt').val();
        clip.tags = $('#clipTagsTxt').val();
        clip.lastModified = new Date();
        //update cliplists user view
        //View.updateClipsInClipList(0);

        DBCommunicator.save('clip', clip);
    },

    updateAnnoProps: function (annoText, annoStart) {


        var self = ProjectManager;
        if (self.activeAnno == null) {
            self.createNewAnno();
        }
        var anno = self.activeAnno;

        //check if param has been sent from quickEdit mode
        if (annoText == null || annoText == undefined) {
            anno.text = $('#annoEditorText').val(); //use annotationEditor textarea
        } else {
            anno.text = annoText; //use value sent from quickEdit mode
        }

        //check if param has been sent from quickEdit mode
        if (annoStart == null || annoStart == undefined) {
            anno.start = $('#annoStartTime').val(); //use annotationEditor textarea
        } else {
            anno.start = annoStart; //use value sent from quickEdit mode
        }
        //guarantee there is a start time
        if (anno.start == '' || anno.start == undefined || anno.start == null) {
            anno.start = ClipperPlayer.$('#startTxt').val();
        }
        //anno.end = ClipperPlayer.getClipEnd();
        anno.end = ProjectManager.activeClip.end;
        anno.lastModified = new Date();
        //save and update user view
        View.updateClipAnnoList();
        DBCommunicator.save('anno', anno);

    },

    updateAnnoTime: function () {
        var self = ProjectManager;
        if (self.activeAnno == null) {
            self.createNewAnno();
        }
        var anno = self.activeAnno;

        anno.start = $('#annoStartTime').val();
        anno.end = $('#endTxt').val();
        anno.lastModified = new Date();

        //change start time of clip if new annotation time is earlier than current clip start time
        if (Utilities.HMSToSecs(anno.start) < Utilities.HMSToSecs(ProjectManager.activeClip.start)) {
            $('#startTxt').val(anno.start);
        }

        //change end time of clip if new annotation time is earlier than current clip end time
        if (Utilities.HMSToSecs(anno.start) > Utilities.HMSToSecs(ProjectManager.activeClip.end)) {
            $('#endTxt').val(anno.start);
        }
        //update annotation user view
        View.updateAnnoStartField(anno.start);
        //DBCommunicator.save('anno');

    },

    updateProjectProp: function (prop, value) {

        var self = ProjectManager;
        //check if prop to be updated is array or string
        //if prop is array push value

        switch (prop) {
        case 'resources':
            DBCommunicator.save('resource', value);
            break;
        }
        //DBCommunicator.saveProjectData(self.activeProject.projectId);
        //DBCommunicator.save('project');
    }

}
