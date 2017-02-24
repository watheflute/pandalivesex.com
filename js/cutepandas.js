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
    CutePandas.loadCutePandas(
        Data.NUMBER_OF_PANDA_GIFS,
        '<img src="/im/cutepandas/gifs/',
        '.gif" />');
});
