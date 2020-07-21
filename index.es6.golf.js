(w => {
    'use strict';
    const doc = document,
    appendCh = 'appendChild',
    S = 'setAttribute',
    CREATETXT = 'createTextNode';
    const h = (tag,props,children) => {
        const root = doc.createElement(tag),
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
                let node = doc.createAttribute(name);
                puns.push({f: value, n: node});
                root[S + 'Node'](node);
                continue;
            }
            root[S](name,value);
        }
        
        const t = typeof children;
        if (t === 'string')
            root[appendCh](doc[CREATETXT](children));
        else if (t === 'function')
            puns.push({
                f: children,
                n: root[appendCh](doc[CREATETXT](''))
            });
        else if (t === 'object')
            children.forEach(ch => root[appendCh](ch.ref));

        const res = model => {
            puns.forEach(pun => {
                const node = pun.n,
                newVal = pun.f(model);

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
                parent.ref[appendCh]( child.ref );
                appended = true;
            }
        };
        res.ref = parent.ref;
        return res;
    };

    const hFor =  (parent, arrFn, childFactory) => {
        const old = [],
        children = [],
        res = model => {
            parent(model);
            const arr = arrFn(model);
            arr.forEach((item,i) => {
                if (old[i] === item)
                    return;
                
                const submodel = {
                    index: i,
                    item: item,
                    parent: model
                };
                if (children[i])
                    return children[i](submodel);
                
                const child = childFactory();
                child(submodel);
                children.push(child);
                parent.ref[appendCh](child.ref);
            });
        };

        res.ref = parent.ref;
        return res;
    };

    if (w) {
        w.h=h;w.hIf=hIf;w.hFor=hFor;
    }
    return {h,hIf,hFor};
})(window)