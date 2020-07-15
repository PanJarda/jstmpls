function updatePun( pun ) {
    var node = pun.node,
        newVal =  pun.fn( this.model );
    
    if ( pun.old === newVal )
        return;

    if ( typeof node === "object" ) {
        if ( this.root.tagName === "INPUT"
            && node.name === "value"
            && this.root.value !== newVal )
            this.root.value = newVal;
        else
            node.nodeValue = newVal;
    } else {
        this.root.setAttribute( node, newVal );
    }

    pun.old = newVal;
}

function attachEvHandlers( evName ) {
    this.root.addEventListener( evName, this.props.ev[ evName ] );
}

function setAttribute( attr ) {
    if ( attr === "ev" ) {
        var evNames = Object.keys( this.props.ev );
        evNames.forEach( attachEvHandlers, this );
        return;
    }
    
    if ( typeof this.props[ attr ] === "function" ) {
        var node = document.createAttribute( attr );

        this.puns.push({
            fn:   this.props[ attr ],
            node: node
        });
        
        this.root.setAttributeNode( node );
        return;
    }

    this.root.setAttribute( attr, this.props[ attr ] );
}

// TODO: reduce complexity by narrowing api
// TODO: prepsat koncept do OOP protoze tady se vytvari furt znova ta res funkce
function h( tagName, props, children ) {
    var root = document.createElement( tagName ),
        puns = [];

    if ( props )
        Object.keys( props )
            .forEach( setAttribute, { root: root, props: props, puns: puns });

    switch ( typeof children ) {
        case "string":
            root.appendChild( document.createTextNode( children ) );
            break;
        case "function":
            var txt = document.createTextNode('');
            root.appendChild( txt );
            puns.push( { fn: children, node: txt } );
            break;
        case "object": // array
            var N = children.length;
            for ( var i = 0; i < N; i++ )
                root.appendChild( children[ i ].ref );
    }
   
    var res = function( model ) {
        puns.forEach( updatePun, { model: model, root: root });
        
        if ( typeof children === 'object' )
            for ( var i in children )
                children[ i ]( model );
    };

    res.ref = root;

    return res;
}

function hIf( parent, cond, child ) {
    var appended = false;

    var res = function( model ) {
        parent( model );
      
        var res = cond( model );
      
        if ( res )
            child( model );

        if ( appended && !res ) {
            parent.ref.removeChild( child.ref );
            appended = false;
        } else if ( res ) {
            parent.ref.appendChild( child.ref );
            appended = true;
        }
    };

    res.ref = parent.ref;
    
    return res;
}

function hFor( parent, arrFn, childFactory ) {
    var old = [],
    children = [],
    res = function( model ) {
        parent( model );
        var arr = arrFn( model ),
            child,
            item,
            N = arr.length;
        for ( var i = 0; i < N; i++ ) {
            item = arr[ i ];
            // TODO: deepcompare
            if ( old[ i ] === item ) 
                continue;
            
            if ( children[ i ] ) {
                children[ i ]({ index: i, item: item });
                continue;
            }
            
            child = childFactory();
            child({ index: i, item: item });
            children.push( child );
            parent.ref.appendChild( child.ref );
        }

        // odrizneme precuhujici prvky
        var oN = old.length,
            newN = arr.length;
        if ( oN > newN ) {
            i = oN - newN;
            children.splice( newN );
            while ( i-- )
                parent.ref.removeChild( parent.ref.children[ newN ] );
        }

        old = arr.slice();
    };
    
    res.ref = parent.ref;

    return res;
}