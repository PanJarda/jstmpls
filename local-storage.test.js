var counter = 0;

var handler = setInterval(function() {
    document.getElementById("app").innerHTML = counter++;
}, 16);

var N = 1000;

function store(i) {
    window.localStorage.setItem("ahoj." + i, "prdel");
    if ( i !== N)
        return;

    performance.measure("fff", "start");
    var pre = document.createElement("pre");
    pre.innerHTML = (performance.getEntriesByType("measure")[0].duration);
    document.body.appendChild(pre);
    performance.clearMarks();
    performance.clearMeasures();
    window.localStorage.clear();
}

function test() {
    window.localStorage.clear();
    setInterval(function() {
        clearInterval( handler );
    },2000);
    performance.mark("start");
    for ( var i = 1; i <= N; i++ )
        setTimeout(store, 0, i);
}

setTimeout(test,2000);
