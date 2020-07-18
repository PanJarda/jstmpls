var Store = (function() {

    function Store( reducer ) {
        this.reducer = reducer;
    }

    Store.prototype.getState = function () {

    };
    
    Store.prototype.dispatch = function ( action ) {
        
    };
    
    Store.prototype.subscribe = function ( handler ) {
    
    };

    Store.prototype.unsubscribe = function ( handler ) {};

    var instance;
    
    function getInstance() {
        if ( !instance )
            return instance = new Store();
        else
            return instance;
    }

    return {
        getInstance: getInstance
    };
});


