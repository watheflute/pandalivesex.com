var Soundboard = {
    audioContext: null,

    randomizeSounds: function() {
        var keys = Object.keys(Data.SOUNDS);
        for (var i=0; i < keys.length; i++) {
            Common.shuffle(Data.SOUNDS[keys[i]]);
        }
    },

    loadSounds: function() {
        this.audioContext = Common.initAudioContext();
        if (this.audioContext == null) {
            return;
        }

        var rows_to_visit = [];
        var keys = Object.keys(Data.SOUNDS);
        for (var i=0; i < keys.length; i++) {
            rows_to_visit.push(i);
        }

        var column = 0;
        while (rows_to_visit.length > 0) {
            var rows_becoming_empty = [];
            for (var i=0; i < rows_to_visit.length; i++) {
                this.loadSound(keys[rows_to_visit[i]], Data.SOUNDS[keys[rows_to_visit[i]]][column].name, column);
                if (Data.SOUNDS[keys[rows_to_visit[i]]][column + 1] == null) {
                    rows_becoming_empty.push(rows_to_visit[i]);
                }
            }
            for (var i=0; i < rows_becoming_empty.length; i++) {
                rows_to_visit.splice(rows_to_visit.indexOf(rows_becoming_empty[i]), 1);
            }
            column++;
        }
    },

    loadSound: function(soundKey, soundName, soundIndex) {
        var request = new XMLHttpRequest();
        request.open("GET", "/sound/" + soundKey + "/" + soundName + ".mp3", true);
        request.responseType = "arraybuffer";
        request.key = {soundKey: soundKey, soundIndex: soundIndex, soundName: soundName, audioContext: this.audioContext};
        request.onload = this.onSoundLoad;
        request.send();
    },

    onSoundLoad: function(xhr) {
        var key = xhr.target.key;
        key.audioContext.decodeAudioData(xhr.target.response, function(buffer) {
            Data.SOUNDS[key.soundKey][key.soundIndex].buffer = buffer;
            var button = '<figure id="' + key + '" ';
            button += 'onclick="Soundboard.playSound(\'' + key.soundKey + '_' + key.soundIndex + '\');" ';

            var imagePath = '/im/';
            if (key.soundKey.startsWith('teldo')) {
                imagePath += 'teldo/' + key.soundKey;
            } else if (key.soundKey == 'other') {
                imagePath += 'other/' + key.soundName;
            } else {
                imagePath += 'other/' + key.soundKey;
            }

            var imageExt = '.png';
            if (key.soundKey == 'other') {
                imageExt = Data.SOUNDS[key.soundKey][key.soundIndex].im;
            }
            var soundDisplayName = Data.SOUNDS[key.soundKey][key.soundIndex].name.split('_').join(' ');
            button += '><img src="' + imagePath + imageExt + '" /><figcaption>' + soundDisplayName + '</figcaption></figure>';
            $("#soundboard").append(button);
        }, function() {
        });
    },

    playSound: function(key) {
        key = key.split('_');
        key[1] = parseInt(key[1]);
        var sound = Data.SOUNDS[key[0]][key[1]];

        if (sound.source) {
            sound.source.stop(0);
            sound.source.onended = null;
            sound.source = null;
        }

        if (!sound.source) {
            sound.source = this.audioContext.createBufferSource();
            sound.source.buffer = sound.buffer;
            sound.source.connect(this.audioContext.destination);
            sound.source.start(0);
        }
    }
};

$(document).ready(function() {
    Common.displayMenu();
    Soundboard.randomizeSounds();
    Soundboard.loadSounds();
});
