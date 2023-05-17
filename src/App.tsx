import { useState } from 'react';
import { Router, Route } from 'wouter';

import MainPage from './features/main/pages/MainPage';
import MemoPage from './features/memo/pages/MemoPage';

const App = () => {
  return (
    <Router>
      <Route path={'/'} component={() => <MainPage />} />
      <Route path={'/memo'} component={() => <MemoPage />} />
    </Router>
  )
}

export default App;
