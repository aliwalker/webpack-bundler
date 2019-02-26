"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promCreator() {
    let resolve;
    let reject;
    let promise = new Promise((resolveFn, rejectFn) => {
        resolve = resolveFn;
        reject = rejectFn;
    });
    return {
        promise,
        resolve,
        reject,
    };
}
exports.default = promCreator;
//# sourceMappingURL=promise.js.map