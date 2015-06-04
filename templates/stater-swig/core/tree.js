/**
 * Object Tree
 * Object path provide ability to get/set object using dot-path.
 * E.g: a = path.get('parent.child.super');
 */

/* Object Tree Constructor */
var Tree = function () {
    return this;
}

/* Object Tree Prototypes */
Tree.prototype = {
    /* Object Getter */
    get : function (path) {
        var arrTree, curTree = this, missing = false;

        if ( 'string' === typeof path ) {
            arrTree = path.split('.');

            arrTree.forEach(function (pn, i) {
                if ( curTree[ pn ] ) {
                    curTree = curTree[ pn ];
                }
                else {
                    missing = true;
                }
            });
        }

        if ( missing ) return undefined;

        return curTree;
    },

    /* Object Setter */
    set : function (path, value) {
        var arrTree, curTree = this;

        if ( 'string' == typeof path ) {
            arrTree = path.split('.');

            arrTree.forEach(function (pn, i) {
                if ( i === (arrTree.length - 1) ) {
                    curTree[ pn ] = value;
                }
                else {
                    if ( curTree[ pn ] ) {
                        curTree = curTree[ pn ];
                    }
                    else {
                        curTree[ pn ] = {};
                        curTree = curTree[ pn ];
                    }
                }
            });
        }

        return curTree;
    }
}

Object.defineProperty(Tree.prototype, 'get', {
    enumerable   : false,
    writable     : false,
    configurable : false
});
Object.defineProperty(Tree.prototype, 'set', {
    enumerable   : false,
    writable     : false,
    configurable : false
});

/* Exporting Object Tree */
module.exports = Tree;