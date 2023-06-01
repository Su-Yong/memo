import { atomWithStorage } from 'jotai/utils'
import { atomsWithQuery } from 'jotai-tanstack-query'
import { fetchUser } from '../api/user';
import { FastAverageColor } from 'fast-average-color';
import { getRandomColor } from '../utils/colors';
import Color from 'color';
import { atomWithCache } from 'jotai-cache';
import { loadableWithDefault } from '../utils/loadableWithDefault';

export const ACCESS_TOKEN = atomWithStorage<string>('access-token', '');
export const [CLIENT_USER] = atomsWithQuery(
  (get) => ({
    queryKey: ['client-user', get(ACCESS_TOKEN)],
    queryFn: async ({ queryKey: [, token] }) => {
      if (token) return fetchUser();

      return null;
    },
  }),
);

const DEFAULT_COLOR = getRandomColor();
export const CLIENT_COLOR = loadableWithDefault(atomWithCache(async (get) => {
  let color = DEFAULT_COLOR;
  const client = await get(CLIENT_USER);

  if (client?.profile) {
    try {
      const fac = new FastAverageColor();
      const target = await fac.getColorAsync(client.profile);

      color = target.hex;
    } catch {}
  }

  const c = Color(color);
  return [color, c.isLight()] as const;
}));
