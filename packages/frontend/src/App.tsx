import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import MemoPage from './features/memo/pages/MemoPage';
import LoginPage from './features/login/pages/LoginPage';
import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/react/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ACCESS_TOKEN } from './store/auth';
import { queryClientAtom } from 'jotai-tanstack-query';

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: JSX.Element }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);

  return children;
};

const App = () => {
  const isLogin = useAtomValue(ACCESS_TOKEN);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrateAtoms>
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
      </HydrateAtoms>
    </QueryClientProvider>
  )
}

export default App;
