function Element( tagName, props, children ) {
    var _ = this;
    _.puns     = [];
    _.ref      = document.createElement( tagName );
    _.children = children;
    
    for ( var attr in props )
        _.setAttribute( attr, props[ attr ] );

    switch ( typeof children ) {
        case "string":
            _.ref.appendChild( document.createTextNode( children ) );
            break;
        case "function":
            var txt = document.createTextNode('');
            _.ref.appendChild( txt );
            _.puns.push({ fn: children, node: txt });
            break;
        case "object": // array
            var N = children.length;
            for ( var i = 0; i < N; i++ )
                _.ref.appendChild( children[ i ].ref );
    }
}

Element.prototype = {
    setAttribute: function( attr, value ) {
        var _ = this;
        if ( attr === "ev" ) {
            for ( var evName in value )
                _.ref.addEventListener( evName, value[ evName ] );
            return;
        }
        
        if ( typeof value === "function" ) {
            var node = document.createAttribute( attr );
    
            _.puns.push({
                fn:   value,
                node: node
            });
            
            _.ref.setAttributeNode( node );

            return;
        }
    
        _.ref.setAttribute( attr, value );
    },
    update: function( model ) {
        var _ = this;
        _.puns.forEach( function( pun ) {
            var node = pun.node,
            newVal =  pun.fn( model );
        
            if ( pun.old === newVal )
                return;
    
            if ( typeof node === "object" ) {
                if ( _.ref.tagName === "INPUT"
                    && node.name === "value"
                    && _.ref.value !== newVal )
                    _.ref.value = newVal;
                else
                    node.nodeValue = newVal;
            } else {
                _.ref.setAttribute( node, newVal );
            }
    
            pun.old = newVal;
        });

        if ( typeof _.children === "object" )
            for ( var i in _.children )
                _.children[ i ].update( model )
    }
};

function CombinatorIf( parent, cond, child ) {
    var _ = this;
    _.parent = parent;
    _.appended = false;
    _.ref = parent.ref;
    _.cond = cond;
    _.child = child;
    _.ref = parent.ref;
}

CombinatorIf.prototype.update = function( model ) {
    var _ = this,
    child = _.child,
    parent = _.parent,
    res = _.cond( model );

    parent.update( model );
    
    if ( res )
        child.update( model );

    if ( _.appended && !res ) {
        parent.ref.removeChild( child.ref );
        _.appended = false;
    } else if ( res ) {
        parent.ref.appendChild( child.ref );
        _.appended = true;
    }
};

function CombinatorFor( parent, arrFn, childFactory ) {
    var _ = this;
    _.old = [];
    _.children = [];
    _.parent = parent;
    _.arrFn = arrFn;
    _.childFactory = childFactory;
    _.ref = parent.ref;
}

CombinatorFor.prototype.update = function( model ) {
    var _ = this;
    _.parent.update( model );
    
    var arr = _.arrFn( model ),
        child,
        item,
        N = arr.length;
    for ( var i = 0; i < N; i++ ) {
        item = arr[ i ];
        // TODO: deepcompare
        if ( _.old[ i ] === item ) 
            continue;
        
        if ( _.children[ i ] ) {
            _.children[ i ].update({ index: i, item: item });
            continue;
        }
        
        child = _.childFactory();
        child.update({ index: i, item: item });
        _.children.push( child );
        _.parent.ref.appendChild( child.ref );
    }

    // odrizneme precuhujici prvky
    var oN = _.old.length,
        newN = arr.length;
    if ( oN > newN ) {
        i = oN - newN;
        _.children.splice( newN );
        while ( i-- )
            _.parent.ref.removeChild( _.parent.ref.children[ newN ] );
    }

    _.old = arr.slice();
};

function h( tagName, props, children ) {
    return new Element( tagName, props, children );
}

function hIf( parent, cond, child ) {
    return new CombinatorIf( parent, cond, child );
}

function hFor( parent, arrFn, childFactory ) {
    return new CombinatorFor( parent, arrFn, childFactory );
}