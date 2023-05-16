import { useState } from 'react';
import { Router, Route } from 'wouter';

import MainPage from './features/main/pages/MainPage';

const App = () => {
  return (
    <Router>
      <Route path={'/'} component={() => <MainPage />} />
    </Router>
  )
}

export default App;
