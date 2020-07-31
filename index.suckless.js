function h( tag, props, children ) {
    return {
        children: children,
        puns: [],
        ref: document.createElement( tag )
    };
}

function update( h, model ) {
    
}

var data = {
    h: {
        ev: {},
        value: {}
    },
    hIf: {},
    hFor: {}
};

var out = {
    children: [],
    puns: [],
    
}