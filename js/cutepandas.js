var CutePandas = {
    initCutePandasArray: function(size) {
        var array = [];
        for (var i=1; i <= size; i++) {
            array.push(i);
        }
        Common.shuffle(array);
        return array;
    },
    loadCutePandasGifs: function() {
        var cutepandas_gifs = this.initCutePandasArray(Data.NUMBER_OF_PANDA_GIFS);
        for (var i=0; i < cutepandas_gifs.length; i++) {
            $('#cutepandas').append('<img id="cutepandas_' + i + '" />');
            var imageObj = new Image();
            imageObj.id = i;
            imageObj.onload = function() {
                $('#cutepandas_' + this.id).attr('src', this.src);
            };
            imageObj.src = '/im/cutepandas/' + cutepandas_gifs[i] + '.gif';
        }
    },
    loadCutePandaVids: function() {
        var cutepandas_vids = this.initCutePandasArray(Data.NUMBER_OF_PANDA_VIDS);
        for (var i=0; i < cutepandas_vids.length; i++) {
            $('#cutepandas').append('<video preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" height="282"><source src="/mp4/cutepandas/' + cutepandas_vids[i] + '.mp4" type="video/mp4"></video>');
        }
    }
};

$(document).ready(function() {
    Common.displayMenu();
    CutePandas.loadCutePandasGifs();
    CutePandas.loadCutePandaVids();
});
