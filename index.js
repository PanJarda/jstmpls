function append( child ) {
    if ( child.ref )
        this.root.appendChild( child.ref );
}

function updatePun( pair ) {
    var txt = pair[ 1 ],
        fn  = pair[ 0 ],
        oldVal = pair[ 2 ],
        newVal =  fn( this.model );
    // input nema cenu cachovat
    if (this.root.tagName === "INPUT"
        && typeof txt === "object"
        && txt.name === "value"
        && this.root.value !== newVal) {
            this.root.value = newVal;
    } else if ( oldVal !== newVal ) {
        if ( typeof txt === "object" ) {
            txt.nodeValue = newVal;
        } else {
            this.root.setAttribute( txt, newVal );
        }
        pair[ 2 ] = newVal;
    }
}

function passModel( child ) {
    child( this.model );
}

function attachEvHandlers( evName ) {
    this.root.addEventListener( evName, this.props.ev[ evName ] );
}

function setAttribute( attr ) {
    if ( attr === "ev" ) {
        var evNames = Object.keys( this.props.ev );
        evNames.forEach( attachEvHandlers, this );
    } else if ( typeof this.props[ attr ] === "function" ) {
        //if ( attr === "value" && this.root.tagName === "INPUT" ) {
         //   this.root.value = "";
        //}
        var node = document.createAttribute( attr );
        this.puns.push([ this.props[ attr ], node, null ]);
        this.root.setAttributeNode( node );
    } else {
        this.root.setAttribute( attr, this.props[ attr ] );
    }
}

function h( tagName, props, children ) {
    var root = document.createElement( tagName ),
        puns = [];

    if ( props ) {
        var attrs = Object.keys( props );
        attrs.forEach( setAttribute, { root: root, props: props, puns: puns });
    }

    if ( Array.isArray( children ) ) {
        children.forEach( append, { root: root });
    } else if ( typeof children === "function" ) {
        var txt = document.createTextNode("");
        root.appendChild( txt );
        puns.push( [children, txt, null] );
    } else if ( children ) {
        root.appendChild( document.createTextNode( children ) );
    }

    var res = function( model ) {
        puns.forEach( updatePun, { model: model, root: root });
        Array.isArray( children )
            && children.forEach( passModel, { model: model });
    };

    res.ref = root;

    return res;
}

function hIf( parent, cond, child ) {
    var appended = false;
    var res = function( model ) {
        parent( model );
        child( model );
        var res = cond( model );
        if ( appended ) {
            if ( !res ) {
                parent.ref.removeChild( child.ref );
                appended = false;
            }
        } else {
            if ( res ) {
                parent.ref.appendChild( child.ref );
                appended = true;
            }
        }
    };
    res.ref = parent.ref;
    return res;
}

function hFor( parent, arrFn, tagName, props, itemChildren ) {
    var old = [];
    var children = [];
    var res = function( model ) {
        parent( model );
        var arr = arrFn( model );
        var child;
        arr.forEach(function(item, i) {
            // TODO: deepcompare
            if ( old[ i ] !== item ) {
                if (children[ i ]) {
                    children[ i ]({ index: i, item: item });
                } else {
                    child = h(tagName, props,
                        typeof itemChildren === "function"
                            ? itemChildren()
                            : itemChildren );
                    child({ index: i, item: item });
                    children.push( child );
                    parent.ref.appendChild( child.ref );
                }
            }
        });
        var oN = old.length,
            newN = arr.length;
        console.log(oN, newN);
        if ( oN > newN ) {
            var i = oN - newN;
            children.splice(newN);
            while ( i-- ) {
                console.log(parent.ref.children[ newN ])
                parent.ref.removeChild(parent.ref.children[ newN ]);
            }
        }
        old = arr.slice();
    };
    res.ref = parent.ref;
    return res;
}

var _;

function _prop( key ) {
    return function( obj ) {
        return obj[ key ];
    }
}

function _Id( item ) {
    return item;
}