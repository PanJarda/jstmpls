function ajax(query, callback) {
    console.log(query);
    setTimeout(
        callback,
        500,
        {
            name: 'world',
            children: {
                '232': {
                    name: 'FFF',
                    children: {
                        '1223': {
                            name: 'ad'
                        },
                        'fafsd': {
                            name: 'jesdfdfenik'
                        }
                    }
                },
                'wqe': {
                    name: 'Zlin',
                    children: {
                        'ccvd': {
                            name: 'Praha'
                        }
                    }
                }
            }
        }
    );
}

function flatten(res, id, node, depth) {
    res.push({
        name: node.name,
        id: id,
        depth: depth
    });
    if (!node.children)
        return;
    Object.keys(node.children).forEach(function(id) {
        flatten(res, id, node.children[id], depth + 1);
    });
}
    
function main() {
    var init = {
        inputRef: null,
        selected: [],
        selectedIds: {},
        serverResponse: {
            name: 'world',
            children: {
                '12393030': {
                    name: 'Olomoucky kraj',
                    children: {
                        '123123': {
                            name: 'Olomouc'
                        },
                        '3422': {
                            name: 'jesenik'
                        }
                    }
                },
                '3121313123': {
                    name: 'Zlinsky kraj',
                    children: {
                        '1312313': {
                            name: 'Zlin'
                        }
                    }
                }
            }
        },
        flattenedResponse: [
            {
                id: '12393030',
                name: 'Olomoucky kraj',
                depth: 0
            },
            {
                id: '123123',
                name: 'Olomouc',
                depth: 1
            },
            {
                id: '1232131',
                name: 'Jesenik',
                depth: 1
            }
        ]
    };

    var model = init;
 
    var _ = false;

    function updateTree(response) {
        console.log('updating');
        model.serverResponse = response;
        model.flattenedResponse = [];
        flatten(model.flattenedResponse, '__root__', model.serverResponse, 0);
        updateView();
    }
 
    function handleInput(e) {
        ajax(e.target.value, updateTree);
    }

    function handleClear() {
        model.inputRef.value = '';
    }

    function handleTagToggle(e) {
        var checked = e.target.checked,
            id = e.target.getAttribute('data-id'),
            name = e.target.getAttribute('data-name');
        if (checked) {
            model.selected.push({
                id: id,
                name: name
            })
            model.selectedIds[id] = true;
        } else {
            model.selected = model.selected.filter(function(item) {
                return item.id !== id;
            });
            delete model.selectedIds[id];
        }
        updateView();
    }

    function handleRemoveTag(e) {
        var id = e.target.getAttribute('data-id');
        model.selected = model.selected.filter(function(item) {
            return item.id !== id;
        });
        delete model.selectedIds[id];
        updateView();
    }

    function get(key) {
        return function(model) {
            return model[key];
        };
    }

    var ipnut;
    var view = h('div', _, [
        hFor(
            h('ul'),
            get('selected'),
            function() {
                return h('li', _, [
                    h('span', _, function(model) { return model.item.name; }),
                    h('button', {'data-id': function(model) {return model.item.id}, ev: {click: handleRemoveTag}}, 'X')
                ]);
            }
        ),
        input = h('input', {ev: {input: handleInput}}),
        h('button', {ev: {click: handleClear}}, 'clear'),
        hFor(
            h('ul'),
            get('flattenedResponse'),
            function() {
                return h('li', _, [
                    h('span', _, function(model) {
                        var indent = '',
                        n = model.item.depth;
                        for (var i = 0; i < n; i++)
                            indent += '\xa0\xa0\xa0';
                        return indent;
                    }),
                    h('input', {
                        type: 'checkbox',
                        'id': function(model) {return model.item.id},
                        'data-id': function(model) {return model.item.id},
                        'data-name': function(model) {return model.item.name},
                        'checked': function(model) {return model.item.selected},
                        ev: {
                            change: handleTagToggle
                        }
                    }),
                    h('label', {'for': function(model) {return model.item.id}}, function(model) { return model.item.name; })
                ]);
            }
        )
    ]);

    function updateView( m ) {
        model.flattenedResponse.forEach(function(item) {
            item.selected = item.id in model.selectedIds;
        });
        view.update( m || model );
    }
    model.inputRef = input.ref;
    model.flattenedResponse = [];
    flatten(model.flattenedResponse, '__root__', model.serverResponse, 0);
    console.log(model.flattenedResponse);
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