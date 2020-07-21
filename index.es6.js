(w => {
    'use strict';
    const h = (tag,props,children) => {
        const root = document.createElement(tag),
        puns = [];

        // setting props
        for (let name in props) {
            let value = props[name];
            if (name === 'ev') {
                for (let evName in value)
                    root.addEventListener(evName, value[evName]);
                continue;
            }
            if (typeof value === 'function') {
                let node = document.createAttribute(name);
                puns.push({fn: value, node: node});
                root.setAttributeNode(node);
                continue;
            }
            root.setAttribute(name,value);
        }
        
        const t = typeof children;
        if (t === 'string')
            root.appendChild(document.createTextNode(children));
        else if (t === 'function')
            puns.push({
                fn: children,
                node: root.appendChild(document.createTextNode(''))
            });
        else if (t === 'object')
            children.forEach(ch => root.appendChild(ch.ref));

        const res = model => {
            puns.forEach(pun => {
                const node = pun.node,
                newVal = pun.fn(model);

                if (pun.old === newVal)
                    return;
                
                if (typeof node === "object") {
                    if (root.tagName === "INPUT" &&
                        node.name === "value" &&
                        root.value !== newVal)
                        root.value = newVal;
                    else
                        node.nodeValue = newVal;
                } else {
                    h.ref[S](node, newVal);
                }
    
                pun.old = newVal;
            });
            if (Array.isArray(children))
                children.forEach(ch => ch(model));
        };
        res.ref = root;
        res.update = res;
        return res;
    };

    const hIf = (parent,cond,child) => {
        let appended = false;
        const res = model => {
            parent(model);
            const res = cond(model);

            if (res) child(model);

            if ( appended && !res ) {
                parent.ref.removeChild( child.ref );
                appended = false;
            } else if ( res ) {
                parent.ref.appendChild( child.ref );
                appended = true;
            }
        };
        res.ref = parent.ref;
        res.update = res;
        return res;
    };

    const hFor =  (parent, arrFn, childFactory) => {
        let old = [],
        children = [],
        res = model => {
            parent(model);
            const arr = arrFn(model);
            arr.forEach((item,i) => {
                if (old[i] === item)
                    return;
                if (children[i])
                    return children[i]({
                        index: i,
                        item: item,
                        parent: model
                    });
                
                const child = childFactory();
                child({ index: i, item, parent: model });
                children.push(child);
                parent.ref.appendChild(child.ref);
            });
            // odrizneme precuhujici prvky
            const oN = old.length,
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
        res.update = res;
        return res;
    };

    if (w) {
        w.h=h;w.hIf=hIf;w.hFor=hFor;
    }
    return {h,hIf,hFor};
})(window)