
// bind polyfill for ie6-8
if( !('bind' in Function.prototype ) ) {
    Function.prototype.bind = function() {
        var fn = this,
        context = arguments[0],
        args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return fn.apply(context, args.concat([].slice.call(arguments)));
        };
    }
}