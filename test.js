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

var _ = false;

var view =
    h('div', { class: "ahoj" }, [
        h('h1', { class: prop("class"),
                  ev: { click: toggleClass }
                }, "Ahoj" ),
        h('div', _, [
            h('p', _, prop( "clicks" ) )
        ]),
        h('span', _, prop( "error" ) ),
        h('hr'),
        h('button', { ev: { mouseup: addClicks} }, "   +   " ),
        h('i', _, "\u00A0\u00A0\u00A0"),
        h('button', { ev: { mouseup: subClicks} }, "   -   " ),
        hIf( h('h2', _, "Ahoj" ),
            prop( "error" ),
                h('span', _, prop("error"))),
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
            prop("items"),
                'li', _, function() { return [
                    h('span',_, prop("item")),
                    h('span',_, " "),
                    h('input', {value: prop("item"),"data-index": prop("index"),ev:{change:itemInputChange}}),
                    h('button',{"data-index": prop("index"),ev:{click: editItem}}, "edit"),
                    h('button', {"data-index": prop("index"), ev:{ mouseup: removeItem}}, " X ")
                ] }),
        h('input', {value: prop("input"), ev:{change: inputChange }} ),
        h('button', {ev:{mouseup: addItem}}, "add Item")
    ]);

var app = document.getElementById('app');
app.innerHTML = "";
app.appendChild(view.ref);

function updateView() {
    view( model );
}

updateView();


