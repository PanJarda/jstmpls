var model = {
    clicks: 0,
    error: "",
    class: "",
    show: true,
    input: "",
    itemInputs: [1,2,3,4,5],
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

var view =
    h('div', { class: "ahoj" }, [
        h('h1', { class: _prop("class"),
                  ev: { click: toggleClass }
                }, "Ahoj" ),
        h('div', {}, [
            h('p', {}, _prop( "clicks" ) )
        ]),
        h('span', {}, _prop( "error" ) ),
        h('hr'),
        h('button', { ev: { mouseup: addClicks} }, "   +   " ),
        h('i', {}, " "),
        h('button', { ev: { mouseup: subClicks} }, "   -   " ),
        hIf( h('h2', {}, "Ahoj" ),
            _prop( "error" ),
                h('span', {}, _prop("error"))),
        h('div', {}, [
            h('div',{}, [
                h('div', {}, [
                    h('div', {}, [
                        h('h1', {}, "Ahoj")
                    ]),
                    h('div', {}, [
                        h('h2', {}, "Dalsi ahoj")
                    ])
                ])
            ])
        ]),
        hFor( h('ul'),
            _prop("items"),
                'li', {}, () => [
                    h('span',{}, _prop("item")),
                    h('span',{}, " "),
                    h('input', {value: _prop("item"),"data-index": _prop("index"),ev:{change:itemInputChange}}),
                    h('button',{"data-index": _prop("index"),ev:{click: editItem}}, "edit"),
                    h('button', {"data-index": _prop("index"), ev:{ mouseup: removeItem}}, " X ")
                ]),
        h('input', {value: _prop("input"), ev:{change: inputChange }} ),
        h('button', {ev:{mouseup: addItem}}, "add Item")
    ]);

document.getElementById('app').appendChild(view.ref);

function updateView() {
    view( model );
}

updateView();


