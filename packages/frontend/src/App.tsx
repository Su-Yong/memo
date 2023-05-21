import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import MemoPage from './features/memo/pages/MemoPage';
import LoginPage from './features/login/pages/LoginPage';
import { useAtomValue } from 'jotai';
import { accessToken } from './store/auth';


const App = () => {
  const isLogin = useAtomValue(accessToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={'/'}
          element={
            isLogin
              ? <Navigate replace to={'/memo'} />
              : <Navigate replace to={'/login'} />
          }
        />
        <Route path={'/memo'} element={<MemoPage />} />
        <Route path={'/login'} element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
