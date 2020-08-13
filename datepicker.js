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
    if ( day > N ) {
        day = 1;
    }
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

    function cell(index) {
        return h('td', { 'class': active(index), 'data-index': index, ev: { click: setDate } }, day(index));
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
                    // todo: napsat si funkci na td(index)
                    cell(0),
                    cell(1),
                    cell(2),
                    cell(3),
                    cell(4),
                    cell(5),
                    cell(6)
                ]),
                h('tr',_, [
                    cell(7),
                    cell(8),
                    cell(9),
                    cell(10),
                    cell(11),
                    cell(12),
                    cell(13)
                ]),
                h('tr',_, [
                    cell(14),
                    cell(15),
                    cell(16),
                    cell(17),
                    cell(18),
                    cell(19),
                    cell(20)
                ]),
                h('tr',_, [
                    cell(21),
                    cell(22),
                    cell(23),
                    cell(24),
                    cell(25),
                    cell(26),
                    cell(27)
                ]),
                h('tr',_, [
                    cell(28),
                    cell(29),
                    cell(30),
                    cell(31),
                    cell(32),
                    cell(33),
                    cell(34)
                ]),
                h('tr',_, [
                    cell(35),
                    cell(36),
                    cell(37),
                    cell(38),
                    cell(39),
                    cell(40),
                    cell(41)
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