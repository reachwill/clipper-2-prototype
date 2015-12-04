var Utilities = {
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

    filterList: function (text, list) {
        console.log(text)
        var valThis = $(this).val();
        $('#searchList>li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) == 0) ? $(this).show(): $(this).hide();
        });
    },
    getUrlVars: function () {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}
