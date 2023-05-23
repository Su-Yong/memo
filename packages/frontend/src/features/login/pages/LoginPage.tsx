import { useSetAtom } from 'jotai';
import { ACCESS_TOKEN } from '../../../store/auth';
import { useRef } from 'react';
import { loginUser } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(ACCESS_TOKEN);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) throw Error('이메일과 비밀번호를 입력해주세요.');
    const newToken = await loginUser(email, password);

    setAccessToken(newToken.accessToken);

    navigate('/', { replace: true });
  };

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
          <input ref={emailRef} id={'email'} type={'email'} className={'input'} />
        </div>
        <div className={'w-full flex flex-col gap-1'}>
          <label htmlFor={'password'}>비밀번호</label>
          <input ref={passwordRef} id={'password'} type={'password'} className={'input'} />
        </div>
        <button type={'submit'} className={'btn-primary flex self-end items-center gap-1'}>
          <i className={'material-symbols-outlined icon text-base'}>
            login
          </i>
          로그인
        </button>
      </form>
    </div>
  )
};

export default LoginPage;
