export default function promCreator() {
  let resolve: (value?: {} | PromiseLike<{}>) => void;
  let reject: (value?: {} | PromiseLike<{}>) => void;

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