/**
 * TODO: zkusit to prepsat do vice funkcionalniho tvaru
 * TODO: zkusit to prepsat do DbC a otestovat s JSDOM
 */
(function (window) {
    "use strict";

    var doc = document,
    proto = 'prototype',
    UPDATE = 'update',
    appendCh = 'appendChild',
    S = 'setAttribute',
    len = 'length',
    CHLDRN = 'children',
    PARENT = 'parent';

    function H(tagName, props, children) {
        var h = this, attr, txt, N,i,t;
        h.puns = [];
        h.ref = doc.createElement(tagName);
        h[CHLDRN] = children;

        for (attr in props)
            h.s(attr, props[attr]);

        switch (typeof children) {
            case 'string':
                h.ref[appendCh](doc.createTextNode(children));
                break;
            case 'function':
                txt = doc.createTextNode('');
                h.ref[appendCh](txt);
                h.puns.push({
                    fn: children,
                    node: txt
                });
                break;
            case 'object':
                N = children[len];
                for (i = 0; i < N; i++)
                    h.ref[appendCh](children[i].ref);
        }

    }

    H[proto].s = function (attr, value) {
        var h = this,
            evName, node;

        if (attr === "ev") {
            for (evName in value)
                h.ref.addEventListener(evName, value[evName], false);
            return;
        }

        if (typeof value === "function") {
            if ( attr === 'checked' ) {
                node = {name: 'checked'};
            } else {
                node = doc.createAttribute(attr);
                h.ref.setAttributeNode(node);
            }

            h.puns.push({
                fn: value,
                node: node
            });

            return;
        }

        h.ref.setAttribute(attr, value);
    };

    H[proto][UPDATE] = function (model) {
        var h = this,
            i = 0,
            N = h.puns[len],
            node, pun, newVal;

        for (i = 0; i < N; i++) {
            pun = h.puns[i];
            node = pun.node;
            newVal = pun.fn(model);

            if (h.ref.tagName === 'INPUT' && node.name === 'checked') {
                pun.old = node.checked;
            }

            if (h.ref.tagName === 'INPUT' && node.name === 'value') {
                pun.old = node.value;
            }

            if (pun.old === newVal) {
                continue;
            }

            if (typeof node === "object") {
                if (h.ref.tagName === "INPUT") {
                    if (node.name === "value" && h.ref.value !== newVal) {
                        h.ref.value = newVal;
                    } else if (node.name === "checked" && h.ref.checked !== newVal ) {
                        h.ref.checked = newVal;
                    } else if ( node.name === "id" && h.ref.id !== newVal) {
                        h.ref.id = newVal;
                    } else {
                        node.nodeValue = newVal;
                    }
                } else {
                    node.nodeValue = newVal;
                }
            } else {
                h.ref.setAttribute(node, newVal);
            }
            pun.old = newVal;
        }

        if (typeof h[CHLDRN] === "object")
            for (i in h[CHLDRN])
                h[CHLDRN][i][UPDATE](model);
    };

    function HIf(parent, cond, child) {
        var h = this;
        h[PARENT] = parent;
        h.appended = false;
        h.ref = parent.ref;
        h.cond = cond;
        h.child = child;
    }

    HIf[proto][UPDATE] = function (model) {
        var h = this,
            res = h.cond(model);

        h[PARENT][UPDATE](model);

        if (res)
            h.child[UPDATE](model);

        if (h.appended && !res) {
            h[PARENT].ref.removeChild(h.child.ref);
            h.appended = false;
        } else if (res) {
            h[PARENT].ref[appendCh](h.child.ref);
            h.appended = true;
        }
    };

    function HFor(parent, arrFn, factory) {
        var h = this;
        h.old = [];
        h[CHLDRN] = [];
        h[PARENT] = parent;
        h.arrFn = arrFn;
        h.factory = factory;
        h.ref = parent.ref;
    }

    HFor[proto][UPDATE] = function (model) {
        var h = this,
        arr = h.arrFn(model),
        child,
        item,
        N = arr[len],
        i, oN, newN;

        h[PARENT][UPDATE](model);
        
        for (i = 0; i < N; i++) {
            item = arr[i];
            // TODO: deepcompare
            if (h.old[i] === item && (typeof item === 'object' ? Object.keys(item).every(function(k) {return h.old[i][k] === item[k]}) : true)) {
                console.log('skipping', item);
                continue;
            }

            if (h[CHLDRN][i]) {
                h[CHLDRN][i][UPDATE]({ index: i, item: item, parent: model });
                continue;
            }

            child = h.factory();
            child[UPDATE]({ index: i, item: item, parent: model });
            h[CHLDRN].push(child);
            h[PARENT].ref[appendCh](child.ref);
        }

        // odrizneme precuhujici prvky
        oN = h.old[len];
        newN = arr[len];
        if (oN > newN) {
            i = oN - newN;
            h[CHLDRN].splice(newN);
            while (i--) {
                h[PARENT].ref.removeChild(h[PARENT].ref[CHLDRN][newN]);
            }
        }

        if (typeof arr[0] === 'object') {
            h.old =  arr.map(function(item) { return assignDeep({}, item) });
        } else {
            h.old = arr.splice();
        }
    };

    function h(tagName, props, children) {
        return new H(tagName, props, children);
    }

    function hIf(parent, cond, child) {
        return new HIf(parent, cond, child);
    }

    function hFor(parent, arrFn, factory) {
        return new HFor(parent, arrFn, factory);
    }

    if (window) {
        window.h = h;
        window.hIf = hIf;
        window.hFor = hFor;
    }

    return {
        h: h,
        hIf: hIf,
        hFor: hFor
    };
})(window);