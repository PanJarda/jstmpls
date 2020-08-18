function queryTree(query, callback) {
    setTimeout(
        callback,
        500,
        {
            name: 'world',
            expanded: false,
            children: {
                '232': {
                    name: 'FFF',
                    expanded: false,
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
                    expanded: false,
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

function ajaxGetChildren(id, callback) {
    setTimeout(
        callback,
        500,
        id,
        {
            '1111': {
                name: '111',
            },
            '2222': {
                name: '222',
            },
            '3333': {
                name: '333',
            }
        }
    )
}

function flatten(res, id, node, depth) {
    res.push({
        name: node.name,
        expanded: 'expanded' in node
                    ? node.expanded
                        ? 1
                        : -1
                    : 0,
        id: id,
        depth: depth
    });
    if (!node.children)
        return;
    Object.keys(node.children).forEach(function(id) {
        flatten(res, id, node.children[id], depth + 1);
    });
}

function findNodeById(res,node, id) {
    if (node.id === id) {
        res.node = node;
        return true;
    }

    if (!('children' in node))
        return false;

    var index = Object.keys(node.children).indexOf(id);
    if (index > -1) {
        res.node = node.children[id];
        return true;
    } else {
        return Object.keys(node.children).some(function(key) {
            return findNodeById(res, node.children[key], id);
        });
    }
}

function main() {
    var init = {
        inputRef: null,
        loading: false,
        selected: [],
        selectedIds: {},
        serverResponse: {
            id: '__root__',
            name: 'world',
            expanded: false,
            children: {
                '12393030': {
                    name: 'Olomoucky kraj',
                    expanded: false,
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
                    expanded: false,
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
                expanded: false,
                loading: false,
                depth: 0
            },
            {
                id: '123123',
                name: 'Olomouc',
                expanded: false,
                loading: false,
                depth: 1
            },
            {
                id: '1232131',
                name: 'Jesenik',
                expanded: false,
                loading: false,
                depth: 1
            }
        ]
    };

    var model = init;
 
    var _ = false;
    var ipnut, result, mirror;

    function updateTree(response) {
        model.serverResponse = response;
        model.flattenedResponse = [];
        flatten(model.flattenedResponse, '__root__', response, 0);
        result.ref.style.display = 'block';
        model.loading = false;
        updateView();
    }

    function resizeInput(query) {
        mirror.ref.innerText = query;
        input.ref.style.width = mirror.ref.clientWidth + 1 + 'px';
    }
 
    function handleInput(e) {
        var query = e.target.value;
        resizeInput(query);
        if (query.length > 3) {
            queryTree(e.target.value, updateTree);
            model.loading = true;
            // TODO: tohle nejak nefunguje
            model.flattenedResponse = [];
            updateView();
        }
    }

    function handleClear(e) {
        model.inputRef.value = '';
        resizeInput('');
        model.flattenedResponse = [];
        hideResult();
        updateView();
        e.stopPropagation();
    }

    function showResult() {
        var query = input.ref.value;
        if (query.length > 3) {
            result.ref.style.display = 'block';
            console.log(result.ref.style.display);
        }
    }

    function hideResult() {
        result.ref.style.display = 'none';
        handleClear();
    }

    function handleTagToggle(e) {
        var checked = e.target.checked,
            id = e.target.getAttribute('data-id'),
            name = e.target.getAttribute('data-name');
        if (checked) {
            model.selected.push({
                id: id,
                name: name
            });
            model.selectedIds[id] = true;
        } else {
            model.selected = model.selected.filter(function(item) {
                return item.id !== id;
            });
            delete model.selectedIds[id];
        }
        input.ref.focus();
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

    function mergeExpandedSubtree(id, children) {
        var res = {};
        if(!findNodeById(res, model.serverResponse, id))
            return;

        assignDeep(res.node.children, children);

        res.node.expanded = true;
        res.node.loading = false;
        model.flattenedResponse = [];
        // TODO duplicate code
        flatten(model.flattenedResponse, '__root__', model.serverResponse, 0);
        updateView();
    }

    function handleExpandSubtree(e) {
        var expand = e.target.checked;
        var id = e.target.getAttribute('data-id');
        if (expand) {
            ajaxGetChildren(id, mergeExpandedSubtree);
            model.flattenedResponse.some(function(item) {
                if (item.id === id) {
                    item.loading = true;
                    return true;
                } else {
                    return false;
                }
            });
            updateView();
        } else {
            var res = {};
            findNodeById(res, model.serverResponse, id);
            res.node.children = {};
            res.node.expanded = false;
            model.flattenedResponse = [];
            // TODO duplicate code
            flatten(model.flattenedResponse, '__root__', model.serverResponse, 0);
            updateView();
        }
        // ajaxem se dotazu na subtree;
    }

    function handleInputFocus(e) {
        input.ref.focus();
        e.preventDefault();
        e.stopPropagation();
    }

    function get(key) {
        return function(model) {
            return model[key];
        };
    }

    var view = h('div', {'class': 'treetagselect'}, [
        mirror = h('div', {'class': 'treetagselect_hiddenmirror'}),
        h('div',
            {
                'class': 'treetagselect_inputcontainer',
                ev: {
                    mousedown: handleInputFocus
                }
            }, [
            hFor(
                h('ul', {'class': 'treetagselect_selectedtags'}),
                get('selected'),
                function() {
                    return h('li', {'class': 'treetagselect_tag'}, [
                        h('span', _, function(model) { return model.item.name; }),
                        h('button', {'class': 'treetagselect_tag_button', 'data-id': function(model) {return model.item.id}, ev: {click: handleRemoveTag}}, 'X')
                    ]);
                }
            ),
            input = h('input', {
                'class': 'treetagselect_input',
                tabindex: '0',
                ev: {
                    input: handleInput,
                    focus: showResult
                }
            })
        ]),
        hIf(h('div'), function(model) {return model.loading}, h('span', _, 'loading')),
        hFor(
            result = h('ul', {'class': 'treetagselect_results'}),
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
                    hIf(h('span'),
                        function(model) {
                            return model.item.expanded !== 0
                        },
                        h('span', _, [
                            h('input', {
                                type: 'checkbox',
                                'data-id': function(model) {return model.item.id},
                                'checked': function(model) {return model.item.expanded === 1},
                                ev: {
                                    change: handleExpandSubtree
                                }
                            }),
                            h('label', _, function(model) {return model.item.loading ? 'loading' : ''})
                        ])
                    ),
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

    result.ref.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });
    window.addEventListener('mousedown', hideResult)

    function updateView( m ) {
        model.flattenedResponse.forEach(function(item) {
            item.selected = item.id in model.selectedIds;
        });
        view.update( m || model );
    }
    model.inputRef = input.ref;
    model.flattenedResponse = [];
    flatten(model.flattenedResponse, '__root__', model.serverResponse, 0);
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