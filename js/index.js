var Index = {
    audioContext: null,
    loadedTeldoGasms: [],

    displayRandomTitle: function() {
        $('#title').html(Common.randomElementFromArray(Data.TITLES));
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

    loadSounds: function() {
        this.audioContext = Common.initAudioContext();
        if (this.audioContext == null) {
            return;
        }
        this.loadTeldoGasm(0);
        this.loadWeeSound();
    },

    loadTeldoGasm: function(index) {
        var request = new XMLHttpRequest();
        request.open("GET", "/mp3/teldoGasm/" + Data.SOUNDS['teldoGasm'][index].name + ".mp3", true);
        request.responseType = "arraybuffer";
        request.info = {soundIndex: index, self: this};
        request.onload = this.onTeldoGasmLoad;
        request.send();
    },

    loadWeeSound: function() {
        var self = this;
        var request = new XMLHttpRequest();
        request.open("GET", "/mp3/teldoHappy/weee.mp3", true);
        request.responseType = "arraybuffer";
        var weeSoundIndex = this.findWeeSoundIndex();
        request.onload = function(xhr) {
            self.audioContext.decodeAudioData(xhr.target.response, function(buffer) {
                Data.SOUNDS['teldoHappy'][weeSoundIndex].buffer = buffer;
            }, function() {});
        };
        request.send();
    },

    findWeeSoundIndex: function() {
        for (var i=0; i < Data.SOUNDS['teldoHappy'].length; i++) {
            if (Data.SOUNDS['teldoHappy'][i].name == 'weee') {
                return i;
            }
        }
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
            self.displayTeldoGasmImage();
            self.playRandomTeldoGasmsLoop();
        }, randomInterval);
    },

    playTeldoGasm: function(index) {
        var sound = Data.SOUNDS['teldoGasm'][index];
        sound.source = this.audioContext.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.connect(this.audioContext.destination);
        sound.source.start(0);
    },

    playWeeSound: function() {
        var sound = Data.SOUNDS['teldoHappy'][this.findWeeSoundIndex()];
        sound.source = this.audioContext.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.connect(this.audioContext.destination);
        sound.source.start(0);
    },

    loadTeldoGasmImage: function() {
        $('body').append('<img id="teldoGasm" />');
        $('#teldoGasm').hide();
        var imageObj = new Image();
        var self = this;
        imageObj.onload = function() {
            $('#teldoGasm').attr('src', this.src);
            $('#teldoGasm').click(self.gainOneBamboogasm.bind(self));
        };
        imageObj.src = '/im/teldo/teldoGasm.png';
    },

    displayTeldoGasmImage: function() {
        $('#teldoGasm').show();
        $('#teldoGasm').animate({opacity: 1, left: this.randomOffset(), top: this.randomOffset()}, 2000);
        var self = this;
        setTimeout(function() {
            $('#teldoGasm').animate({opacity: 0, left: self.randomPosition($(window).width()), top: self.randomPosition($(window).height())}, 1);
        }, 2000);
    },

    randomOffset: function() {
        var offset = Math.round(Math.random() * 100) - 50;
        if (offset >= 0 ) {
            return '+=' + offset;
        } else {
            return '-=' + parseInt(-offset);
        }
    },

    randomPosition: function(max) {
        var position = Math.round(Math.random() * (max - 500));
        return position + 'px';
    },

    initBamboogasmCount: function() {
        if (typeof(Storage) !== "undefined") {
           localStorage.setItem("bamboogasmCount", 0);
        }
    },

    gainOneBamboogasm: function() {
        if ($('#teldoGasm').is(":visible")) {
            this.playWeeSound();
            if (typeof(Storage) !== "undefined") {
                this.incrementBamboogasmCount();
                this.displayBamboogasmCountInTitle();
            }
            $('#teldoGasm').hide();
        }
    },

    incrementBamboogasmCount: function() {
        localStorage.setItem('bamboogasmCount', parseInt(localStorage.getItem('bamboogasmCount')) + 1);
    },

    displayBamboogasmCountInTitle: function() {
        var bamboogasmCount = localStorage.getItem('bamboogasmCount');
        var bamboogasmName = 'bamboogasm';
        if (bamboogasmCount > 1) {
            bamboogasmName += 's';
        }
        var bamboogasmLevel = this.getBamboogasmLevel(bamboogasmCount);
        $('#title').html('You have <span class="bamboogasmCount">' + bamboogasmCount + ' ' + bamboogasmName + '</span> ! ' + bamboogasmLevel);
    },

    getBamboogasmLevel: function(bamboogasmCount) {
        var levelIndex = Math.floor(parseInt(bamboogasmCount) / 10);
        if (levelIndex >= Data.BAMBOOGASM_LEVELS.length) {
            levelIndex = Data.BAMBOOGASM_LEVELS.length - 1;
        }
        return this.formatBamboogasmLevel(levelIndex);
    },

    formatBamboogasmLevel: function(index) {
       return Data.BAMBOOGASM_LEVELS[index].text + ' <img class="emote" src="/im/' + Data.BAMBOOGASM_LEVELS[index].im + '" />';
    }
};

$(document).ready(function() {
    Common.displayMenu();
    Index.displayRandomTitle();
    Index.updateTwitchIframesSrc();
    Index.resizeTwitchIframes();
    Index.loadTeldoGasmImage();
    Index.initBamboogasmCount();
    Index.loadSounds();
});

$(window).resize(function() {
    Index.resizeTwitchIframes();
});

