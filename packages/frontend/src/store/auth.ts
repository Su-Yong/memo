import { atomWithStorage } from 'jotai/utils'
import { atomsWithQuery } from 'jotai-tanstack-query'
import { fetchUser } from '../api/user';

export const ACCESS_TOKEN = atomWithStorage<string>('access-token', '');
export const [CLIENT_USER] = atomsWithQuery(
  (get) => ({
    queryKey: ['client-user', get(ACCESS_TOKEN)],
    queryFn: async ({ queryKey: [, token] }) => {
      console.log('queryUser!', token);
      if (token) return fetchUser();

      return null;
    },
  }),
);
