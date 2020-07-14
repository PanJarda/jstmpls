/*
input:
{
    key1: "ahoj",
    key2: "222"
},
div({class: "ahoj"},
    h1({},key1),
    div({},key2)
)
->
function({ key1, key2 }): Effect


datastruct:
{
    key1: ref1,
    key2: ref2
}


// hyperscript
input:
div({class,style,...}, value)
output:
//memoized, keeping ref
function(value) {}

var divAhoj = div({class: "content"}, "ahoj");
// <div class="content">fff</div>;
divAhoj.appendTo(document.body);
divAhoj("fff"); // <div class="content">fff</div>;
?: divAhoj.addClass("fff");
?: divAhoj.removeClass("content");
divAhoj.setProp("class", "content fff");
divAhoj.ref = #123;


var content = div({class: "content"},
    key1=h1({}, "initValue"),
    key2=div({}, "initValue")
);

document.body.appendChild(content.ref);

key1("fokyou");
key2('fff');

function componentUpdate({key1: fn1, key2:fn2}) {
    return function({key1: value1, key2: value2}) {
        fn1(value1);
        fn2(value2);
    }
}

var prdel = componentUpdate({key1: key1, key2: key2});
prdel({key1: "fokof", key2: "vyser si oko"});
prdel({key1: "kokot"})


////
Usage:
musim to nejak navazat na eventy

state = Observable({clicks: 0});
myButton = h( "button", { onClick: e => state.clicks++ }, "clicked " + state.clicks );
state.register(() => button("clicks " + this.clicks));


model -> componentTree -> Effect(updatesDom);

Event(click) -> eventHandler -> async modify Model -> repeat above;

*/


h('ul', {}, [
    h('li', {}, props => props.list[0],
    h('li', {}, props => props.list[1]))
]);


// timto si vytvorim neco jako closuru, kdy dal do childu posilam jenom subtree a to musi byt pole
hEach('ul', {},
    props => props.list,
    h('li', {}, item => item.test ));

// nadrazeny prvek v tomto pripade h1 tvori kontejner ve kterem se podminecne mountuje a unmountuje ten span
hIf('h1', {},
    props => props.cond === true,
    'span', {}, props => props.errorMsg );


// muzu si vytvorit funkci ktera mi prevadi vstup na prislusny klic v poli
hIf('h1', {},
    props => props.isError === true,
    'span', {}, _prop('errorMsg') );


// muzu si vytvorit funkci ktera mi prevadi vstup na prislusny klic v poli
hIf(
    h('h1', {}, "ahoj" ),
    _prop( 'isError' ),
        h('span', {}, _prop( 'errorMsg' )) );