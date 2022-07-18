import { writable } from 'svelte/store';

export function writableSet(value = new Set()) {
  const store = writable(value);

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
