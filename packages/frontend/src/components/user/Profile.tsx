import { cx } from '../../utils/className';

export interface ProfileProps extends React.HTMLAttributes<HTMLElement> {
  profile?: string;
}
const Profile = ({ profile, ...props }: ProfileProps) => {
  return profile
    ? <img {...props} src={profile} className={cx('rounded-full bg-gray-200', props.className)} />
    : (
      <div {...props} className={cx('rounded-full bg-gray-200 flex justify-center items-center', props.className)}>
        <i className={'material-symbols-outlined icon text-gray-500 text-sm'}>
          person
        </i>
      </div>
    );
};

export default Profile;
