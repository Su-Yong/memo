import { User } from '@suyong/memo-core';
import { cx } from '../../utils/className';

export interface ProfileProps extends React.HTMLAttributes<HTMLElement> {
  user: Pick<User, 'profile'>;
}
const Profile = ({ user, ...props }: ProfileProps) => {
  return user.profile
    ? <img {...props} src={user.profile} className={cx('rounded-full bg-gray-200', props.className)} />
    : (
      <div {...props} className={cx('rounded-full bg-gray-200 flex justify-center items-center', props.className)}>
        <i className={'material-symbols-outlined icon text-gray-500 text-sm'}>
          person
        </i>
      </div>
    );
};

export default Profile;
