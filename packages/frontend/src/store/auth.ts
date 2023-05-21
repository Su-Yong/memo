import { atomWithStorage } from 'jotai/utils'

export const accessToken = atomWithStorage<string>('access-token', '');