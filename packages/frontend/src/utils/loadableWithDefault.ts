import { Atom, atom } from 'jotai';
import { loadable } from 'jotai/utils';

interface LoadableWithDefault {
  <Value>(anAtom: Atom<Value>): Atom<Awaited<Value> | undefined>;
  <Value, Default>(anAtom: Atom<Value>, defaultValue: Default): Atom<Awaited<Value> | Default>;
}

export const loadableWithDefault = ((anAtom: Atom<unknown>, defaultValue = undefined) => {
  const loadableAtom = loadable(anAtom);

  return atom((get) => {
    const now = get(loadableAtom);

    if (now.state === 'hasData') return now.data;
    return defaultValue;
  });
}) as LoadableWithDefault;
