var model = {
    clicks: 0,
    error: "",
    class: "",
    show: true,
    input: "",
    items: [
        1,2,3,4,5
    ]
};

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

function toggleClass( event ){
    model.class = model.class === "red" ? "" : "red";
    updateView();
}

function inputChange(e) {
    model.input = e.target.value;
}

function addItem(event) {
    model.items.push(model.input);
    model.input = "";
    updateView();
}

function removeItem( event ) {
    console.log("removing item " + event.target.getAttribute("data-index"));
    model.items.splice(event.target.getAttribute("data-index") * 1, 1);
    updateView();
}

var view =
    h('div', { class: "ahoj" }, [
        h('h1', { class: _prop("class"),
                  ev: { click: toggleClass }
                }, "Ahoj" ),
        h('div', _, [
            h('p', _, _prop( "clicks" ) )
        ]),
        h('span', _, _prop( "error" ) ),
        h('hr'),
        h('button', { ev: { mouseup: addClicks} }, "   +   " ),
        h('i', _, " "),
        h('button', { ev: { mouseup: subClicks} }, "   -   " ),
        hIf( h('h2', _, "Ahoj" ),
            _prop( "error" ),
                h('span', _, _prop("error"))),
        h('div', _, [
            h('div',_, [
                h('div', _, [
                    h('div', _, [
                        h('h1', _, "Ahoj")
                    ]),
                    h('div', _, [
                        h('h2', _, "Dalsi ahoj")
                    ])
                ])
            ])
        ]),
        hFor( h('ul'),
            _prop("items"),
                'li', _, () => [
                    h('span',_, _prop("item")),
                    h('button', {"data-index": _prop("index"), ev:{ mouseup: removeItem}}, " X ")
                ]),
        h('input',{value: _prop("input"),ev:{change: inputChange}}),
        h('button', {ev:{mouseup: addItem}}, "add Item")
    ]);

document.getElementById('app').appendChild(view.ref);

function updateView() {
    view( model );
}

updateView();


