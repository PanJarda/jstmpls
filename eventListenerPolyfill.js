if (!window.addEventListener)
    Element.prototype.addEventListener = function(evName, callback) {
        attachEvent('on' + evName, function (e) {
            e.target = e.srcElement;
            callback(e);
        })
    };