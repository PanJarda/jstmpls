var Store = (function() {

    function Store( reducer ) {
        this.reducer = reducer;
    }

    Store.prototype.getInstance = function ( reducer ) {
        
    };
    
    Store.prototype.getState = function () {}
    
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




function main() {
    var initState = {
            clicks: 0,
            error: "",
            className: "",
            show: true,
            input: "",
            itemInputs: [1,2,3,4,5],
            items: [
                1,2,3,4,5
            ]
        };
    };

    function addClick( state ) {
        return assignDeep( state, {
            clicks: state.clicks + 1
        });
    }

    function addClicks( event ) {
        model.clicks++;
        if ( model.clicks > 0 ) {
            model.error = "";
            model.show = true;
        }
        updateView();
    }
    
    function subClicks( event ) {
        model.clicks--;
        if ( model.clicks < 0 ) {
            model.error = "Fok You!";
            model.show = false;
        }
        updateView();
    }
    
    function toggleClass( event ) {
        model.className = model.className === "red" ? "" : "red";
        updateView();
    }
    
    function inputChange(e) {
        model.input = e.target.value;
    }
    
    function addItem(event) {
        model.items.push(model.input);
        model.itemInputs.push(model.input);
        model.input = "";
        updateView();
    }
    
    function removeItem( event ) {
        console.log("removing item " + event.target.getAttribute("data-index"));
        var id;
        model.items.splice(id = event.target.getAttribute("data-index") * 1, 1);
        model.itemInputs.splice(id);
        updateView();
    }
    
    function itemInputChange( event ) {
        var index = event.target.getAttribute("data-index");
        model.itemInputs[index] = event.target.value;
    }
    
    function editItem(e) {
        var i = e.target.getAttribute("data-index");
        model.items[i] = model.itemInputs[ i ];
        model.itemInputs[ i ] = "";
        updateView();
    }
    
    var _ = false;
    
    function get( key ) {
        return function( obj ) {
            return obj[ key ]
        }
    }

    var view =
        h('div', { "class": "ahoj" }, [
            h('h1', { "class": get("className"),
                    ev: { click: toggleClass }
                    }, "Ahoj" ),
            h('div', _, [
                h('p', _, get( "clicks" ) )
            ]),
            h('span', _, get( "error" ) ),
            h('hr'),
            h('button', { ev: { mouseup: addClicks} }, "   +   " ),
            h('i', _, " "),
            h('button', { ev: { mouseup: subClicks} }, "   -   " ),
            hIf( h('h2', _, "Ahoj" ),
                get( "error" ),
                    h('span', _, get("error"))),
            h('div', _, [
                h('div',_, [
                    h('div', _, [
                        h('div', _, [
                            h('h1', _, "Ahoj")
                        ]),
                        h('div',_, [
                            h('h2', _, "Dalsi ahoj")
                        ])
                    ])
                ])
            ]),
            hFor( h('ul'),
                get("items"),
                function() {
                    return h('li', _, [
                        h('span',_, get("item")),
                        h('span',_, " "),
                        h('input', {value: get("item"),"data-index": get("index"),ev:{change:itemInputChange}}),
                        h('button',{"data-index": get("index"),ev:{click: editItem}}, "edit"),
                        h('button', {"data-index": get("index"), ev:{ mouseup: removeItem}}, " X ")
                    ]);
                }),
            h('input', {value: get("input"), ev:{change: inputChange }} ),
            h('button', {ev:{mouseup: addItem}}, "add Item")
        ]);

    function updateView( model ) {
        view.update( model );
    }
    updateView();
    var app = document.getElementById('app');
    app.innerHTML = "";
    app.appendChild(view.ref);
}

if (window.addEventListener) {
    window.addEventListener('load', main, false);
} else if (window.attachEvent) {
    document.onreadystatechange = new function() {
        console.log(document.readyState);
        if (document.readyState === 'complete' || document.readyState === 'interactive')
            main();
    };
}

