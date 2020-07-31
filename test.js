var Model = {
    state: {
        clicks: 0,
        error: "",
        className: "",
        show: true,
        input: "",
        itemInputs: [1,2,3,4,5],
        items: [
            1,2,3,4,5
        ]
    },

}

/*
asynchronicita nehraje roli since vsecko je singlethreaded
 */
function main() {
    var init = {
        clicks: 0,
        error: "",
        className: "",
        show: true,
        input: "",
        itemInputs: [],
        items: []
    };

    var model = init;
    function loadModel() {
        console.log('loading model');
        model = JSON.parse(window.localStorage.getItem("model")) || init;
        updateView();
    }
    setTimeout(loadModel, 0);
     
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

    function storeModel() {
        window.localStorage && window.localStorage.setItem("model", JSON.stringify( model ));
    }
    
    var _ = false;
    
    function day( key ) {
        return function( obj ) {
            return obj[ key ]
        }
    }

    function route( e ) {
        //console.log( e.target.href );
        //history.pushState({}, 'prdel', e.target.href );
        //e.preventDefault();
    }

    window.addEventListener('hashchange', function() {
        model.show = !model.show;
        console.log(model.show);
        updateView();
    });

    //window.addEventListener('storage', loadModel)

    var view =
        h('div', { "class": "ahoj" }, [
            h('h1', { "class": day("className"),
                    ev: { click: toggleClass }
                    }, "Ahoj" ),
            h('div', _, [
                h('p', _, day( "clicks" ) )
            ]),
            h('span', _, day( "error" ) ),
            h('a', {href:'#prdel', ev: { click: route }}, "link1"),
            h('hr'),
            h('button', { ev: { mousedown: addClicks} }, "   +   " ),
            h('i', _, " "),
            h('button', { ev: { mousedown: subClicks} }, "   -   " ),
            hIf( h('h2', _, "Ahoj" ),
                day( "error" ),
                    h('span', _, day("error"))),
            hIf(h('div'),
                day("show"),
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
                day("items"),
                function() {
                    return h('li', _, [
                        h('span',_, day("item")),
                        h('span',_, " "),
                        h('input', {value: day("item"),"data-index": day("index"),ev:{change:itemInputChange}}),
                        h('button',{"data-index": day("index"),ev:{click: editItem}}, "edit"),
                        h('button', {"data-index": day("index"), ev:{ mouseup: removeItem}}, " X ")
                    ]);
                }),
            h('input', {value: day("input"), ev:{change: inputChange }} ),
            h('button', {ev:{mouseup: addItem}}, "add Item")
        ]);

    function updateView( m ) {
        setTimeout(storeModel, 0);
        if ('update' in view)
            view.update( m || model );
        else
            view(m || model);
    }
    if ('update' in view)
        view.update( model );
    else
        view(model);

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