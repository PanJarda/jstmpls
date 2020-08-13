function main() {
    var init = {
        selected: {
           /* 'fdsfsa': 0*/
           '123131': 0
        },
        tree: [
            ['123131', 'cesko', 0, /*checked*/true],
            ['123132', 'olomoucky kraj', /*level:*/1, false],
            ['123133', 'Olomouc', 2, false],
            ['123124', 'Pardubicky kraj', 1, false],
            ['12daf5', 'Praha', 1, false],
        ],
        tree: {
            '123131': {
                name: 'cesko',
                level: 0
            }
        }
    };

    var model = init;
 
    var _ = false;
 
    function get(key) {
        return function(model) {
            return model[key];
        };
    }

    function itemClick(e) {
        var id = e.target.getAttribute('data-id');
        var index = e.target.getAttribute('data-index');
        var checked = e.target.checked;
        var tmp = model.tree[index].slice();
        model.tree[index] = tmp;
        model.tree[index][3] = checked;
        if (checked) {
            model.selected[id] = index;
        } else {
            delete model.selected[id];
        }
        updateView();
    }

    function deleteItem(e) {
        var id = e.target.getAttribute('data-id');
        var index = model.selected[id];
        var tmp = model.tree[index].slice();
        tmp[3] = false;
        model.tree[index] = tmp;
        delete model.selected[id];
        updateView();
    }

    function treeNode() {
        return h('li', _, treeNode())
    }

    var view = h('div', _, [
        hFor(
            h('ul'),
            function(model) {return Object.keys(model.selected).map(function(key) {
                return model.tree[model.selected[key]];
            })},
            function() {
                return h('li', _, [
                    h('span', _, function(model) {return model.item[1]}),
                    h('button', {
                        'data-id': function( model ) { return model.item[0] },
                        ev: {
                            'click': deleteItem
                        }
                    }, 'x')
                ]);
            }
        ),
        h('input'),
        hFor(
            h('ul'),
            get('tree'),
            function() {
                return h('li',_, [
                        h('span', _, function(model) { var n = model.item[2],res=''; for ( var i = 0; i < n; i++) res+='\xa0\xa0\xa0\xa0'; return res}),
                        h('input', {
                            type: 'checkbox',
                            'checked': function(model) {return model.item[3]},
                            'data-index': get('index'),
                            'data-id': function(model) {return model.item[0]},
                            'id': function(model) {return 'checkbox' + model.index},
                            ev: {
                                'change': itemClick
                            }
                        }),
                        h('label', {
                            'for': function(model) {return 'checkbox' + model.index}
                        }, function(model){return model.item[1]})
                    ]
                );
            }
        )
    ]);

    function updateView( m ) {
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