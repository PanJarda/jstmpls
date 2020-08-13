(function ( window ) {
    'use strict';

    function foreach( obj, callback, self ) {
        if ( Object.prototype.toString.call( obj ) === '[object Array]') {
            var N = obj.length;
            for ( var i = 0; i < N; i++ ) {
                callback( self, obj[ i ], i, obj );
            }
        } else {
            for (var key in obj) {
                if ( !obj.hasOwnProperty( key ) )
                    continue;
                var value = obj[ key ];
                callback( self, value, key, obj );
            }
        }
    }

    window.foreach = foreach;
})( window );

(function ( window, foreach ) {
    'use strict';

    var childrenByType = (function() {
        function childrenAsString( self ) {
            var txt = document.createTextNode( self.children );
            self.ref.appendChild( txt );
        }
    
        function childrenAsFunction( self ) {
            var txt = document.createTextNode( '' );
            self.ref.appendChild( txt );
            self.puns.push({
                fn: self.children,
                node: txt
            });
        }

        var childrenAsArray = (function() {
            function appendChild( self, child ) {
                self.ref.appendChild( child.ref );
            }

            return function( self ) {
                foreach( self.children, appendChild, self );
            };
        })();
    
        return {
            string:   childrenAsString,
            function: childrenAsFunction,
            object:   childrenAsArray
        };
    })();

    var setAttribute = (function() {
        function addEventListener( self, callback, evName ) {
            self.ref.addEventListener( evName, callback, false );
        }
        
        return function( self, value, attr ) {
            if ( attr === 'ev' ) {
                foreach( value, addEventListener, self );
                return;
            }

            if ( typeof value === 'function' ) {
                var node = document.createAttribute( attr );
                self.puns.push({
                    fn: value,
                    node: node
                });
                self.ref.setAttributeNode( node );
                return;
            }

            self.ref.setAttribute( attr, value );
        };
    })();

    function updatePun( self, pun ) {
        var val = pun.fn( self.model );

        if ( pun.old === val )
            return;

        if ( typeof pun.node === 'object' ) {
            if ( self.ref.tagName === "INPUT") {
                if (pun.node.name === "value" && self.ref.value !== val ) {
                    self.ref.value = val;
                } else if (pun.node.name === 'checked' && self.ref.checked !== val) {
                    self.ref.checked = val;
                } else if (pun.node.name === 'id' && self.ref.id !== val) {
                    self.ref.id = val;
                } else {
                    pun.node.nodeValue = val;
                }
            } else {
                pun.node.nodeValue = val;
            }
        } else {
            self.ref.setAttribute( pun.node, val );
        }

        pun.old = val;
    }

    function updateChild( self, child ) {
        child.update( self.model );
    }

    function updateItem( self, item, i ) {
        if ( self.old[ i ] === item )
            return;

        var model = {
            index: i,
            item: item,
            parent: self.model
        };
        
        if ( self.children[ i ] ) {
            self.children[ i ].update( model );
            return;
        }

        var child = self.factory();
        child.update( model );
        self.children.push( child );
        self.parent.ref.appendChild( child.ref );
    }

    function H( tagName, attrs, children ) {
        this.puns     = [];
        this.ref      = document.createElement( tagName );
        this.children = children;
    
        foreach( attrs, setAttribute, this );

        var appendChildren = childrenByType[ typeof children ];
        if ( appendChildren )
            appendChildren( this );
    }

    H.prototype.update = function ( model ) {
        foreach( this.puns, updatePun, {
            model: model,
            ref: this.ref
        });

        if (typeof this.children === 'object')
            foreach( this.children, updateChild, { model: model } );
    };

    function HIf( parent, cond, child ) {
        this.parent   = parent;
        this.appended = false;
        this.ref      = parent.ref;
        this.cond     = cond;
        this.child    = child;
    }

    HIf.prototype.update = function ( model ) {
        this.parent.update( model );

        var res = this.cond( model );

        if ( res )
            this.child.update( model );

        if ( this.appended && !res ) {
            this.parent.ref.removeChild( this.child.ref );
            this.appended = false;
        } else if ( res ) {
            this.parent.ref.appendChild( this.child.ref );
            this.appended = true;
        }
    };

    function HFor( parent, arrFn, factory ) {
        this.old      = [];
        this.children = [];
        this.parent   = parent;
        this.arrFn    = arrFn;
        this.factory  = factory;
        this.ref      = parent.ref;
    }

    function removeChild( self, child ) {
        self.parent.ref.removeChild( child.ref );
    }

    HFor.prototype.update = function ( model ) {
        this.parent.update( model );

        var arr = this.arrFn( model );
        
        foreach( arr, updateItem, {
            model: model,
            children: this.children,
            old: this.old,
            parent: this.parent,
            factory: this.factory
        });

        // odrizneme precuhujici prvky
        var oN = this.old.length,
        newN = arr.length;
        if (oN > newN) {
            var i = oN - newN;
            var childrenToRemove = this.children.slice( newN, oN );
            this.children.splice( newN );
            foreach( childrenToRemove, removeChild, this );
        }
        this.old = arr.slice();
    };

    function h( tagName, attrs, children ) {
        return new H( tagName, attrs, children );
    }

    function hIf( tagName, attrs, children ) {
        return new HIf( tagName, attrs, children );
    }

    function hFor( parent, arrFn, factory ) {
        return new HFor( parent, arrFn, factory );
    }

    if ( window ) {
        window.h = h;
        window.hIf = hIf;
        window.hFor = hFor;
    }

    return {
        h: h,
        hIf: hIf,
        hFor: hFor
    };

})( window, window.foreach );