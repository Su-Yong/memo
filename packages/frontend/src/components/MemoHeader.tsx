import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMemo, updateMemo } from '../api/memo';
import MemoTab from '../containers/MemoTab';
import { useCallback, useEffect, useRef } from 'react';
import { useHocuspocusProvider } from '../hooks/useHocuspocusProvider';
import { useAttachedUsers } from '../hooks/useAttachedUsers';
import Profile from './user/Profile';
import { useInactiveUsers } from '../hooks/useInactiveUsers';
import { cx } from '../utils/className';
import Color from 'color';

export interface MemoHeaderProps {
  id: string;
}
const MemoHeader = ({ id }: MemoHeaderProps) => {
  const queryClient = useQueryClient();

  const titleRef = useRef<HTMLInputElement>(null);
  const [provider] = useHocuspocusProvider(id);

  const attachedUsers = useAttachedUsers(provider);
  const inactiveUsers = useInactiveUsers(provider);

  const { data: memo } = useQuery(
    ['memo', id],
    async () => typeof id === 'string' ? fetchMemo(id) : null,
  );
  const titleMutation = useMutation(async (title: string) => {
    if (typeof id !== 'string') return;

    await updateMemo(id, { name: title });
    await queryClient.invalidateQueries(['memo', id]);
    await queryClient.invalidateQueries(['memo-list']);
  });

  const onBlurTitle = useCallback(() => {
    const currentTitle = titleRef.current?.value ?? '';

    if (currentTitle !== memo?.name) titleMutation.mutate(currentTitle);
  }, [memo?.name]);

  const isDark = useCallback((color: string) => {
    try {
      return Color(color.replaceAll('#', '')).isDark();
    } catch {}

    return false;
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;

    titleRef.current.value = memo?.name ?? '';
  }, [memo]);

  return (
    <header
      className={`
        w-full flex flex-col justify-start items-start gap-2 py-2
        bg-gray-100 border-b-[1px] border-gray-300
        dark:bg-gray-900 dark:border-gray-700
      `}
    >
      <MemoTab />
      <div className={'w-full flex justify-start items-center gap-2 px-4'}>
        <input
          ref={titleRef}
          className={'flex-1 font-bold text-2xl outline-none bg-transparent text-gray-900 dark:text-gray-100'}
          onBlur={onBlurTitle}
        />
        {attachedUsers.map((user) => (
          <div
            key={user.id}
            className={'w-fit flex justify-start items-center gap-1 rounded-full px-1 py-0 ring-2'}
            style={
              inactiveUsers.some((it) => it.id === user.id)
                ? { '--tw-ring-color': user.color }
                : { '--tw-ring-color': user.color, backgroundColor: user.color }
            }
          >
            <Profile profile={user.profile} className={'w-4 h-4'} />
            <span
              className={cx(
                'w-fit font-bold shrink-0',
                isDark(user.color) ? 'text-white' : 'text-black'
              )}
              style={
                inactiveUsers.some((it) => it.id === user.id)
                  ? { color: user.color }
                  : {}
              }
            >
              {user.name}
            </span>
          </div>
        ))}
      </div>
    </header>
  )
};

export default MemoHeader;
