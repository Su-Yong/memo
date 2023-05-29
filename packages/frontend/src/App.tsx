import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import MemoPage from './pages/MemoPage';
import LoginPage from './pages/LoginPage';
import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/react/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ACCESS_TOKEN } from './store/auth';
import { queryClientAtom } from 'jotai-tanstack-query';
import { useEffect } from 'react';
import { THEME_MODE } from './store/preference';
import { useMediaQuery } from './hooks/useMediaQuery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10초
    },
  },
});

const HydrateAtoms = ({ children }: { children: JSX.Element }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);

  return children;
};

const App = () => {
  const isLogin = useAtomValue(ACCESS_TOKEN);
  const themeMode = useAtomValue(THEME_MODE);

  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    if (themeMode === 'dark' || (themeMode === 'system' && isSystemDarkMode)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode, isSystemDarkMode]);

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
