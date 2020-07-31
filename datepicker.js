function daysInMonth(y, m) {
    var r = 30 + (m + Math.floor(m / 8)) % 2;
    
    return m == 2
        ? r - 2 + Math.pow(0, y % 4) - Math.pow(0, y % 100) + Math.pow(0, y % 400)
        : r;
}


function recalcDays(model) {
    // get day of week of 1. day of this moth,
    // var start = getDayOfWeek(year, month, 1)
    // get daysInMonth(year, month);
    // naplnime pole od daneho indexu;
    var year = model.year;
    var month = model.month;
    var day = model.day;
    var firstDay = new Date(year, month - 1, 1);
    var dayOfWeek = (firstDay.getDay() + 6 ) % 7;
    console.log(dayOfWeek);
    var N = daysInMonth(year, month);
    var $array = model.days;

    // mazeme stare cisla
    for ( var i = 0; i < dayOfWeek; i++ ) {
        $array[i] = undefined;
    }
    for (var i = dayOfWeek + N - 1; i < 42; i++ ) { 
        $array[i ] = undefined;
    }

    // novej calendar
    for ( var i = 1; i <= N; i++ ) {
        $array[i + dayOfWeek - 1] = i;
    }
    model.active = day + dayOfWeek - 1;
}

function main() {
    var now = new Date();
    var init = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        active: 1,
        days: []
    }
    recalcDays(init);

    var model = init;
 
    var _ = false;
    
    function get( key ) {
        return function( obj ) {
            return obj[ key ]
        };
    }

    function day(i) {
        return function(model) {
            return model.days[i];
        };
    }

    function active(i) {
        return function(model) {
            return i === model.active ? 'active' : ''
        };
    }

    function prevMonth() {
        if (model.month === 1)
            model.year--;
        model.month = (( model.month + 10 ) % 12) + 1;
        recalcDays(model);
        updateView();
    }

    function nextMonth(e) {
        if (model.month === 12 )
            model.year++;
        model.month = (( model.month ) % 12) + 1;
        recalcDays(model);
        updateView();
    }

    function prevYear(e) {
        model.year--;
        recalcDays(model);
        updateView();
    }

    function nextYear(e) {
        model.year++;
        recalcDays(model);
        updateView();
    }

    function setNow() {
        var now = new Date();
        model.year = now.getFullYear();
        model.month = now.getMonth() + 1;
        model.day = now.getDate();
        recalcDays( model );
        updateView();
    }

    function setDate(e) {
        var index = parseInt(e.target.getAttribute('data-index'));
        model.active = index;
        model.day = parseInt(e.target.innerText);
        console.log(e.target.innerText)
        updateView();
    }

    var view = h('div', _, [
            h('button', { ev: { click: setNow }}, 'Now'),
            h('table', _, [
                h('tr', _, [
                    h('td', _, 'Year:'),
                    h('td', _, get('year')),
                    h('td', _, [
                        h('button', { ev: { click: prevYear }}, 'Prev'),
                        h('button', { ev: { click: nextYear }}, 'Next')
                    ])
                ]),
                h('tr', _, [
                    h('td', _, 'Month:'),
                    h('td', _, get('month')),
                    h('td', _, [
                        h('button', { ev: { click: prevMonth }}, 'Prev'),
                        h('button', { ev: { click: nextMonth }}, 'Next')
                    ])
                ]),
                h('tr', _, [
                    h('td', _, 'Day:'),
                    h('td', _, get('day'))
                ])
            ]),
            h('table', { 'class': 'calendar', colspacing: 0 }, [
                h('tr',_, [
                    h('td', _, 'Po'),
                    h('td', _, 'Út'),
                    h('td', _, 'St'),
                    h('td', _, 'Čt'),
                    h('td', _, 'Pá'),
                    h('td', _, 'So'),
                    h('td', _, 'Ne')
                ]),
                h('tr',_, [
                    h('td', { 'class': active(0), 'data-index': 0, ev: { click: setDate } }, day(0)),
                    h('td', { 'class': active(1), 'data-index': 1, ev: { click: setDate } }, day(1)),
                    h('td', { 'class': active(2), 'data-index': 2, ev: { click: setDate } }, day(2)),
                    h('td', { 'class': active(3), 'data-index': 3, ev: { click: setDate } }, day(3)),
                    h('td', { 'class': active(4), 'data-index': 4, ev: { click: setDate } }, day(4)),
                    h('td', { 'class': active(5), 'data-index': 5, ev: { click: setDate } }, day(5)),
                    h('td', { 'class': active(6), 'data-index': 6, ev: { click: setDate } }, day(6))
                ]),
                h('tr',_, [
                    h('td', { 'class': active(7), 'data-index': 7, ev: { click: setDate } }, day(7)),
                    h('td', { 'class': active(8), 'data-index': 8, ev: { click: setDate } }, day(8)),
                    h('td', { 'class': active(9), 'data-index': 9, ev: { click: setDate } }, day(9)),
                    h('td', { 'class': active(10), 'data-index': 10, ev: { click: setDate } }, day(10)),
                    h('td', { 'class': active(11), 'data-index': 11, ev: { click: setDate } }, day(11)),
                    h('td', { 'class': active(12), 'data-index': 12, ev: { click: setDate } }, day(12)),
                    h('td', { 'class': active(13), 'data-index': 13, ev: { click: setDate } }, day(13))
                ]),
                h('tr',_, [
                    h('td', { 'class': active(14), 'data-index': 14, ev: { click: setDate } }, day(14)),
                    h('td', { 'class': active(15), 'data-index': 15, ev: { click: setDate } }, day(15)),
                    h('td', { 'class': active(16), 'data-index': 16, ev: { click: setDate } }, day(16)),
                    h('td', { 'class': active(17), 'data-index': 17, ev: { click: setDate } }, day(17)),
                    h('td', { 'class': active(18), 'data-index': 18, ev: { click: setDate } }, day(18)),
                    h('td', { 'class': active(19), 'data-index': 19, ev: { click: setDate } }, day(19)),
                    h('td', { 'class': active(20), 'data-index': 20, ev: { click: setDate } }, day(20))
                ]),
                h('tr',_, [
                    h('td', { 'class': active(21), 'data-index': 21, ev: { click: setDate } }, day(21)),
                    h('td', { 'class': active(22), 'data-index': 22, ev: { click: setDate } }, day(22)),
                    h('td', { 'class': active(23), 'data-index': 23, ev: { click: setDate } }, day(23)),
                    h('td', { 'class': active(24), 'data-index': 24, ev: { click: setDate } }, day(24)),
                    h('td', { 'class': active(25), 'data-index': 25, ev: { click: setDate } }, day(25)),
                    h('td', { 'class': active(26), 'data-index': 26, ev: { click: setDate } }, day(26)),
                    h('td', { 'class': active(27), 'data-index': 27, ev: { click: setDate } }, day(27))
                ]),
                h('tr',_, [
                    h('td', { 'class': active(28), 'data-index': 28, ev: { click: setDate } }, day(28)),
                    h('td', { 'class': active(29), 'data-index': 29, ev: { click: setDate } }, day(29)),
                    h('td', { 'class': active(30), 'data-index': 30, ev: { click: setDate } }, day(30)),
                    h('td', { 'class': active(31), 'data-index': 31, ev: { click: setDate } }, day(31)),
                    h('td', { 'class': active(32), 'data-index': 32, ev: { click: setDate } }, day(32)),
                    h('td', { 'class': active(33), 'data-index': 33, ev: { click: setDate } }, day(33)),
                    h('td', { 'class': active(34), 'data-index': 34, ev: { click: setDate } }, day(34))
                ]),
                h('tr',_, [
                    h('td', { 'class': active(35), 'data-index': 35, ev: { click: setDate } }, day(35)),
                    h('td', { 'class': active(36), 'data-index': 36, ev: { click: setDate } }, day(36)),
                    h('td', { 'class': active(37), 'data-index': 37, ev: { click: setDate } }, day(37)),
                    h('td', { 'class': active(38), 'data-index': 38, ev: { click: setDate } }, day(38)),
                    h('td', { 'class': active(39), 'data-index': 39, ev: { click: setDate } }, day(39)),
                    h('td', { 'class': active(40), 'data-index': 40, ev: { click: setDate } }, day(40)),
                    h('td', { 'class': active(41), 'data-index': 41, ev: { click: setDate } }, day(41))
                ])
            ])
        ]);

    function updateView( m ) {
        console.log(view);
        view.update( m || model );
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
        if (document.readyState === 'complete' || document.readyState === 'interactive')
            main();
    };
}