import { User } from '@suyong/memo-core';
import { cx } from '../../utils/className';
import Profile from './Profile';

export interface ProfileSetProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: Pick<User, 'profile' | 'id'>[];
  limit?: number;
}
const ProfileSet = ({
  users,
  limit = 3,
  ...props
}: ProfileSetProps) => {
  return (
    <div {...props} className={cx('flex justify-start items-center', props.className)}>
      {users?.slice(0, limit).map((user, index) => (
        <div key={user.id} className={'h-full aspect-[0.5]'}>
          <Profile
            key={index}
            user={user}
            className={'min-w-[200%] h-full aspect-square shadow-sm'}
          />
        </div>
      ))}
      {(users?.length ?? 0) > limit && (
        <div className={'h-full aspect-[0.5]'}>
          <div
            className={`
              min-w-[200%] h-full
              flex justify-center items-center text-center text-xs
              bg-gray-100 rounded-full shadow-sm
            `}
          >
            +{(users?.length ?? 0) - limit}
          </div>
        </div>
      )}
      <div className={'h-full aspect-[0.5]'}></div>
    </div>
  )
};

export default ProfileSet;
