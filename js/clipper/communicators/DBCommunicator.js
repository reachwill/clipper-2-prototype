var DBCommunicator = {
    getAllProjects: function () {
        //clear exisitng
        ProjectManager.existingProjects = [];
        var obj = {
            owner: Config.username
        };
        $.ajax({
            url: Config.base_url + '/php/getAllProjects.php',
            type: 'post',
            dataType: 'json',
            data: obj,
            success: function (data) {


                var numProjects = data.length;
                for (var i = 0; i < numProjects; i++) {

                    var project = {
                        projectTitle: data[i].project.title,
                        projectId: data[i].project.clipper_project_id,
                        projectDesc: data[i].project.description,
                        projectResourceCount: data[i].numResources,
                        projectCliplistCount: data[i].numCliplists,
                        projectClipsCount: data[i].numClips,
                        resources: [],
                        clips: [],
                        cliplists: [
                            /*{
                            							id: 1349308800000,
                            							title: 'Ferraris default cliplist',
                            							description: '',
                            							authors: [],
                            							parentProject: 1349308800000,
                            							clips: [],
                            							dateCreated: 'Mon Sep 07 2015 13:19:25 GMT+0100 (BST)',
                            							lastModified: 'Mon Sep 07 2015 13:19:25 GMT+0100 (BST)'
                            						}*/
                            ],
                        authors: data[i].project.authors, //list of wp user names
                        owner: data[i].project.owner,
                        dateCreated: data[i].project.date_created,
                        lastModified: data[i].project.last_modified,
                        tags: []
                    }
                    ProjectManager.existingProjects.unshift(project);
                }
                //console.log(ProjectManager.existingProjects);
                View.updateExistingProjectsList();
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }


        });
    },
    getProjectData: function (projectId) {

        //get the data from db
        var obj = {
            projectId: projectId
        };
        $.ajax({
            url: Config.base_url + '/php/getProjectData.php',
            type: 'post',
            dataType: 'json',
            data: obj,
            success: function (data) {
                //on success change view
                //setActiveProject
                ProjectManager.setActiveProject(projectId);
                //clear any exisitng cliplists in browser memory
                ProjectManager.activeProject.cliplists = [];
                //store the existing cliplists in the activeProject
                ProjectManager.activeProject.cliplists.push(data[0].cliplists);
                //store the existing resources in the activeProject
                //ProjectManager.activeProject.resources=[];
                ProjectManager.activeProject.resources.push(data[0].resources);
                //ProjectManager.activeProject.resources=data[0].resources;
                //update the view with new Project
                View.loadProject(data);
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }


        });




    },
    reloadProjectData: function (projectId) {

        //get the data from db
        var obj = {
            projectId: projectId
        };
        $.ajax({
            url: Config.base_url + '/php/getProjectData.php',
            type: 'post',
            dataType: 'json',
            data: obj,
            success: function (data) {
                console.log(data)
                    //on success change view
                    //setActiveProject
                ProjectManager.setActiveProject(projectId);
                //clear any exisitng cliplists in browser memory
                ProjectManager.activeProject.cliplists = [];
                //store the existing cliplists in the activeProject
                ProjectManager.activeProject.cliplists.push(data[0].cliplists);
                //store the existing resources in the activeProject
                ProjectManager.activeProject.resources = [];
                ProjectManager.activeProject.resources.push(data[0].resources);
                //update the view with new Project
                View.loadProject(data, true);

                Publisher.updateStandaloneFiles();


            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }


        });




    },
    save: function (typeToSave, obj) {
        var self = DBCommunicator;
        switch (typeToSave) {
        case 'projectDesc':
            $.ajax({
                url: Config.base_url + '/php/updateProjectDesc.php',
                type: 'post',
                dataType: 'text',
                data: obj,
                success: function (data) {
                    console.log(data);
                },
                error: function (x, m, s) {
                    console.log(x);
                    console.log(m);
                    console.log(s);
                }
            });
            break;
        case 'project':

            $.ajax({
                url: Config.base_url + '/php/saveNewProject.php',
                type: 'post',
                dataType: 'text',
                data: obj,
                success: function (data) {
                    console.log(data)
                },
                error: function (x, m, s) {
                    console.log(x);
                    console.log(m);
                    console.log(s);
                }
            });
            break;
        case 'clip':
            obj.username = Config.username;
            $.ajax({
                url: Config.base_url + '/php/saveClip.php',
                type: 'post',
                dataType: 'text',
                data: obj,
                success: function (data) {
                    //console.log(data);
                    //update cliplist view
                    self.reloadProjectData(ProjectManager.activeProject.projectId);

                },
                error: function (x, m, s) {
                    console.log(x);
                    console.log(m);
                    console.log(s);
                }
            });
            break;
        case 'resource':
            //save resource to projectId

            obj.parent_project_id = ProjectManager.activeProject.projectId;
            $.ajax({
                url: Config.base_url + '/php/saveResource.php',
                type: 'post',
                dataType: 'text',
                data: obj,
                success: function (data) {
                    //console.log(data)
                    //update cliplist view
                    self.reloadProjectData(ProjectManager.activeProject.projectId);

                },
                error: function (x, m, s) {
                    console.log(x);
                    console.log(m);
                    console.log(s);
                }
            });
            break;
        case 'anno':
            obj.owner = Config.username;
            if (obj.parentClip == undefined) {
                obj.parentClip = obj.parent_clip;
            }


            $.ajax({
                url: Config.base_url + '/php/saveAnno.php',
                type: 'post',
                dataType: 'text',
                data: obj,
                success: function (data) {

                    //update cliplist view
                    self.reloadProjectData(ProjectManager.activeProject.projectId);
                },
                error: function (x, m, s) {
                    console.log(x);
                    console.log(m);
                    console.log(s);
                }
            });
            break;
        }
    },

    updateCliplistOrder: function () {
        var numClips = $('#clips>li').length;
        var clipsData = {
            clips: []
        };
        $('#clips>li').each(function (index, element) {
            clipsData.clips.push({
                clipId: $(this).data('id'),
                orderIndex: index
            });
        });
        $.ajax({
            url: Config.base_url + '/php/updateOrder.php',
            type: 'post',
            dataType: 'text',
            data: clipsData,
            success: function (data) {
                console.log(data)
                    //update cliplist view
                    //self.reloadProjectData(ProjectManager.activeProject.projectId);
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }
        });

    },


    archiveProject: function (projectId) {
        var self = DBCommunicator;
        var obj = {
            clipper_project_id: projectId
        }
        $.ajax({
            url: Config.base_url + '/php/archiveProject.php',
            type: 'post',
            dataType: 'text',
            data: obj,
            success: function (data) {
                //update cliplist view
                self.getAllProjects();
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }
        });
    },
    deleteClip: function (clipId) {
        var self = DBCommunicator;
        var obj = {
            clipper_clip_id: clipId
        };
        $.ajax({
            url: Config.base_url + '/php/deleteClip.php',
            type: 'post',
            dataType: 'text',
            data: obj,
            success: function (data) {
                //update cliplist view
                self.reloadProjectData(ProjectManager.activeProject.projectId);
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }
        });
    },
    deleteResource: function (videoid) {
        var self = DBCommunicator;
        var projectId = ProjectManager.activeProject.projectId;
        var obj = {
            videoid: videoid,
            parent_project_id: projectId
        };
        $.ajax({
            url: Config.base_url + '/php/deleteResource.php',
            type: 'post',
            dataType: 'text',
            data: obj,
            success: function (data) {
                //update cliplist view
                self.reloadProjectData(projectId);
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }
        });
    },
    deleteAnno: function (annoId) {
        var self = DBCommunicator;
        var obj = {
            clipper_anno_id: annoId
        };
        //console.log(annoId)
        $.ajax({
            url: Config.base_url + '/php/deleteAnno.php',
            type: 'post',
            dataType: 'text',
            data: obj,
            success: function (data) {
                //update cliplist view
                self.reloadProjectData(ProjectManager.activeProject.projectId);
            },
            error: function (x, m, s) {
                console.log(x);
                console.log(m);
                console.log(s);
            }
        });
    }
}
