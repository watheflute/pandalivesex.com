var CutePandas = {
    initCutePandasArray: function(size) {
        var array = [];
        for (var i=1; i <= size; i++) {
            array.push(i);
        }
        Common.shuffle(array);
        return array;
    },

    loadCutePandas: function(arraySize, mediaTagStart, mediaTagEnd) {
        var cutepandasArray = this.initCutePandasArray(arraySize);
        for (var i=0; i < cutepandasArray.length; i++) {
            $('#cutepandas').append(mediaTagStart + cutepandasArray[i] + mediaTagEnd);
        }
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
        imageObj.src = '/im/cutepandas/gifs/' + cutepandas_gifs[index] + '.gif';
    }
};

$(document).ready(function() {
    Common.displayMenu();
    CutePandas.loadCutePandas(
        Data.NUMBER_OF_PANDA_MP4S,
        '<video preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" height="282"><source src="/vid/cutepandas/mp4/',
        '.mp4" type="video/mp4"></video>');
    CutePandas.loadCutePandas(
        Data.NUMBER_OF_PANDA_JPGS,
        '<img src="/im/cutepandas/jpg/',
        '.jpg" />');
    CutePandas.loadCutePandasGifs();
});
