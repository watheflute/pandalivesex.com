var Index = {
    audioContext: null,
    loadedTeldoGasms: [],

    displayRandomTitle: function() {
        var randomTitle = Common.randomElementFromArray(Data.TITLES);
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
    },

    loadTeldoGasms: function() {
        this.audioContext = Common.initAudioContext();
        if (this.audioContext == null) {
            return;
        }
        this.loadTeldoGasm(0);
    },

    loadTeldoGasm: function(index) {
        var request = new XMLHttpRequest();
        request.open("GET", "/mp3/teldoGasm/" + Data.SOUNDS['teldoGasm'][index].name + ".mp3", true);
        request.responseType = "arraybuffer";
        request.info = {soundIndex: index, self: this};
        request.onload = this.onTeldoGasmLoad;
        request.send();
    },

    onTeldoGasmLoad: function(xhr) {
        var info = xhr.target.info;
        info.self.audioContext.decodeAudioData(xhr.target.response, function(buffer) {
            Data.SOUNDS['teldoGasm'][info.soundIndex].buffer = buffer;
            info.self.loadedTeldoGasms.push(info.soundIndex);
            if (info.soundIndex == 0) {
                info.self.playRandomTeldoGasmsLoop();
            }
            if (info.soundIndex + 1 < Data.SOUNDS['teldoGasm'].length) {
                info.self.loadTeldoGasm(info.soundIndex + 1);
            }
        }, function() {
        });
    },

    playRandomTeldoGasmsLoop: function() {
        var self = this;
        var randomInterval = Math.round(Math.random() * (Data.MAX_TELDOGASM_INTERVAL - Data.MIN_TELDOGASM_INTERVAL)) + Data.MIN_TELDOGASM_INTERVAL;
        var randomIndex = Common.randomElementFromArray(self.loadedTeldoGasms);
        setTimeout(function() {
            self.playTeldoGasm(randomIndex);
            self.playRandomTeldoGasmsLoop();
        }, randomInterval);
    },

    playTeldoGasm: function(index) {
        var sound = Data.SOUNDS['teldoGasm'][index];
        sound.source = this.audioContext.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.connect(this.audioContext.destination);
        sound.source.start(0);
    }
};

$(document).ready(function() {
    Common.displayMenu();
    Index.displayRandomTitle();
    Index.updateTwitchIframesSrc();
    Index.resizeTwitchIframes();
    Index.loadTeldoGasms();
});

$(window).resize(function() {
    Index.resizeTwitchIframes();
});

