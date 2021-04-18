import { writable } from "svelte/store";

export function writableSet(value = new Set()) {
  const store = writable(value);

  const wrap = (method) => {
    return (...args) => {
      let ret;
      store.update((value) => {
        ret = value[method](...args);
        return value;
      });
      return ret;
    };
  };
  return {
    ...store,
    add: wrap("add"),
    delete: wrap("delete"),
  };
}
