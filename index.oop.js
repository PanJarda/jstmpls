function Element( tagName, props, children ) {
    this.puns     = [];
    this.ref      = document.createElement( tagName );
    this.children = children;
    
    for ( var attr in props )
        this.setAttribute( attr, props[ attr ] );

    switch ( typeof children ) {
        case "string":
            this.ref.appendChild( document.createTextNode( children ) );
            break;
        case "function":
            var txt = document.createTextNode('');
            this.ref.appendChild( txt );
            this.puns.push({ fn: children, node: txt });
            break;
        case "object": // array
            var N = children.length;
            for ( var i = 0; i < N; i++ )
                this.ref.appendChild( children[ i ].ref );
    }
}

Element.prototype = {
    setAttribute: function( attr, value ) {
        if ( attr === "ev" ) {
            var evNames = Object.keys( value );
            evNames.forEach( function( evName ) {
                this.ref.addEventListener( evName, value[ evName ] );
            });
            return;
        }
        
        if ( typeof value === "function" ) {
            var node = document.createAttribute( attr );
    
            this.puns.push({
                fn:   value,
                node: node
            });
            
            this.ref.setAttributeNode( node );

            return;
        }
    
        this.root.setAttribute( attr, value );
    },
    update: function( model ) {
        this.puns.forEach( function( pun ) {
            var node = pun.node,
            newVal =  pun.fn( this.model );
        
            if ( pun.old === newVal )
                return;
    
            if ( typeof node === "object" ) {
                if ( this.ref.tagName === "INPUT"
                    && node.name === "value"
                    && this.ref.value !== newVal )
                    this.ref.value = newVal;
                else
                    node.nodeValue = newVal;
            } else {
                this.ref.setAttribute( node, newVal );
            }
    
            pun.old = newVal;
        });

        if ( typeof this.children === "object" )
            for ( var i in this.children )
                this.children[ i ].update( model )
    }
};

function CombinatorIf() {

}

CombinatorIf.prototype = {
    update: function() {}
};

function CombinatorFor() {

}

CombinatorFor.prototype = {
    update: function() {}
}

function h( tagName, props, children ) {
    return new Element( tagName, props, children );
}

function hIf( parent, cond, child ) {
    return new CombinatorIf( parent, cond, child );
}

function hFor( parent, arrFn, tagName, props, itemChildren ) {
    return new CombinatorFor( parent, arrFn, tagName, props, itemChildren );
}