export function createStore(initial = {}) {
  const subs = new Set();
  const state = new Proxy(initial, {
    get(target, prop) {
      if (prop === "subscribe") {
        return (fn) => {
          subs.add(fn);
          return () => subs.delete(fn);
        };
      }
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      subs.forEach((fn) => fn(prop, value, target));
      return true;
    },
  });
  return state;
}
