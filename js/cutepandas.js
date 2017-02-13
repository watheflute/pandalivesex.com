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
        this.loadCutePandaGif(cutepandas_gifs, 0);
    },

    loadCutePandaGif: function(cutepandas_gifs, index) {
        $('#cutepandas').append('<img id="cutepandas_' + index + '" />');
        var imageObj = new Image();
        imageObj.id = index;
        var self = this;
        imageObj.onload = function() {
            $('#cutepandas_' + this.id).attr('src', this.src);
            if (parseInt(this.id) + 1 < cutepandas_gifs.length) {
                self.loadCutePandaGif(cutepandas_gifs, parseInt(this.id)  + 1);
            }
        };
        imageObj.src = '/im/cutepandas/' + cutepandas_gifs[index] + '.gif';
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
