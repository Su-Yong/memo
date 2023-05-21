import { useSetAtom } from 'jotai';
import { accessToken } from '../../../store/auth';
import { useRef } from 'react';
import { loginUser } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(accessToken);

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
    <div className={'container mx-auto p-6 flex flex-col gap-2 justify-start items-start'}>
      <header className={'font-bold text-2xl flex flex-row gap-1 items-center'}>
        <i className={'material-symbols-outlined icon'}>
          note
        </i>
        메모
      </header>
      <form className={'flex flex-col justify-start items-stretch gap-2'} onSubmit={onSubmit}>
        <div className={'flex flex-col gap-1'}>
          <label htmlFor={'email'}>이메일</label>
          <input ref={emailRef} id={'email'} type={'email'} className={'input'} />
        </div>
        <div className={'flex flex-col gap-1'}>
          <label htmlFor={'password'}>비밀번호</label>
          <input ref={passwordRef} id={'password'} type={'password'} className={'input'} />
        </div>
        <button type={'submit'} className={'btn-primary flex self-end'}>
          로그인
        </button>
      </form>
    </div>
  )
};

export default LoginPage;
