$(document).ready(function () {
    //hide all pages except dashboardPage at start up
    $('section.page').not('#dashboardPage').hide();

    //nav element event handlers



    //when user clicks dashboard link in main page header
    $('.projectDashboardLnk').click(function (e) {
        PageNavigator.changePage('dashboardPage', $(this));

    });



});

var PageNavigator = {
    /*changePage: function (pageTitle, linkClicked) {
        var projectId = (linkClicked.data('projectid'))
        $('section.page').hide();
        $('#' + pageTitle).fadeIn(500);
        if (pageTitle == 'projectPage') {
            $('#projectTitle').text(ProjectManager.activeProject.projectTitle);
        }
    }*/
    changePage: function (pageTitle) {
        $('section.page').hide();
        $('#' + pageTitle).fadeIn(500);
        if (pageTitle == 'projectPage') {
            $('#projectTitle').text(ProjectManager.activeProject.projectTitle);
        } else if (pageTitle == 'dashboardPage') {
            //ProjectManager.ejectActiveClip();
            DBCommunicator.getAllProjects();
            ClipperPlayer.activePlayer.src(null);
        }
        View.activeView = pageTitle;


    }
}
