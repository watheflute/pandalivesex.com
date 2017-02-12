var Index = {
    displayRandomTitle: function() {
        var randomTitle = Data.TITLES[Math.floor(Math.random() * Data.TITLES.length)];
        document.getElementById('title').innerHTML = randomTitle;
    },
    updateTwitchIframesSrc: function() {
        $('#twitch-stream-iframe').attr('src', "https://player.twitch.tv/?channel=teldoo&autoplay=true");
        $('#twitch-chat-iframe').attr('src', "https://www.twitch.tv/teldoo/chat?popout=");
    },
    resizeTwitchIframes: function() {
        $('#twitch-stream-iframe').height($(window).height() - 150);
        $('#twitch-chat-iframe').height($(window).height() - 150);
        $('#twitch-stream-iframe').width($(window).width() - 350);
    }
};

$(document).ready(function() {
    Common.displayMenu();
    Index.displayRandomTitle();
    Index.updateTwitchIframesSrc();
    Index.resizeTwitchIframes();
});
