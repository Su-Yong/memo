import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import ErrorDialog from '../components/common/ErrorDialog';
import Spinner from '../components/common/Spinner';
import { cx } from '../utils/className';
import { useMutation } from '@tanstack/react-query';
import { checkCanRegisterUser, createUser } from '../api/user';
import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { uploadFile } from '../api/file';

const RegisterPage = () => {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordCheckRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [profile, setProfile] = useState<File | null>(null);
  const [position, setPosition] = useState(0);
  const [profileSrc, setProfileSrc] = useState('');

  /* defines */
  const emailCheck = useMutation(async () => checkCanRegisterUser(emailRef.current?.value ?? ''));
  const register = useMutation(async () => {
    if (!emailCheck.isSuccess) throw '이메일 중복 확인을 해주세요';

    let profileUrl: string | undefined;
    if (profile) {
      const fileMetadata = await uploadFile(profile);
      profileUrl = `/api/files/${fileMetadata.id}`;
    }

    await createUser({
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
      name,
      profile: profileUrl,
    });

    navigate('/');
  });

  const lastProfileSrc = useRef(profileSrc);
  useEffect(() => {
    if (!profile) return;
    if (lastProfileSrc.current) URL.revokeObjectURL(profileSrc);

    const url = URL.createObjectURL(profile);
    lastProfileSrc.current = url;
    setProfileSrc(url);
  }, [profile, lastProfileSrc]);

  /* methods, callbacks */
  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();

    if (position === 0) {
      setPosition(1);
    } else {
      register.mutate();
    }
  }, [position, name, profile]);
  const onProfileFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    flushSync(() => {
      setProfileSrc('');
    });

    setProfile(file);
  }, []);

  return (
    <div className={'w-full h-full container mx-auto p-8 flex flex-col gap-2 justify-center items-center'}>
      <header className={'font-bold text-2xl flex flex-row gap-1 items-center'}>
        <i className={'material-symbols-outlined icon'}>
          person
        </i>
        회원가입
      </header>
      <form className={'w-full sm:w-72 flex flex-col justify-start items-stretch gap-2'} onSubmit={onSubmit}>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'email'}>
            이메일
            <i className={'material-symbols-outlined icon text-red-500 text-[1rem]'}>
              emergency
            </i>
          </label>
          <input
            required
            ref={emailRef}
            id={'email'}
            type={'email'}
            pattern={emailCheck.isError ? '' : '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'}
            className={'input'}
            onChange={emailCheck.reset}
          />
          <div className={'w-full flex justify-between items-center gap-1'}>
            <span
              className={cx(
                'flex justify-start items-center gap-1 text-sm',
                emailCheck.isSuccess && 'text-green-500',
                emailCheck.isError && 'text-red-500',
                emailCheck.isLoading && 'text-gray-300 dark:text-gray-700',
              )}
            >
              {emailCheck.isLoading && <Spinner className={'w-4 h-4 stroke-gray-300 dark:stroke-gray-700'} />}
              <i className={'material-symbols-outlined icon text-sm'}>
                {emailCheck.isSuccess && 'check'}
                {emailCheck.isError && 'close'}
                {emailCheck.isIdle && 'close'}
              </i>
              <div>
                {emailCheck.isSuccess && '사용가능'}
                {emailCheck.isError && '사용불가능'}
                {emailCheck.isLoading && '확인중...'}
                {emailCheck.isIdle && '중복확인 안됨'}
              </div>
            </span>
            <button
              type={'button'}
              className={cx('btn-text flex text-sm')}
              onClick={() => emailCheck.mutate()}
            >
              중복확인
            </button>
          </div>
        </div>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'password'}>
            비밀번호
            <i className={'material-symbols-outlined icon text-red-500 text-[1rem]'}>
              emergency
            </i>
          </label>
          <input
            required
            ref={passwordRef}
            id={'password'}
            type={'password'}
            className={'input'}
            min={2}
            value={password}
            onChange={(event) => setPassword((event.target as HTMLInputElement).value)}
          />
        </div>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'passwordCheck'}>
            비밀번호 확인
            <i className={'material-symbols-outlined icon text-red-500 text-[1rem]'}>
              emergency
            </i>
          </label>
          <input
            required
            ref={passwordCheckRef}
            id={'passwordCheck'}
            type={'password'}
            className={'input'}
            min={2}
            value={passwordCheck}
            pattern={password}
            onChange={(event) => setPasswordCheck((event.target as HTMLInputElement).value)}
          />
        </div>
        {position > 0 && (
          <>
            <div className={'w-full h-[1px] bg-gray-200 my-2'} />
            <div className={'w-full flex flex-col gap-1'}>
              <label htmlFor={'name'}>이름</label>
              <input
                required
                id={'name'}
                type={'name'}
                className={'input'}
                value={name}
                onChange={(event) => setName((event.target as HTMLInputElement).value)}
              />
            </div>
            <div className={'w-full flex flex-row justify-between items-center gap-1'}>
              프로필 사진
              <button type={'button'} className={'relative btn-text btn-icon flex'}>
                <label className={'rounded-full w-8 h-8 overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-800'}>
                  {
                    profileSrc
                      ? <img src={profileSrc} className={'w-full h-full object-cover'} />
                      : <i className={'material-symbols-outlined icon text-sm'}>
                        person
                      </i>
                  }
                  <input type="file" accept="image/*" className={'hidden'} onChange={onProfileFile} />
                </label>
              </button>
            </div>
          </>
        )}
        {position < 1 && (
          <button
            type={'submit'}
            className={'btn-primary flex justify-center items-center gap-1'}
          >
            다음
            <i className={'material-symbols-outlined icon text-base'}>
              arrow_forward
            </i>
          </button>
        )}
        {position === 1 && (
          <button
            type={'submit'}
            className={cx(
              'relative flex self-end items-center gap-1',
              register.isLoading ? 'btn-disabled' : 'btn-primary'
            )}
          >
            {
              register.isLoading
                ? <Spinner className={'w-4 h-4 stroke-gray-100 dark:stroke-gray-900'} />
                : <i className={'material-symbols-outlined icon text-base'}>
                  upload
                </i>
            }
            회원가입
          </button>
        )}
      </form>
      <ErrorDialog
        error={register.error}
        title={'회원가입에 실패하였습니다'}
      />
    </div>
  );
};

export default RegisterPage;
