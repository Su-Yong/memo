import { HocuspocusProvider } from '@hocuspocus/provider';
import { useAtomValue, useAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ACCESS_TOKEN } from '../store/auth';
import { MEMO_PROVIDER_MAP } from '../store/memo';

export const useHocuspocusProvider = (id: string): [HocuspocusProvider, boolean] => {
  const token = useAtomValue(ACCESS_TOKEN);
  const [memoProviders, setMemoProviders] = useAtom(MEMO_PROVIDER_MAP);

  const isNewProvider = useRef(false);
  const provider = useMemo(() => {
    let result = memoProviders.get(id);
    if (result) return result;

    isNewProvider.current = true;
    return new HocuspocusProvider({
      url: `wss://local.suyong.me/ws/memos/${id}`,
      token,
      name: id,
    });
  }, [memoProviders, id, token]);

  const [isLoading, setLoading] = useState(isNewProvider.current);

  useEffect(() => {
    if (!isNewProvider.current) return;
    if (memoProviders.has(id)) return;

    const newMap = new Map<string, HocuspocusProvider>(memoProviders);
    newMap.set(id, provider);

    setMemoProviders(newMap);
    isNewProvider.current = false;
  }, [id, token, memoProviders, provider]);

  useEffect(() => {
    const onEndLoad = () => setLoading(false);
    provider.on('sync', onEndLoad);

    return () => { provider.off('sync', onEndLoad); };
  }, [provider, id]);

  return [provider, isLoading];
};
