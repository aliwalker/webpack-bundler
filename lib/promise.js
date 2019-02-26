"use strict";
exports.__esModule = true;
function promCreator() {
    var resolve;
    var reject;
    var promise = new Promise(function (resolveFn, rejectFn) {
        resolve = resolveFn;
        reject = rejectFn;
    });
    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    };
}
exports["default"] = promCreator;
//# sourceMappingURL=promise.js.map