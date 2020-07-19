/*
asynchronicita nehraje roli since vsecko je singlethreaded
 */
/*
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState !== XMLHttpRequest.DONE)
        return;

    var status = xhr.status;
    if (status === 0 || (status >= 200 && status < 400)) {
        console.log(this.responseText);
    }
};
xhr.open("get", "/test.json");
xhr.send("foo=bar&lorem=ipsum");
*/
function Dispatcher(listeners, model, view) {
    this.listeners = listeners || {};
    this.model = model;
    this.view = view;
    this.dispatch('_init');
}

Dispatcher.prototype.addEventListener = function(ev, callback) {
    (this.listeners = this.listeners[ ev ] || []).push(callback);
}

Dispatcher.prototype.dispatch = function(action, e) {
    if (action !== '_before' && action !== '_after' && action !== '_init')
        this.dispatch('_before', e);

    var lst = this.listeners[action];
    if (lst) {
        var i = lst.length;
        while (i--) {
            this.model[lst[i]](e);
        }
    }
    if (action !== '_before' && action !== '_after' && action !== '_init')
        this.dispatch('_after', e);

    if (action === '_after' || action === '_init') {
        var self = this;
        window.requestAnimationFrame(function() {
            self.view.update(self.model);
        });
    }
};

function main() {
    var model = {
        clicks: 0,
        error: "",
        className: "",
        show: true,
        input: "",
        itemInputs: [],
        items: [],
        active: [],
        completed: [],
        addClicks: function() {
            this.clicks++;
            if ( this.clicks > 0 ) {
                this.error = "";
                this.show = true;
            }
        },
        subClicks: function() {
            this.clicks--;
            if ( this.clicks < 0 ) {
                this.error = "Fok You!";
                this.show = false;
            }
        },
        toggleClass: function() {
            this.className = this.className === "red" ? "" : "red";
        },
        inputChange: function(e) {
            this.input = e.target.value;
        },   
        addItem: function() {
            this.items.push(this.input);
            this.itemInputs.push(this.input);
            this.input = "";
        },
        removeItem: function(event) {
            console.log("removing item " + event.target.getAttribute("data-index"));
            var id;
            this.items.splice(id = event.target.getAttribute("data-index") * 1, 1);
            this.itemInputs.splice(id);
        },
        editItem: function(e) {
            var i = e.target.getAttribute("data-index");
            this.items[i] = this.itemInputs[ i ];
            this.itemInputs[ i ] = "";
        },
        itemInputChange: function( event ) {
            var index = event.target.getAttribute("data-index");
            this.itemInputs[index] = event.target.value;
        },
        storeModel: function() {
            console.log('storing');
            var self = this;
            if (window.localStorage)
                setTimeout(function() {
                    window.localStorage.setItem("model", JSON.stringify( self ));
                },0);
        },
        loadModel: function() {
            console.log('loading');
            var model = JSON.parse(window.localStorage.getItem("model"));
            var self = this;
            if (model) {
                Object.assign(self, model);
            }
        }
    }

    var _ = false;
    
    function get( key ) {
        return function( obj ) {
            return obj[ key ]
        }
    }

    window.addEventListener('hashchange', function() {
        //model.show = !model.show;
        //updateView();
    });

    window.addEventListener('storage', function() {
        console.log('storage event');
    })

    function dispatch(msg) {
        return function(e) {
            dispatcher.dispatch(msg,e);
        };
    }

    var view =
        h('div', { "class": "ahoj" }, [
            h('h1', { "class": get("className"),
                    ev: { click: dispatch('toggleClass') }
                    }, "Ahoj" ),
            h('div', _, [
                h('p', _, get('clicks'))
            ]),
            h('span', _, get( "error" ) ),
            h('a', {href:'#prdel'}, "link1"),
            h('hr'),
            h('button', { ev: { mouseup: dispatch('addClick') }}, "   +   " ),
            h('i', _, " "),
            h('button', { ev: { mouseup: dispatch('subClick')} }, "   -   " ),
            hIf( h('h2', _, "Ahoj" ),
                get( "error" ),
                    h('span', _, get("error"))),
            hIf(h('div'),
                get("show"),
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
            ),
            hFor( h('ul'),
                get("items"),
                function() {
                    return h('li', _, [
                                h('span',_, get("item")),
                                h('span',_, " "),
                                h('input', {value: get("item"),"data-index": get("index"),ev:{change:dispatch('itemInputChange')}}),
                                h('button',{"data-index": get("index"),ev:{click: dispatch('editItem')}}, "edit"),
                                h('button', {"data-index": get("index"), ev:{ mouseup: dispatch('removeItem') }}, " X ")
                            ]);
                }),
            h('input', {value: get("input"), ev:{change: dispatch('inputChange') }} ),
            h('button', {ev:{mouseup: dispatch('addItem')}}, "add Item")
        ]);

    var dispatcher = new Dispatcher({
        _init:       ['loadModel'],
        _before:     [],
        addClick:    ['addClicks'],
        subClick:    ['subClicks'],
        toggleClass: ['toggleClass'],
        inputChange: ['inputChange'],
        addItem:     ['addItem'],
        removeItem:  ['removeItem'],
        itemInputChange: ['itemInputChange'],
        editItem:    ['editItem'],
        loadModel:   ['loadModel'],
        _after:      ['storeModel']
    }, model, view);

    var app = document.getElementById('app');
    app.innerHTML = "";
    app.appendChild(view.ref);
}

if (window.addEventListener) {
    window.addEventListener('load', main, false);
} else if (window.attachEvent) {
    document.onreadystatechange = new function() {
        if (document.readyState === 'complete' || document.readyState === 'interactive')
            main();
    };
}


function route(e) {
    //e.preventDefault();
    console.log('hashchange');
}

//hashchange ma lepsi support IE8

window.addEventListener('popstate', function(e) {
    console.log('popstate');
});
window.addEventListener('hashchange', route);