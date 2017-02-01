var TITLES = Array(
    '"Panda Live SeX, cos pandas\' ass is the best"',
    '"Panda Live SeX, they\'re trying their best"',
    '"Panda Live SeX, prepare your Kleenex"',
    '"Panda Live SeX, schlongs harder than silex"'
);

var sounds = {
    'teldoCroak': Array({name:'bombotchikahaa'}, {name:'ohchikadaa'}, {name:'ooh_spit_on_him_oooh_sorry'}, {name:'punisherino'}),
    'teldoGasm': Array({name:'aaaah'}, {name:'haaan_aaah_oooh'}, {name:'ooooh'}, {name:'ooouuu'}),
    'teldoHappy': Array({name:'garlic_omg_i_love_garlic'}, {name:'lets_fuck_him_up'}, {name:'papadadaduduu'}, {name:'timmy'})
};

var currentSoundLoading = 0;
var currentSoundKey = 0;
var soundKeys = Object.keys(sounds);

var soundKeysNotLoaded = Array();
for (var i=0; i < soundKeys.length; i++) {
    soundKeysNotLoaded.push(i);
}


function initSounds() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    catch (e) {
        return;
    }
    loadSound();
}

function loadSound() {
    console.log(soundKeysNotLoaded);
    console.log('load sound: ' + currentSoundKey + ' - ' + currentSoundLoading);
    var request = new XMLHttpRequest();
    var soundName = sounds[soundKeys[currentSoundKey]][currentSoundLoading].name;
    var soundKey = soundKeys[currentSoundKey];
    request.open("GET", "mp3/" + soundKey + '/' + soundName + '.mp3', true);
    request.responseType = "arraybuffer";
    request.key = {soundkey: soundKey, soundnumber: currentSoundLoading};
    request.onload = onSoundLoad;
    request.send();
}

function onSoundLoad(xhr) {
    var key = xhr.target.key;

    audioContext.decodeAudioData(xhr.target.response, function(buffer) {
        sounds[key.soundkey][key.soundnumber].buffer = buffer;
        var button = '<figure id="' + key + '" ';
        button += 'onclick="playSound(\'' + key.soundkey + '_' + key.soundnumber + '\');" ';
        button += '><img src="im/' + key.soundkey + '.png" /><figcaption>' + sounds[key.soundkey][key.soundnumber].name.split('_').join(' ') + '</figcaption></figure>';
        $("#soundboard").append(button);

        if (sounds[soundKeys[currentSoundKey]][currentSoundLoading + 1] == null) {
            soundKeysNotLoaded.splice($.inArray(currentSoundKey, soundKeysNotLoaded),1);
        }

        if (++currentSoundKey >= soundKeys.length) {
            currentSoundKey = 0;
            currentSoundLoading++;
        }

        if ($.inArray(currentSoundKey, soundKeysNotLoaded) == -1) {
            currentSoundKey = soundKeysNotLoaded[0];
        }

        if (soundKeysNotLoaded.length != 0) {
            loadSound();
        }
    }, function() {
    });
}

function playSound(key) {
    key = key.split('_');
    key[1] = parseInt(key[1]);

    if (sounds[key[0]][key[1]].source) {
        sounds[key[0]][key[1]].source.stop(0);
        sounds[key[0]][key[1]].source.onended = null;
        sounds[key[0]][key[1]].source = null;
    }

    if (!sounds[key[0]][key[1]].source) {
        sounds[key[0]][key[1]].source = audioContext.createBufferSource();
        sounds[key[0]][key[1]].source.buffer = sounds[key[0]][key[1]].buffer;
        sounds[key[0]][key[1]].source.connect(audioContext.destination);
        sounds[key[0]][key[1]].source.start(0);
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

