import { writable } from 'svelte/store';

export function writableSet() {
  const store = writable(new Set());

  const wrap = (method) => {
    return (...args) => {
      let output;
      store.update((value) => {
        output = value[method](...args);
        return value;
      });
      return output;
    };
  };
  return {
    ...store,
    add: wrap('add'),
    delete: wrap('delete'),
  };
}
