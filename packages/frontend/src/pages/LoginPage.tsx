import { useSetAtom } from 'jotai';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../store/auth';
import { useCallback, useRef } from 'react';
import { loginUser } from '../api/user';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { cx } from '../utils/className';
import { useMutation } from '@tanstack/react-query';
import ErrorDialog from '../components/common/ErrorDialog';

const LoginPage = () => {
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(ACCESS_TOKEN);
  const setRefreshToken = useSetAtom(REFRESH_TOKEN);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  /* defines */
  const { mutateAsync, isLoading, error } = useMutation(async ({
    email,
    password,
  }: { email?: string; password?: string; }) => {
    if (!email || !password) throw Error('이메일과 비밀번호를 입력해주세요.');
    const newToken = await loginUser(email, password);

    setAccessToken(newToken.accessToken);
    setRefreshToken(newToken.refreshToken);

    navigate('/', { replace: true });
  });

  /* methods, callbacks */
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    await mutateAsync({ email, password });
  };
  const onRegister = useCallback(() => {
    navigate('/register');
  }, []);

  return (
    <div className={'w-full h-full container mx-auto p-8 flex flex-col gap-2 justify-center items-center'}>
      <header className={'font-bold text-2xl flex flex-row gap-1 items-center'}>
        <i className={'material-symbols-outlined icon'}>
          note
        </i>
        메모
      </header>
      <form className={'w-full sm:w-72 flex flex-col justify-start items-stretch gap-2'} onSubmit={onSubmit}>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'email'}>이메일</label>
          <input
            required
            ref={emailRef}
            id={'email'}
            type={'email'}
            pattern={'[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'}
            className={'input'}
          />
        </div>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'password'}>비밀번호</label>
          <input
            required
            ref={passwordRef}
            id={'password'}
            type={'password'}
            className={'input'}
          />
        </div>
        <div className={'w-full flex justify-between items-center'}>
          <button
            type={'button'}
            className={'btn-text flex self-end items-center gap-1'}
            onClick={onRegister}
          >
            회원가입
          </button>
          <button
            type={'submit'}
            className={cx(
              'relative flex self-end items-center gap-1',
              isLoading ? 'btn-disabled' : 'btn-primary'
            )}
          >
            {
              isLoading
                ? <Spinner className={'w-4 h-4 stroke-gray-100 dark:stroke-gray-900'} />
                : <i className={'material-symbols-outlined icon text-base'}>
                  login
                </i>
            }
            로그인
          </button>
        </div>
      </form>
      <ErrorDialog
        error={error}
        title={'로그인에 실패하였습니다'}
      />
    </div>
  );
};

export default LoginPage;
