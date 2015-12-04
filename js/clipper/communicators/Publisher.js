var Publisher = {
    updateStandaloneFiles: function () {
        $.ajax({
            url: Config.base_url + '/php/updateStandalone.php',
            type: 'post',
            dataType: 'text',
            data: {
                username: Config.username,
                projectId: ProjectManager.activeProject.projectId,
                data: JSON.stringify(ProjectManager.activeProject)
            },
            success: function (data) {
                console.log(data)
            },
            error: function () {}

        });
    }
}
