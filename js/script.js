var TITLES = Array(
    '"Panda Live SeX, cos pandas\' ass is the best"',
    '"Panda Live SeX, they\'re trying their best"',
    '"Panda Live SeX, prepare your Kleenex"',
    '"Panda Live SeX, schlongs harder than silex"'
);

var sounds = {
    'teldoCroak': Array({name:'bombotchikahaa'}, {name:'ohchikadaa'}, {name:'spit_on_him'}, {name:'punisherino'}, {name:'uhm_uhm_uhm'}),
    'teldoGasm': Array({name:'aaaah'}, {name:'haaan_aaah_oooh'}, {name:'ooooh'}, {name:'ooouuu'}),
    'teldoHappy': Array({name:'omg_i_love_garlic'}, {name:'lets_fuck_him_up'}, {name:'papadadaduduu'}, {name:'timmy'}, {name:'weee'}),
    'other': Array({name:'holy_macaroni'}, {name:'time_to_shiiiine'})
};

var soundKeys = Object.keys(sounds);

function initSounds() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    catch (e) {
        return;
    }
    for (var i=0; i < soundKeys.length; i++) {
        loadSounds(soundKeys[i], 0);
    }
}

function loadSounds(soundKey, currentSoundLoading) {
    console.log('load sounds: ' + soundKey + ' - ' + currentSoundLoading);
    var request = new XMLHttpRequest();
    var soundName = sounds[soundKey][currentSoundLoading].name;
    request.open("GET", "mp3/" + soundKey + "/" + soundName + ".mp3", true);
    request.responseType = "arraybuffer";
    request.key = {soundkey: soundKey, soundnumber: currentSoundLoading, soundname: soundName};
    request.onload = onSoundLoad;
    request.send();
}

function onSoundLoad(xhr) {
    var key = xhr.target.key;

    audioContext.decodeAudioData(xhr.target.response, function(buffer) {
        sounds[key.soundkey][key.soundnumber].buffer = buffer;
        var button = '<figure id="' + key + '" ';
        button += 'onclick="playSound(\'' + key.soundkey + '_' + key.soundnumber + '\');" ';

        var image = 'teldo/' + key.soundkey;
        if (key.soundkey == "other") {
            image = 'other/' + key.soundname;
        }

        button += '><img src="im/' + image + '.png" /><figcaption>' + sounds[key.soundkey][key.soundnumber].name.split('_').join(' ') + '</figcaption></figure>';
        $("#soundboard").append(button);

        if (key.soundnumber + 1 < sounds[key.soundkey].length) {
            loadSounds(key.soundkey, key.soundnumber+1);
        }
    }, function() {
    });
}

function playSound(key) {
    key = key.split('_');
    key[1] = parseInt(key[1]);
    var sound = sounds[key[0]][key[1]];

    if (sound.source) {
        sound.source.stop(0);
        sound.source.onended = null;
        sound.source = null;
    }

    if (!sound.source) {
        sound.source = audioContext.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.connect(audioContext.destination);
        sound.source.start(0);
    }
}

function displayRandomTitle() {
    var randomTitle = TITLES[Math.floor(Math.random()*TITLES.length)];
    document.getElementById('title').innerHTML = randomTitle;
}

window.onload = function() {
    displayRandomTitle();
    initSounds();
};

