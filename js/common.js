var Common = {
    displayMenu: function () {
        for (var i=0; i < Data.MENU.length; i++) {
            $('#menu').append('<li><a href="' + Data.MENU[i].link + '">' + Data.MENU[i].title + '<img src="/im/teldo/icon.jpg" /></a></li>');
        }
    },

    shuffle: function(array) {
        for (var i = array.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },

    initAudioContext: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            return new AudioContext();
        }
        catch (e) {
            return null;
        }
    },

    randomElementFromArray: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};

